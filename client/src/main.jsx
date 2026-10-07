import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <App />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#151515',
              color: '#F7F2E8',
              border: '1px solid #C6A15B',
            },
            success: {
              iconTheme: {
                primary: '#C6A15B',
                secondary: '#151515',
              },
            },
          }}
        />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
)
