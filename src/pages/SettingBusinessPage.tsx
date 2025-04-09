import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase/config';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Avatar, Typography, IconButton, Divider, CircularProgress } from '@mui/material';
import { getFirestore, collection, getDocs, query, where, limit, getDoc, doc } from "firebase/firestore";
import RecommendedBusinesses from '../components/RecommendedBusinesses';
import { motion } from 'framer-motion';

interface Business {
  id: string;
  name: string;
  type?: string;
  photoURL?: string;
  rating?: number;
  city?: string;
  description?: string;
}

interface SettingBusinessPageProps {
  currentLocation: string;
  loadingLocation: boolean;
  getLocation: () => void;
}

function SettingBusinessPage({ currentLocation, loadingLocation, getLocation }: SettingBusinessPageProps) {
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const location = useLocation();

  // Функция для загрузки бизнесов
  const fetchBusinesses = async () => {
    if (!currentLocation) return;
    
    setLoadingBusinesses(true);
    try {
      const db = getFirestore();
      const businessesRef = collection(db, "businesses");
      const q = query(
        businessesRef,
        where("city", "==", currentLocation),
        limit(4)
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Получаем данные пользователя из Firestore
        try {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({...currentUser, ...userData});
          } else {
            setUser(currentUser);
          }
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
          setUser(currentUser);
        }
      } else {
        setUser(null);
        navigate('/');
      }
    });
    
    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    fetchBusinesses();
  }, [currentLocation]);

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
        <motion.div
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: '1vw',
            overflow: 'hidden',
            padding: '1vw',
          }}
          animate={{ 
            height: location.pathname === '/settings' ? '25.5vw' : '39.5vw'
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          layout
        >
        </motion.div>
        
        {/* Правая панель */}
        <motion.div
          style={{
            width: '20vw',
            backgroundColor: 'white',
            borderRadius: '1vw',
            padding: '1.5vw',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
          animate={{ 
            height: location.pathname === '/settings' ? '24.5vw' : '38.5vw'
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          layout
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1vw'
          }}>
        </Box>
      </motion.div>
    </Box>
  </Box>
  )
}

export default SettingBusinessPage;
