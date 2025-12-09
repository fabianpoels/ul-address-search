import type { ReactElement } from 'react'
import './ErrorMessage.css'

function ErrorMessage({ error, remove }: { error: Error; remove: () => void }): ReactElement {
  return (
    <div className="error-message">
      <div className="error-header">
        <div className="error-name">{error.name}</div>
        <div className="error-dismiss" onClick={remove}>
          dismiss
        </div>
      </div>
      <div className="error-content">{error.message}</div>
    </div>
  )
}

export default ErrorMessage
