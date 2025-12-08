import { Request, Response, NextFunction } from 'express'
import { addressTrie } from '../data/addressTrie'
import { type Address } from '@ul-address-search/shared'
import { config } from '../config/applicationConfig'

const search = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.query || req.params.query.length < 3) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Search query must be at least 3 characters',
    })
  }

  // TODO: cleaner handling of potential Trie errors?
  try {
    // trie-search adds the '$tsid' property on the addresses to make sure every entry has a unique ID
    // we allow this, as it is probably more performant and robust than coming up with our own unique ID solution
    // to keep the response consistent with the Address type (and the assignment),
    // we make sure to extract only the Address fields from the search result
    const result = addressTrie
      .search(req.params.query)
      .slice(0, config.maxSearchResults)
      .map((result) => {
        const { $tsid, ...address } = result as any
        return address as Address
      })
    return res.send(result)
  } catch (e) {
    next(e)
  }
}

export default { search }
