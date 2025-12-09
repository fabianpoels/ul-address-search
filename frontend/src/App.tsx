import { useRef, useState, type ReactElement } from 'react'
import './App.css'
import LoadingSpinner from './components/LoadingSpinner'
import { search } from './api/api'
import { type Address } from '@ul-address-search/shared'
import AddressComponent from './components/AddressComponent'
import ErrorMessage from './components/ErrorMessage'

function App(): ReactElement {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [addresses, setAddresses] = useState<Array<Address>>()
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [errors, setErrors] = useState<Array<Error>>([])
  const abortControllerRef = useRef<AbortController | null>(null)

  async function handleInputChange(query: string) {
    setSearchQuery(query)
    setSelectedAddress(null)
    if (query.length < 3) {
      setAddresses([])
      return
    }
    setLoading(true)

    // cancel previous request if it exists
    cancelSearch()

    abortControllerRef.current = new AbortController()

    try {
      setAddresses(await search(query, abortControllerRef.current.signal))
      setLoading(false)
    } catch (e) {
      // ignore the error if the request was aborted
      if (e instanceof Error && e.name === 'AbortError') {
        return
      }

      const error = e instanceof Error ? e : new Error(String(e))
      setErrors([...errors, error])
      console.error(e)
      setLoading(false)
    }
  }

  const showClear: boolean = searchQuery.length > 0

  function clearInput(): void {
    setSearchQuery('')
    cancelSearch()
    setAddresses([])
    setSelectedAddress(null)
  }

  function cancelSearch() {
    if (abortControllerRef.current) abortControllerRef.current.abort()
  }

  function selectAddress(address: Address) {
    setSearchQuery(`${address.street}, ${address.postNumber} ${address.municipality}`)
    setSelectedAddress(address)
    cancelSearch()
    setAddresses([])
  }

  function removeError(index: number) {
    setErrors(errors.filter((_, i) => i !== index))
  }

  const addressComponents = addresses?.map((address, idx) => (
    <AddressComponent address={address} key={idx} onClick={() => selectAddress(address)} />
  ))

  const errorMessages = errors.map((error, idx) => (
    <ErrorMessage error={error} key={idx} remove={() => removeError(idx)} />
  ))

  return (
    <>
      <div id="error-messages">{errorMessages}</div>
      <div id="search-wrapper">
        <div id="input-wrapper">
          <input
            type="text"
            id="search-input"
            placeholder="Search address"
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            className={selectedAddress === null ? '' : 'valid-input'}
          />
          {showClear && (
            <div id="search-clear" onClick={clearInput}>
              X
            </div>
          )}
          <div id="search-results">{addressComponents}</div>
        </div>
        <LoadingSpinner loading={loading} />
      </div>
    </>
  )
}

export default App
