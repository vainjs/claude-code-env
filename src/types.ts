export type AnthropicEnv = {
  ANTHROPIC_SMALL_FAST_MODEL?: string
  ANTHROPIC_MAX_TOKENS?: number
  ANTHROPIC_AUTH_TOKEN: string
  ANTHROPIC_BASE_URL: string
  ANTHROPIC_MODEL?: string
}

export type AnthropicEnvKey = keyof AnthropicEnv

export type ModelConfig = AnthropicEnv & {
  description?: string
  name: string
}

export type Config = {
  models: ModelConfig[]
  currentModel?: string
}
