import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase/config';
import { Typography} from '@mui/material';
import { getFirestore, collection, getDocs, query, where, limit, doc, getDoc } from "firebase/firestore";
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

interface RestaurantMenuPageProps {
  currentLocation: string;
  loadingLocation: boolean;
  getLocation: () => void;
}

function RestaurantMenuPage({ currentLocation, loadingLocation, getLocation }: RestaurantMenuPageProps) {
  const { businessId } = useParams<{ businessId: string }>();
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);

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
      const fetchBusinessData = async () => {
        try {
          const db = getFirestore();
          const docRef = doc(db, "businesses", businessId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const businessData = { id: docSnap.id, ...docSnap.data() } as Business;
            setCurrentBusiness(businessData);
          }
        } catch (error) {
          console.error("Ошибка загрузки бизнеса:", error);
        }
      };
      fetchBusinessData();
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
        <Box sx={{ 
          flex: 1,
          bgcolor: 'white',
          borderRadius: '1vw',
          overflow: 'hidden',
          p: '1vw',
          background: currentBusiness?.photoURL 
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${currentBusiness.photoURL})`
            : 'white',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative'
        }}>
          {currentBusiness && (
            <>
              <Typography variant="h3" sx={{ zIndex: 1 }}>
                {currentBusiness.name}
              </Typography>
              <Typography variant="h5" sx={{ zIndex: 1 }}>
                {currentBusiness.description}
              </Typography>
            </>
          )}
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
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography variant="h6" sx={{color: 'black', fontSize: '3vw'}}>Забронируйте</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default RestaurantMenuPage;
