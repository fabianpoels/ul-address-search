import { type Address } from '../../../shared/types/address'
import { config } from '../config/config'

async function search(query: string, signal?: AbortSignal): Promise<Array<Address>> {
  const response = await fetch(`${config.apiUrl}/search/${query}`, {
    signal,
  })
  const result = (await response.json()) as Array<Address>
  return result
}

export { search }
