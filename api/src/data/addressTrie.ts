import { readFileSync } from 'node:fs'
import { Address } from '../../types/address'
import { join } from 'node:path'
import TrieSearch from 'trie-search'

const addressData: Address[] = JSON.parse(
  readFileSync(join(process.cwd(), 'src', 'data', 'addresses.json'), 'utf-8')
)

const addressTrie = new TrieSearch<Address>(['street'], {
  min: 3,
  ignoreCase: true,
  splitOnRegEx: /\s/g,
})

// TODO: handle erroneous input data
addressTrie.addAll(addressData)

export { addressTrie }
