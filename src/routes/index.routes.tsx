import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PrivateRoutes from 'src/routes/Private.routes'
import Loading from 'src/components/loading'
import { getAccessToken } from 'src/utils/auth'
import PublicRoutes from 'src/routes/Public.routes'
import React from 'react'

export default function Routes() {
  const location = useLocation()

  useEffect(() => {
    getAccessToken()
  }, [location.pathname])

  return (
    <>
      <Loading />
      {getAccessToken() ? <PrivateRoutes /> : <PublicRoutes />}
    </>
  )
}
