import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import { Routes_URL } from 'src/routes/constants.routes'
import Loading from 'src/components/loading'
import Home from 'src/pages/home'
import OrderDetail from 'src/pages/order'
import ProductCartList from 'src/pages/product'
import CartDetailPage from 'src/pages/cart'

export default function PrivateRoutes() {
  const routes = [
    {
      path: Routes_URL.landingPage,
      component: <Home />,
    },
    {
      path: Routes_URL.orderDetailPage,
      component: <OrderDetail />,
    },
    {
      path: Routes_URL.productListPage,
      component: <ProductCartList />,
    },
    {
      path: Routes_URL.cartPage,
      component: <CartDetailPage />,
    }
  ]

  return (
    <div className="flex bg-white gap-2 min-h-screen overflow-x-hidden mx-auto w-full">
      <Suspense fallback={<Loading />}>
        <div className="flex w-full">
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.component} />
            ))}
          </Routes>
        </div>
      </Suspense>
    </div>
  )
}
