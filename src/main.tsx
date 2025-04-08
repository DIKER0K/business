import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import TableReservation from './pages/TableReservation.tsx'
import StartPage from './pages/StartPage.tsx'
import Logo from './pages/Logo.tsx'
import Profile from './pages/Profile.tsx'
import BusinessManProfile from './pages/BusinessManProfile.tsx'

// Инициализируем корневой элемент React
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Profile />
  </StrictMode>,
)
