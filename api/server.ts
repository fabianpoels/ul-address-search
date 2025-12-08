import { config } from './src/config/applicationConfig'
import { logger } from './src/config/logger'
import { api } from './src/api'
import type { Server } from 'http'

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error)
  exitHandler()
}

let server: Server | undefined

try {
  server = api.listen(config.port, () => {
    logger.info(`APP RUNNING ON PORT ${config.port}`)
  })
} catch (error) {
  unexpectedErrorHandler(error as Error)
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
