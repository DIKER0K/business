import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { app } from './firebase/config'
import NavigationPanel from './components/NavigationPanel'
import StartPage from './pages/StartPage'
import FirstPage from './pages/FirstPage'
import BusinessPage from './pages/BusinessPage'
import FeaturedPage from './pages/FeaturedPage'
import { User } from 'firebase/auth'

function RootComponent() {
  const [user, setUser] = useState<User | null>(null)
  const [currentLocation, setCurrentLocation] = useState("Калининград")
  const [loadingLocation, setLoadingLocation] = useState(false)
  const auth = getAuth(app)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [auth])

  // Общая функция для определения местоположения
  const getLocation = () => {
    setLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=ru`
            )
            const data = await response.json()
            const city = data.address.city || 
                        data.address.town || 
                        data.address.village || 
                        "Калининград"
            setCurrentLocation(city)
          } catch (error) {
            console.error("Ошибка при определении местоположения:", error)
            setCurrentLocation("Калининград")
          } finally {
            setLoadingLocation(false)
          }
        },
        (error) => {
          console.error("Ошибка геолокации:", error)
          setCurrentLocation("Калининград")
          setLoadingLocation(false)
        }
      )
    } else {
      setCurrentLocation("Калининград")
      setLoadingLocation(false)
    }
  }

  return (
    <Router>
      <Routes>
        {/* Основной маршрут с проверкой авторизации */}
        <Route path="/" element={
          user ? <Navigate to="/app" replace /> : <StartPage />
        }/>
        
        {/* Защищенные маршруты */}
        <Route path="/app" element={
          user ? (
            <>
              <FirstPage 
                currentLocation={currentLocation}
                loadingLocation={loadingLocation}
                getLocation={getLocation}
              />
              <NavigationPanel 
                currentLocation={currentLocation}
                loadingLocation={loadingLocation}
                getLocation={getLocation}
              />
            </>
          ) : <Navigate to="/" replace />
        }/>
        
        <Route path="/business" element={
          user ? (
            <>
              <BusinessPage />
              <NavigationPanel 
                activeTab="business" 
                setActiveTab={() => {}}
                user={user}
              />
            </>
          ) : <Navigate to="/" replace />
        }/>

        <Route path="/featured" element={
          <>
            <FeaturedPage />
            <NavigationPanel 
              activeTab="featured" 
              setActiveTab={() => {}}
              user={user}
            />
          </>
        }/>

        {/* Резервный маршрут */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>
)
