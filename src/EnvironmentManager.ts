import type { AnthropicEnvKey, ModelConfig } from './types'
import { includes, forEach, every, pick } from 'lodash-es'
import * as path from 'path'
import chalk from 'chalk'
import * as fs from 'fs'
import * as os from 'os'
import { ANTHROPIC_ENV } from './enum'

export class EnvironmentManager {
  private getShellConfigPath(shell: string): string {
    const homeDir = os.homedir()
    switch (shell) {
      case 'bash':
        return path.join(homeDir, '.bashrc')
      case 'zsh':
        return path.join(homeDir, '.zshrc')
      default:
        throw new Error(`Unsupported shell: ${shell}`)
    }
  }

  private getCurrentShell(): string {
    const shell = process.env.SHELL
    if (!shell) return 'bash'
    if (includes(shell, 'zsh')) return 'zsh'
    return 'bash'
  }

  setEnvironmentVariables(model: ModelConfig, shell?: string) {
    this.setPermanentEnvironmentVariables(model, shell)
  }

  private async updateEnvironmentVariables(
    model: ModelConfig,
    shell?: string
  ): Promise<void> {
    forEach(ANTHROPIC_ENV, (env: AnthropicEnvKey) => {
      if (model[env]) {
        process.env[env] = String(model[env])
      } else {
        delete process.env[env]
      }
    })

    await this.updateShellConfiguration(model, shell)
    await this.applyEnvironmentChanges(model, shell)
  }

  private async updateShellConfiguration(
    model: ModelConfig,
    shell?: string
  ): Promise<void> {
    const currentShell = shell || this.getCurrentShell()
    const configPath = this.getShellConfigPath(currentShell)
    if (!configPath) return

    let configContent = ''
    if (fs.existsSync(configPath)) {
      configContent = fs.readFileSync(configPath, 'utf-8')
    }

    const lines = configContent.split('\n')
    const filteredLines = lines.filter(
      (line) =>
        every(
          ANTHROPIC_ENV,
          (env: AnthropicEnvKey) => !line.startsWith(`export ${env}=`)
        ) && !line.includes('# Claude Code Env CLI - Model Configuration')
    )

    filteredLines.push('# Claude Code Env CLI - Model Configuration')
    forEach(ANTHROPIC_ENV, (env: AnthropicEnvKey) => {
      if (model[env]) {
        filteredLines.push(`export ${env}="${model[env]}"`)
      }
    })

    fs.writeFileSync(configPath, filteredLines.join('\n'), 'utf-8')
  }

  private async applyEnvironmentChanges(
    model: ModelConfig,
    shell?: string
  ): Promise<void> {
    const currentShell = shell || this.getCurrentShell()

    console.log()
    console.log(
      chalk.green(
        `✓ Set environment variables for model: ${chalk.white(model.name)}`
      )
    )

    forEach(ANTHROPIC_ENV, (env: AnthropicEnvKey) => {
      if (model[env]) {
        if (env === 'ANTHROPIC_AUTH_TOKEN') {
          console.log(
            chalk.dim(`  ${env}=${chalk.cyan(model[env].substring(0, 10))}...`)
          )
        } else {
          console.log(chalk.dim(`  ${env}=${chalk.cyan(model[env])}`))
        }
      }
    })

    console.log(chalk.green(`✓ Updated ${currentShell} configuration`))
    console.log(chalk.dim(`  File: ${this.getShellConfigPath(currentShell)}`))

    const sourceCommand = `source ${
      currentShell === 'zsh' ? '~/.zshrc' : '~/.bashrc'
    }`

    console.log()
    console.log(chalk.yellow('■ Next Step:'))
    console.log(
      chalk.dim(
        '  ↳ Restart your terminal or run: ' + chalk.cyan(sourceCommand)
      )
    )
    console.log()
  }

  private async setPermanentEnvironmentVariables(
    model: ModelConfig,
    shell?: string
  ): Promise<void> {
    try {
      await this.updateEnvironmentVariables(model, shell)
    } catch (error) {
      throw new Error(`Failed to update shell configuration: ${error}`)
    }
  }

  getCurrentEnvironmentVariables() {
    return pick(process.env, ANTHROPIC_ENV)
  }
}
