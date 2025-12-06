interface ApplicationConfig {
  port: number
  corsWhitelist: Array<String>
}

const config: ApplicationConfig = {
  port: parseInt(process.env.PORT || '8080'),
  corsWhitelist: ['http://localhost:3000'],
}

export { config }
export type { ApplicationConfig }
