import { Request, Response, NextFunction } from 'express'
import { searchAddresses } from '../services/searchService'
import { config } from '../config/applicationConfig'

const search = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.query || req.params.query.length < 3) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Search query must be at least 3 characters',
    })
  }

  try {
    const result = searchAddresses(req.params.query, config.maxSearchResults)
    return res.send(result)
  } catch (e) {
    next(e)
  }
}

export default { search }
