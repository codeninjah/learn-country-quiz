import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './flags32-both.css'
import App from './App'

const profile = localStorage.getItem('profile')

if (!profile) {
  if (Math.floor(Math.random() * 10) > 3) {
    localStorage.setItem('profile', 'rest')
  } else {
    localStorage.setItem('profile', 'pilots')
  }
}

const consent = localStorage.getItem('cookieConsent')

if (consent) {
  window['ga-disable-G-S56RDCKLLD'] = false
}

localStorage.setItem('improvedScoring', 'true')
localStorage.setItem('extraFlag', 'true')
localStorage.setItem('randomizedOrder', 'true')
localStorage.setItem('tie', 'true')

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
