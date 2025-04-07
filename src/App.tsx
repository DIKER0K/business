import { useState, useEffect } from 'react'
import './App.css'
import { app, analytics } from './firebase/config'

function App() {
  useEffect(() => {
    // Здесь можно добавить логику инициализации Firebase
    console.log('Firebase инициализирован:', app);
  }, []);

  return (
    <>
      {/* Содержимое вашего приложения */}
    </>
  )
}

export default App
