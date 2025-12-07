import { useRef, useState, type ReactElement } from 'react'
import './App.css'
import LoadingSpinner from './components/LoadingSpinner'
import { search } from './api/api'
import type { Address } from '../../shared/types/address'
import AddressComponent from './components/AddressComponent'

function App(): ReactElement {
  const [loading, setLoading] = useState<boolean>(false)
  const [addresses, setAddresses] = useState<Array<Address>>()
  const abortControllerRef = useRef<AbortController | null>(null)

  async function handleInputChange(query: string) {
    if (query.length < 3) {
      setAddresses([])
      return
    }
    setLoading(true)

    // cancel previous request if it exists
    if (abortControllerRef.current) abortControllerRef.current.abort()

    abortControllerRef.current = new AbortController()

    try {
      setAddresses(await search(query, abortControllerRef.current.signal))
      setLoading(false)
    } catch (e) {
      // ignore the error if the request was aborted
      if (e instanceof Error && e.name === 'AbortError') {
        return
      }
      console.error(e)
      setLoading(false)
    }
  }

  const addressComponents = addresses?.map((address, idx) => (
    <AddressComponent address={address} key={idx} />
  ))

  return (
    <>
      <div id="search-wrapper">
        <input
          type="text"
          id="search-input"
          placeholder="Search address"
          onChange={(e) => handleInputChange(e.target.value)}
        />
        <LoadingSpinner loading={loading} />
      </div>
      <div id="search-results">{addressComponents}</div>
    </>
  )
}

export default App
