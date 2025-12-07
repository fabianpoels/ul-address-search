import { type Address } from '../../../shared/types/address'

async function search(query: string): Promise<Array<Address>> {
  const response = await fetch(`http://localhost:8080/api/v1/search/${query}`)
  const result = (await response.json()) as Array<Address>
  return result
}

export { search }
