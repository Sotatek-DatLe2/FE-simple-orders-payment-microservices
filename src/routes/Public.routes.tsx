import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Loading from 'src/components/loading'
import Home from 'src/pages/home'
import { Routes_URL } from 'src/routes/constants.routes'

const Login = React.lazy(() => import('src/pages/auth/login'))

export default function PublicRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path={Routes_URL.loginPage} element={<Login />} />
        <Route path="*" element={<Navigate to={Routes_URL.loginPage} />} />
      </Routes>
    </Suspense>
  )
}
