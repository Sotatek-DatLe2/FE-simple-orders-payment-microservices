import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import Routes from 'src/routes/index.routes'
import rootStore from './stores/root-store'
import 'antd/dist/reset.css'
import './App.css'

const queryClient = new QueryClient()

export default function App() {
  return (
    <Provider store={rootStore}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  )
}
