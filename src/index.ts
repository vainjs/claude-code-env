#!/usr/bin/env node

import type { ModelConfig } from './types'
import { includes, map, trim, reduce, forEach, padEnd, repeat } from 'lodash-es'
import { Command } from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { EnvironmentManager } from './EnvironmentManager'
import { ConfigManager } from './ConfigManager'
import { ANTHROPIC_ENV } from './enum'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
)

const program = new Command()
const configManager = new ConfigManager()
const envManager = new EnvironmentManager()

program
  .name('claude-code-env')
  .description('CLI tool for managing Claude Code model configurations')
  .version(packageJson.version)

program
  .command('list')
  .alias('ls')
  .description('List configured models')
  .action(async () => {
    try {
      const models = configManager.getModels()
      const currentModel = configManager.getCurrentModel()

      if (models.length === 0) {
        console.log(chalk.yellow('■ No models configured.'))
        console.log(chalk.dim('  ↳ Please add a model first using "cce add"'))
        return
      }

      console.log()
      console.log(chalk.green('■ Configured Models'))
      console.log()

      // Header
      console.log(chalk.dim('  NAME' + repeat(' ', 21) + 'ANTHROPIC_MODEL'))
      console.log(chalk.dim('  ' + repeat('─', 60)))

      // Models
      models.forEach((model) => {
        const isCurrent =
          currentModel?.name === model.name ? chalk.green('●') : ' '
        const name = padEnd(model.name, 24)
        const anthropicModel = model.ANTHROPIC_MODEL
          ? chalk.cyan(model.ANTHROPIC_MODEL)
          : chalk.gray('Default')
        console.log(`${isCurrent} ${chalk.white(name)} ${anthropicModel}`)
      })

      console.log()
      if (currentModel) {
        console.log(
          chalk.white(`Current model: `) + chalk.cyan(currentModel.name)
        )
      } else {
        console.log(
          chalk.dim(
            'No model currently selected. Use "cce use <model>" to select one.'
          )
        )
      }
      console.log()
    } catch (error) {
      console.error(chalk.red('✗ Error:'), error)
      process.exit(1)
    }
  })

// Add a new model
program
  .command('add')
  .description('Add a new model configuration')
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Model name:',
          validate: (input) => trim(input) !== '' || 'Name is required',
        },
        ...map(ANTHROPIC_ENV, (env) => {
          if (includes(['ANTHROPIC_BASE_URL', 'ANTHROPIC_AUTH_TOKEN'], env)) {
            return {
              type: 'input',
              name: env,
              message: `${env}:`,
              validate: (input: string) =>
                trim(input) !== '' || `${env} is required`,
            }
          } else {
            return {
              type: 'input',
              name: env,
              message: `${env} (optional):`,
            }
          }
        }),
        {
          type: 'input',
          name: 'description',
          message: 'Description (optional):',
        },
      ])

      const model = reduce(
        ['name', ...ANTHROPIC_ENV, 'description'],
        (acc, env) => {
          const v = trim(answers[env])
          return v ? { ...acc, [env]: v } : acc
        },
        {} as ModelConfig
      )

      configManager.addModel(model)
      console.log()
      console.log(
        chalk.green(`✓ Model "${chalk.white(model.name)}" added successfully`)
      )
      console.log()
      console.log(chalk.yellow('■ Next Step:'))
      console.log(
        chalk.dim('  ↳ Run "cce use <model>" to select and use this model')
      )
      console.log()
    } catch (error) {
      console.error(chalk.red('✗ Error:'), error)
      process.exit(1)
    }
  })

// Use a specific model
program
  .command('use')
  .description('Use a specific model')
  .argument('[model]', 'Model name to use')
  .action(async (modelName) => {
    try {
      const models = configManager.getModels()

      if (models.length === 0) {
        console.log(chalk.yellow('■ No models configured.'))
        console.log(chalk.dim('  ↳ Add models first using "cce add"'))
        return
      }

      let targetModelName = modelName

      if (!targetModelName) {
        const { selectedModel } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedModel',
            message: 'Select a model to use:',
            choices: models.map((model) => ({
              name: model.name,
              value: model.name,
            })),
          },
        ])
        targetModelName = selectedModel
      }

      const model = models.find((m) => m.name === targetModelName)

      if (!model) {
        console.error(chalk.red(`✗ Model "${targetModelName}" not found`))
        console.log(chalk.dim('  ↳ Run "cce list" to see available models'))
        return
      }

      configManager.setCurrentModel(targetModelName)
      envManager.setEnvironmentVariables(model)
    } catch (error) {
      console.error(chalk.red('✗ Error:'), error)
      process.exit(1)
    }
  })

