import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import { Routes_URL } from 'src/routes/constants.routes'
import Loading from 'src/components/loading'
import Home from 'src/pages/home'
import OrderDetail from 'src/pages/order'

const RoutesContainerStyled = styled('div')`
  overflow: hidden;
  height: 100vh;
`

const RoutesStyled = styled('div')`
  padding: 24px 16px 24px 0;
`

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
  ]

  return (
    <RoutesContainerStyled>
      <Suspense fallback={<Loading />}>
        <RoutesStyled>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.component} />
            ))}
          </Routes>
        </RoutesStyled>
      </Suspense>
    </RoutesContainerStyled>
  )
}
