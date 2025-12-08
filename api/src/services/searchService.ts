import { addressTrie } from '../data/addressTrie'
import { type Address } from '@ul-address-search/shared'

export class SearchValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SearchValidationError'
  }
}

export const searchAddresses = (query: string, maxResults?: number): Address[] => {
  if (!query || query.length < 3) {
    throw new SearchValidationError('Search query must be at least 3 characters')
  }

  let results = addressTrie.search(query)
  if (maxResults) results = results.slice(0, maxResults)

  // https://www.npmjs.com/package/trie-search#release-notes--changelog
  //
  // trie-search adds the '$tsid' property on the addresses to make sure every entry has a unique ID
  // we allow this, as it is probably more performant and robust than coming up with our own unique ID solution
  //
  // to keep the response consistent with the Address type (and the assignment),
  // we make sure to extract only the Address fields from the search result
  return results.map((result) => {
    const { $tsid, ...address } = result as any
    return address as Address
  })
}
