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
import BusinessDetailsPage from './pages/BusinessDetailsPage'
import RestaurantNavigationPanel from './components/RestaurantNavigationPanel'

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
    console.log("Функция getLocation вызвана");
    setLoadingLocation(true);
    if (navigator.geolocation) {
      console.log("Геолокация поддерживается");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("Получены координаты:", position.coords);
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=ru`
            );
            const data = await response.json();
            console.log("Получены данные геолокации:", data);
            const city = data.address.city || 
                        data.address.town || 
                        data.address.village || 
                        "Калининград";
            console.log("Определен город:", city);
            setCurrentLocation(city);
          } catch (error) {
            console.error("Ошибка при определении местоположения:", error);
            setCurrentLocation("Калининград");
          } finally {
            setLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Ошибка геолокации:", error);
          setCurrentLocation("Калининград");
          setLoadingLocation(false);
        },
        { 
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.log("Геолокация не поддерживается");
      setCurrentLocation("Калининград");
      setLoadingLocation(false);
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
                currentLocation={currentLocation}
                loadingLocation={loadingLocation}
                getLocation={getLocation}
              />
            </>
          ) : <Navigate to="/" replace />
        }/>

        <Route path="/featured" element={
          <>
            <FeaturedPage 
              currentLocation={currentLocation}
              loadingLocation={loadingLocation}
              getLocation={getLocation}
            />
            <NavigationPanel 
              activeTab="featured" 
              setActiveTab={() => {}}
              user={user}
              currentLocation={currentLocation}
              loadingLocation={loadingLocation}
              getLocation={getLocation}
            />
          </>
        }/>

        <Route path="/business/:businessId" element={
          user ? <> <BusinessDetailsPage /> <RestaurantNavigationPanel/> </>: <Navigate to="/" replace />
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
