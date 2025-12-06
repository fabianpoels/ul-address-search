import { Request, Response, NextFunction } from 'express'
import { addressTrie } from '../data/addressTrie'

const search = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.query || req.params.query.length < 3) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Search query must be at least 3 characters',
    })
  }

  // TODO: cleaner handling of potential Trie errors?
  try {
    return res.send(addressTrie.search(req.params.query))
  } catch (e) {
    next(e)
  }
}

export default { search }
