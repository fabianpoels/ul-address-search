import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'

import routesV1 from './routes/v1/index'
import { config } from './config/applicationConfig'
import { httpLogger } from './config/logger'

const api = express()

// logging
api.use(httpLogger)

// security HTTP headers
api.use(helmet())

// parse json request body
api.use(express.json())

// parse urlencoded request body
api.use(express.urlencoded({ extended: true }))

// compression
api.use(compression())

// enable cors
const corsOptions = {
  origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
    return cb(null, true)
    // // Allow requests with no origin
    // // TODO: rework, depending on env
    // if (!origin) return cb(null, true)

    // if (config.corsWhitelist.includes(origin)) {
    //   cb(null, true)
    // } else {
    //   cb(new Error('Not allowed by CORS'))
    // }
  },
}
const apiCors = cors(corsOptions)
api.use(apiCors)

// API routes
api.use('/api/v1', routesV1)

export { api }
