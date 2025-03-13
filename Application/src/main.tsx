import React from 'react'
import ReactDOM from 'react-dom/client'
import Ways from './config/ways'
import './style/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Ways />
  </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
