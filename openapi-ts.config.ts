import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'loaders/pretalx/schema.yml',
  output: {
    path: 'loaders/pretalx/oapi',
  },
  plugins: ['@hey-api/client-fetch'],
})
