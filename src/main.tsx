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
import RestaurantNavigationPanel from './components/RestaurantNavigationPanel'
import SettingBusinessPage from './pages/SettingBusinessPage'
import RestaurantMenuPage from './pages/RestaurantMenuPage'
import BarberNavigationPanel from './components/BarberNavigationPanel'
import BarberMenuPage from './pages/BarberMenuPage'
import EmployerMenuPage from './pages/EmployerMenuPage'
import EmployerNavigationPanel from './components/EmployerNavigationPanel'
import { Box, CircularProgress } from '@mui/material'
import LocationPage from './pages/LocationPage'
import AnalyticPage from './pages/AnalyticPage'
import { User, updatePassword, updatePhoneNumber, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

function RootComponent() {
  const [user, setUser] = useState<User | null>(null)
  const [currentLocation, setCurrentLocation] = useState("Калининград")
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const auth = getAuth(app)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setIsLoading(false)
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

  if (isLoading) {
    return <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      bgcolor: '#1D1D1D'
    }}>
      <CircularProgress color="secondary" />
    </Box>
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        
        <Route path="/app" 
          element={
            user ? 
            <>
              <FirstPage 
                currentLocation={currentLocation} 
                loadingLocation={loadingLocation} 
                getLocation={getLocation}
              />
              <NavigationPanel 
                activeTab="app"
                setActiveTab={(tab) => navigate(`/${tab}`)}
                user={user!}
                currentLocation={currentLocation}
                loadingLocation={loadingLocation}
                getLocation={getLocation}
              />
            </> 
            : <Navigate to="/" replace />
          }
        />

        <Route path="/settings" element={
          <>
            <SettingBusinessPage 
              currentLocation={currentLocation}
              loadingLocation={loadingLocation}
              getLocation={getLocation}
            />
            <NavigationPanel 
              activeTab="settings" 
              setActiveTab={() => {}}
              user={user}
            />
          </>
        }/>

        <Route path="/location" element={
          user ? (
            <>
              <LocationPage
                currentLocation={currentLocation}
                loadingLocation={loadingLocation}
                getLocation={getLocation}
              />
              <NavigationPanel 
                activeTab="location" 
                setActiveTab={() => {}}
                user={user}
                currentLocation={currentLocation}
                loadingLocation={loadingLocation}
                getLocation={getLocation}
              />
            </>
          ) : <Navigate to="/" replace />
        }/>
        
        <Route path="/business" element={
            <>
              <BusinessPage/>
              <NavigationPanel 
                activeTab="business" 
                setActiveTab={(tab) => navigate(`/${tab}`)}
                user={user!}
                currentLocation={currentLocation}
                loadingLocation={loadingLocation}
                getLocation={getLocation}
              />
            </>
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

        <Route path="/business/:businessId/restaurant_menu" 
          element={
            user ? 
            <>
              <RestaurantMenuPage 
                currentLocation={currentLocation} 
                loadingLocation={loadingLocation} 
                getLocation={getLocation}
              />
              <RestaurantNavigationPanel
                activeTab="restaurant"
                setActiveTab={() => {}}
                currentLocation={currentLocation}
                loadingLocation={loadingLocation}
                getLocation={getLocation}
              />
            </> 
            : <Navigate to="/" replace />
          }
        />

        <Route path="/business/:businessId/barber_services" 
          element={
            user ? 
            <>
              <BarberMenuPage 
                currentLocation={currentLocation} 
                loadingLocation={loadingLocation} 
                getLocation={getLocation}
              />
              <BarberNavigationPanel
                activeTab="barber"
                setActiveTab={() => {}}
                currentLocation={currentLocation}
                loadingLocation={loadingLocation}
                getLocation={getLocation}
              />
            </> 
            : <Navigate to="/" replace />
          }
        />

          <Route path="/employer" 
            element={
             user ? 
               <>
                <EmployerMenuPage 
                  currentLocation={currentLocation} 
                  loadingLocation={loadingLocation} 
                  getLocation={getLocation}
                />
                  <EmployerNavigationPanel/>
                </> 
                : <Navigate to="/" replace />
              }
            />

        <Route path="/analytic" 
            element={
             user ? 
               <>
                <AnalyticPage 
                  currentLocation={currentLocation} 
                  loadingLocation={loadingLocation} 
                  getLocation={getLocation}
                />
                  <EmployerNavigationPanel/>
                </> 
                : <Navigate to="/" replace />
              }
            />

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
