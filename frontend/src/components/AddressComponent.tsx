import type { ReactElement } from 'react'
import './AddressComponent.css'
import type { Address } from '../../../shared/types/address'

function AddressComponent({ address }: { address: Address }): ReactElement {
  return (
    <div className="address">
      <div className="street">
        {address.street}, {address.postNumber} {address.municipality}
      </div>
      {/* <div className="city">
        {address.city}, {address.county}
      </div> */}
    </div>
  )
}

export default AddressComponent
