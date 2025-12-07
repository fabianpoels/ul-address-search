import { useState, type ReactElement } from 'react'
import './App.css'
import LoadingSpinner from './components/LoadingSpinner'
import { search } from './api/api'
import type { Address } from '../../shared/types/address'
import AddressComponent from './components/AddressComponent'

function App(): ReactElement {
  const [loading, setLoading] = useState<boolean>(false)
  const [addresses, setAddresses] = useState<Array<Address>>()
  async function handleInputChange(query: string) {
    if (query.length < 3) {
      setAddresses([])
      return
    }
    setLoading(true)
    try {
      setAddresses(await search(query))
    } catch (e) {
      console.error(e)
    } finally {
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
