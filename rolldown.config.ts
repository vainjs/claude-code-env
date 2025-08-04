import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    format: 'es',
    file: 'dist/bundle.js',
    minify: true,
  },
  platform: 'node',
})
