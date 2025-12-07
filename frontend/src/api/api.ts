import { type Address } from '../../../shared/types/address'

async function search(query: string, signal?: AbortSignal): Promise<Array<Address>> {
  const response = await fetch(`http://localhost:8080/api/v1/search/${query}`, {
    signal,
  })
  const result = (await response.json()) as Array<Address>
  return result
}

export { search }
