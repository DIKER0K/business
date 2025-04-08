import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { app } from './firebase/config'
import NavigationPanel from './components/NavigationPanel'
import StartPage from './pages/StartPage'
import FirstPage from './pages/FirstPage'

function RootComponent() {
  const [user, setUser] = useState<any>(null)
  const auth = getAuth(app)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [auth])

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/app" /> : <StartPage />} />
        <Route 
          path="/app/*" 
          element={
            <>
              <FirstPage />
              <NavigationPanel 
                activeTab="main" 
                setActiveTab={() => {}}
                user={user}
              />
            </>
          } 
        />
      </Routes>
    </Router>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>
)
