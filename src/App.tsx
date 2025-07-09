import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import Routes from 'src/routes/index.routes'
import rootStore from './stores/root-store'
import 'antd/dist/reset.css'
import './App.css'
import socket from './socket'
import TitleUpdater from './utils/title'

const queryClient = new QueryClient()

export default function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })

    socket.on('orderUpdated', () => {
      console.log('Received orderUpdated, invalidating orders...')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    })

    socket.on('orderCreated', () => {
      console.log('Received orderCreated, invalidating orders...')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    })

    return () => {
      socket.off('connect')
      socket.off('orderUpdated')
      socket.off('orderCreated')
    }
  }, [])
  return (
    <Provider store={rootStore}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <BrowserRouter>
            <TitleUpdater />
            <Routes />
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  )
}