// Remove a model
program
  .command('remove')
  .alias('rm')
  .description('Remove a model configuration')
  .argument('[model]', 'Model name to remove')
  .action(async (modelName) => {
    try {
      const models = configManager.getModels()

      if (models.length === 0) {
        console.log(chalk.yellow('■ No models configured.'))
        console.log(chalk.dim('  ↳ Add models first using "cce add"'))
        return
      }

      let modelToRemove = modelName

      if (!modelToRemove) {
        const { selectedModel } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedModel',
            message: 'Select a model to remove:',
            choices: models.map((model) => ({
              name: model.name,
              value: model.name,
            })),
          },
        ])
        modelToRemove = selectedModel
      }

      const model = models.find((m) => m.name === modelToRemove)

      if (!model) {
        console.error(chalk.red(`✗ Model "${modelToRemove}" not found`))
        console.log(chalk.dim('  ↳ Run "cce list" to see available models'))
        return
      }

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Are you sure you want to remove "${modelToRemove}"?`,
          default: false,
        },
      ])

      if (confirm) {
        configManager.removeModel(modelToRemove)
        console.log()
        console.log(
          chalk.green(
            `✓ Model "${chalk.white(modelToRemove)}" removed successfully`
          )
        )
        const remainingModels = configManager.getModels()
        if (remainingModels.length === 0) {
          console.log(
            chalk.dim('  ↳ No models remaining. Add new models with "cce add"')
          )
        }
        console.log()
      } else {
        console.log(chalk.gray('■ Operation cancelled'))
      }
    } catch (error) {
      console.error(chalk.red('✗ Error:'), error)
      process.exit(1)
    }
  })

// Show current status
program
  .command('status')
  .description('Show current model and environment variables')
  .action(async () => {
    try {
      const currentModel = configManager.getCurrentModel()
      const currentEnv = envManager.getCurrentEnvironmentVariables()

      // Config file location
      console.log()
      console.log(chalk.green('■ Configuration'))
      console.log(`   File: ${chalk.white(configManager.getConfigPath())}`)
      console.log()

      // Current model info
      console.log(chalk.green('■ Current Model'))
      if (currentModel) {
        console.log(`   ${padEnd('Name', 32)} ${chalk.cyan(currentModel.name)}`)
        console.log(
          `   ${padEnd('Description', 32)} ${chalk.gray(
            currentModel.description || 'Not set'
          )}`
        )
        forEach(ANTHROPIC_ENV, (env) => {
          const v = currentModel[env]
          console.log(
            `   ${padEnd(env, 32)} ${v ? chalk.cyan(v) : chalk.gray('Not set')}`
          )
        })
      } else {
        console.log(chalk.red('   ✗  No model currently selected'))
        console.log(chalk.dim('   ↳ Run "cce use <model>" to select a model'))
      }
      console.log()

      // Environment variables
      console.log(chalk.green('■ Environment Variables'))

      forEach(ANTHROPIC_ENV, (env) => {
        const value = currentEnv[env]
        const status = value ? chalk.green('✓') : chalk.red('✗')
        const displayValue = value ? chalk.cyan(value) : chalk.gray('Not set')
        console.log(`   ${status} ${padEnd(env, 30)} ${displayValue}`)
      })

      const hasRequiredVars =
        currentEnv.ANTHROPIC_BASE_URL && currentEnv.ANTHROPIC_AUTH_TOKEN
      if (!hasRequiredVars) {
        console.log()
        console.log(
          chalk.dim(
            '   ↳ Tip: Environment variables are not set for this session.'
          )
        )
        console.log(chalk.dim('   ↳ Run "cce use <model>" to configure them.'))
      }
      console.log()
    } catch (error) {
      console.error(chalk.red('✗ Error:'), error)
      process.exit(1)
    }
  })

program.parse()
