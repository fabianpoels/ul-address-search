import type { ReactElement } from 'react'
import './LoadingSpinner.css'

function LoadingSpinner({ loading = false }: { loading: boolean }): ReactElement {
  return <div className="spinner-wrapper">{loading && <div className="loading-spinner"></div>}</div>
}

export default LoadingSpinner
