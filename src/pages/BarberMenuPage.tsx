import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase/config';
import { Typography} from '@mui/material';
import { getFirestore, collection, getDocs, query, where, limit } from "firebase/firestore";
import RecommendedBusinesses from '../components/RecommendedBusinesses';

// Добавьте интерфейс Business в начало файла
interface Business {
  id: string;
  name: string;
  type?: string;
  photoURL?: string;
  rating?: number;
  city?: string;
  description?: string;
}

interface BarberMenuPageProps {
  currentLocation: string;
  loadingLocation: boolean;
  getLocation: () => void;
}

function BarberMenuPage({ currentLocation, loadingLocation, getLocation }: BarberMenuPageProps) {
  const { businessId } = useParams<{ businessId: string }>();
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);

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
  }, [currentLocation]);

  useEffect(() => {
    if (businessId) {
      // Добавьте здесь загрузку данных конкретного бизнеса
      console.log('Loaded business ID:', businessId);
    }
  }, [businessId]);

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
        {/* Центральная панель - заменена на компонент */}
        <RecommendedBusinesses 
          businesses={businesses}
          loadingBusinesses={loadingBusinesses}
          currentLocation={currentLocation}
        />
        
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
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography variant="h6" sx={{color: 'black', fontSize: '1.5vw'}}>Избранное</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default BarberMenuPage;
