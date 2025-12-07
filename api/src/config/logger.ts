import pino from 'pino'
import pinoHttp from 'pino-http'

const isDevelopment = process.env.NODE_ENV !== 'production'

// base logger instance
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname,req,res,responseTime',
        singleLine: true,
        messageFormat: '{msg}',
      },
    },
  }),

  ...(!isDevelopment && {
    formatters: {
      level: (label) => {
        return { level: label }
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  }),
})

// HTTP logger middleware
const httpLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn'
    } else if (res.statusCode >= 500 || err) {
      return 'error'
    }
    return 'info'
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`
  },
})

export { logger, httpLogger }
