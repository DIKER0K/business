import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase/config';
import { getFirestore, collection, getDocs, query, where, limit } from "firebase/firestore";

interface Business {
  id: string;
  name: string;
  type?: string;
  photoURL?: string;
  rating?: number;
  city?: string;
  description?: string;
}

function BusinessPage() {
  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useState("Калининград");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);

  // Функция для загрузки бизнесов
  const fetchBusinesses = async () => {
    if (!location) return;
    
    setLoadingBusinesses(true);
    try {
      const db = getFirestore();
      const businessesRef = collection(db, "businesses");
      const q = query(
        businessesRef,
        where("city", "==", location),
        limit(6)
      );
      
      const querySnapshot = await getDocs(q);
      const businessesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Business[];
      
      setBusinesses(businessesData);
    } catch (error) {
      console.error("Ошибка загрузки бизнесов:", error);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    fetchBusinesses();
  }, [location]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '85vh',
      bgcolor: '#1d1d1d',
      overflow: 'hidden'
    }}>
      {/* Основной контент */}
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        p: '1vw',
        gap: '1vw',
        overflow: 'hidden'
      }}>
        {/* Центральная панель */}
        <Box sx={{ 
          flex: 1,
          bgcolor: 'white',
          borderRadius: '1vw',
          overflow: 'hidden',
          p: '1vw'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
          </Box>
        </Box>
            
          
        {/* Правая панель*/}
        <Box sx={{ 
          width: '20vw', 
          bgcolor: 'white', 
          borderRadius: '1vw',
          p: '1.5vw',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '0.5vw'
          }}>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default BusinessPage
