import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TitleUpdater = () => {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname
    const title =
      path === '/'
        ? 'Home'
        : path
            .slice(1)
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase())
    document.title = `${title} - SotaTek Practice`
  }, [location])

  return null
}

export default TitleUpdater
