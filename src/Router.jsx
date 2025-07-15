import { useState, useEffect } from 'react'
import App from './App'
import AdminPage from './components/AdminPage'

function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  // Simple routing logic
  if (currentPath === '/ashikadmin') {
    return <AdminPage />
  }

  // Default to main landing page
  return <App navigate={navigate} />
}

export default Router
