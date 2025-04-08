import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import TableReservation from './pages/TableReservation.tsx'
import StartPage from './pages/StartPage.tsx'
import Logo from './pages/Logo.tsx'
import Profile from './pages/Profile.tsx'
import BusinessManProfile from './pages/BusinessManProfile.tsx'
import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { app } from './firebase/config'

// Создаем компонент для маршрутизации
function Main() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Устанавливаем класс для body в зависимости от страницы
      if (currentUser) {
        // Для Profile и других страниц, где не нужна прокрутка
        document.body.className = 'non-scrollable-page';
      } else {
        // Для StartPage, где нужна прокрутка
        document.body.className = 'scrollable-page';
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Загрузка...
    </div>;
  }
  
  // Если пользователь авторизован, показываем Profile, иначе StartPage
  return user ? <Profile /> : <StartPage />;
}

// Инициализируем корневой элемент React
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
