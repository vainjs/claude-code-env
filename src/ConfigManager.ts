import type { Config, ModelConfig } from './types'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'

export class ConfigManager {
  private configPath: string

  constructor(configPath?: string) {
    this.configPath = configPath || path.join(os.homedir(), '.claude-code-env.json')
  }

  loadConfig(): Config {
    try {
      // Create default config if file doesn't exist
      if (!fs.existsSync(this.configPath)) {
        this.createDefaultConfig()
      }

      const configData = fs.readFileSync(this.configPath, 'utf-8')
      return JSON.parse(configData)
    } catch (error) {
      throw new Error(`Failed to load config from ${this.configPath}: ${error}`)
    }
  }

  private createDefaultConfig(): void {
    const defaultConfig: Config = {
      models: [],
      currentModel: '',
    }

    this.saveConfig(defaultConfig)
  }

  saveConfig(config: Config): void {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf-8')
    } catch (error) {
      throw new Error(`Failed to save config to ${this.configPath}: ${error}`)
    }
  }

  getModels(): ModelConfig[] {
    const config = this.loadConfig()
    return config.models
  }

  getCurrentModel(): ModelConfig | null {
    const config = this.loadConfig()
    if (!config.currentModel) return null

    const model = config.models.find((m) => m.name === config.currentModel)
    return model || null
  }

  setCurrentModel(modelName: string): void {
    const config = this.loadConfig()
    const model = config.models.find((m) => m.name === modelName)

    if (!model) {
      throw new Error(`Model "${modelName}" not found in configuration`)
    }

    config.currentModel = modelName
    this.saveConfig(config)
  }

  addModel(model: ModelConfig): void {
    const config = this.loadConfig()

    // Check if model with same name already exists
    const existingIndex = config.models.findIndex((m) => m.name === model.name)
    if (existingIndex >= 0) {
      config.models[existingIndex] = model
    } else {
      config.models.push(model)
    }

    this.saveConfig(config)
  }

  getConfigPath(): string {
    return this.configPath
  }

  removeModel(modelName: string): void {
    const config = this.loadConfig()
    config.models = config.models.filter((m) => m.name !== modelName)

    // Reset current model if it was the removed one
    if (config.currentModel === modelName) {
      config.currentModel = config.models.length > 0 ? config.models[0].name : undefined
    }

    this.saveConfig(config)
  }
}
