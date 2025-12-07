interface ApplicationConfig {
  port: number
  corsWhitelist: Array<String>
  maxSearchResults: number
}

const config: ApplicationConfig = {
  port: parseInt(process.env.PORT || '8080'),
  corsWhitelist: ['http://localhost:5173'],
  maxSearchResults: 20,
}

export { config }
export type { ApplicationConfig }
