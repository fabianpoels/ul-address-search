import type { ReactElement } from 'react'
import './AddressComponent.css'
import type { Address } from '@ul-address-search/shared'

function AddressComponent({
  onClick,
  address,
}: {
  onClick?: React.MouseEventHandler<HTMLDivElement>
  address: Address
}): ReactElement {
  return (
    <div className="address" onClick={onClick}>
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
