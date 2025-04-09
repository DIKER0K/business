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
        {/* Центральная панель - заменена на компонент */}
        <Box sx={{ 
      flex: 1,
      bgcolor: 'white',
      borderRadius: '1vw',
      overflow: 'hidden',
      p: '1vw',
      background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(background_1.png) no-repeat center center',
      backgroundSize: 'cover',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '25.5vw',
    }}>
    </Box>
        
        {/* Правая панель*/}
        <Box sx={{ 
          width: '20vw', 
          bgcolor: 'white', 
          borderRadius: '1vw',
          p: '1.5vw',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '24.5vw',
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexDirection: 'column',
            gap: '0.5vw',
            p: '0'
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7vw',
              width: '100%'
            }}>
              <Avatar sx={{width: '4vw', height: '4vw'}} src={user?.photoURL} />
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'column',
                alignItems: 'flex-start',
                }}>
                <Typography sx={{fontSize: '1.5vw', }} variant="h6">{user?.displayName || 'Без имени'}</Typography>
                <Typography sx={{fontSize: '1vw'}} variant="h6">{user?.role || 'Пользователь'}</Typography>
              </Box>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1vw',
              p: '0'
            }}>
              <IconButton sx={{color: 'black', p: '0', fontSize: '1vw'}} onClick={getLocation} disabled={loadingLocation}>
                {loadingLocation ? <CircularProgress size={20} /> : <PlaceRoundedIcon />}
                <Typography variant="h6" sx={{color: 'black', fontSize: '1vw'}}>{currentLocation}</Typography>
              </IconButton>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
            }}>
              <IconButton sx={{color: 'black', p: '0', fontSize: '1vw'}}>
                <FavoriteBorderIcon />
              </IconButton>
              <Typography sx={{fontSize: '1vw'}} variant="h6">{(user?.favorites && user.favorites.length) || 0} мест в избранном</Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography sx={{fontSize: '1vw'}} variant="h6">{(user?.reviews && user.reviews.length) || 0} отзывов</Typography>
            </Box>
          </Box>
          <Divider color='#B7B7B7' sx={{mt: '2vw', mb: '1vw'}} />
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '0.2vw'
          }}>
            <Typography variant="h6">Недавно посещали:</Typography>
            {user?.recentlyVisited && user.recentlyVisited.length > 0 ? (
              user.recentlyVisited.map((place: any) => (
                <Typography variant="h6" key={place.id}>{place.name}</Typography>
              ))
            ) : (
              <Typography variant="h6" >Ничего не посещали</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SettingBusinessPage;
