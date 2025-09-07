export type ModelConfig = Record<string, unknown> & {
  name: string
}

export type Config = {
  models: ModelConfig[]
  currentModel?: string
  envVars: Array<{ key: string; required: boolean }>
}
