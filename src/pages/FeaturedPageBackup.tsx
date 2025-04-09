import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase/config';
import { Avatar, Grid, IconButton, Typography } from '@mui/material';
import { getFirestore, collection, getDocs, query, where, limit, doc, getDoc } from "firebase/firestore";
import RecommendedBusinesses from '../components/RecommendedBusinesses';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';

// Добавьте интерфейс Business в начало файла
interface Business {
  id: string;
  name: string;
  type?: string;
  photoURL?: string;
  rating?: number;
  city?: string;
  description?: string;
  phone?: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  hours?: string;
}

interface FeaturedPageProps {
  currentLocation: string;
  loadingLocation: boolean;
  getLocation: () => void;
}

function FeaturedPage({ currentLocation, loadingLocation, getLocation }: FeaturedPageProps) {
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [favoriteBusinesses, setFavoriteBusinesses] = useState<Business[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore();

  // Функция для загрузки бизнесов
  const fetchBusinesses = async () => {
    if (!currentLocation) return;
    
    setLoadingBusinesses(true);
    try {
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

  // Функция для загрузки избранных бизнесов
  const fetchFavoriteBusinesses = async (userData: any) => {
    if (!userData || !userData.favorites || userData.favorites.length === 0) {
      setFavoriteBusinesses([]);
      return;
    }
    
    setLoadingFavorites(true);
    try {
      const favorites: Business[] = [];
      
      for (const businessId of userData.favorites) {
        const businessDoc = await getDoc(doc(db, "businesses", businessId));
        if (businessDoc.exists()) {
          favorites.push({
            id: businessDoc.id,
            name: businessDoc.data().name || 'Без названия',
            ...businessDoc.data()
          } as Business);
        }
      }
      
      setFavoriteBusinesses(favorites);
    } catch (error) {
      console.error("Ошибка загрузки избранных бизнесов:", error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  // Функция для открытия деталей бизнеса
  const handleOpenBusinessDetails = (business: Business) => {
    setSelectedBusiness(business);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Получаем данные пользователя из Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({...currentUser, ...userData});
            
            // Загружаем избранные бизнесы
            fetchFavoriteBusinesses(userData);
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
  }, [auth, navigate, db]);

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
        {/* Центральная панель - показываем детали выбранного бизнеса или рекомендации */}
        {selectedBusiness ? (
          <Box sx={{ 
            flex: 1,
            bgcolor: 'white',
            borderRadius: '1vw',
            p: '1.5vw',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            position: 'relative',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${selectedBusiness.photoURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white'
          }}>
            <Grid container sx={{display: 'flex', flexDirection: 'row', gap: '8vw', p: '2vw'}}>
              <Grid item xs={12} md={6} sx={{maxWidth: '30vw'}}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1vw', mb: '1vw' }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                  {selectedBusiness.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {selectedBusiness.city}
                  </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ mt: '1vw', color: 'white' }}>
                  {selectedBusiness.description}
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '1vw', mb: '1vw', mt: '1vw'}}>
                  <AccessTimeFilledRoundedIcon />
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    {selectedBusiness.hours || 'График работы не указан'}
                  </Typography>
                </Box>
            
                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#90caf9', 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => setSelectedBusiness(null)}
                      >
                      Вернуться к рекомендациям
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{display: 'flex', flexDirection: 'column', mb: '1vw'}}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '1vw', mb: '1vw' }}>
                    <IconButton>
                      <FavoriteRoundedIcon sx={{ color: 'white', fontSize: '2vw' }} />
                    </IconButton>
                  </Box>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: '1vw', mb: '1vw'}}>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {selectedBusiness.phone || 'Номер телефона не указан'}
                      </Typography>
                  </Box>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: '1vw', mb: '1vw'}}>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {selectedBusiness.monday || 'График работы в понедельник не указан'}
                      </Typography>
                  </Box>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: '1vw', mb: '1vw'}}>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {selectedBusiness.tuesday || 'График работы во вторник не указан'}
                      </Typography>
                  </Box>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: '1vw', mb: '1vw'}}>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {selectedBusiness.wednesday || 'График работы в среду не указан'}
                      </Typography>
                  </Box>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: '1vw', mb: '1vw'}}>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {selectedBusiness.thursday || 'График работы в четверг не указан'}
                      </Typography>
                  </Box>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: '1vw', mb: '1vw'}}>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {selectedBusiness.friday || 'График работы в пятницу не указан'}
                      </Typography>
                  </Box>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: '1vw', mb: '1vw'}}>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {selectedBusiness.saturday || 'График работы в субботу не указан'}
                      </Typography>
                  </Box>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: '1vw', mb: '1vw'}}>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {selectedBusiness.sunday || 'График работы в воскресенье не указан'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <RecommendedBusinesses 
            businesses={businesses}
            loadingBusinesses={loadingBusinesses}
            currentLocation={currentLocation}
          />
        )}
        
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
            
            {/* Добавляем список избранных бизнесов */}
            <Box sx={{ 
              width: '100%', 
              mt: '1vw', 
              display: 'flex',
              flexDirection: 'column',
              gap: '1vw',
              maxHeight: '60vh',
              overflow: 'auto'
            }}>
              {loadingFavorites ? (
                <Typography sx={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.5)', fontSize: '1vw', mt: '2vw' }}>
                  Загрузка избранного...
                </Typography>
              ) : favoriteBusinesses.length > 0 ? (
                favoriteBusinesses.map((business) => (
                  <Box 
                    key={business.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8vw',
                      p: '0.8vw',
                      borderRadius: '0.5vw',
                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.1)'
                      }
                    }}
                    onClick={() => handleOpenBusinessDetails(business)}
                  >
                    <Avatar 
                      src={business.photoURL || undefined} 
                      sx={{ width: '3vw', height: '3vw' }}
                    />
                    <Box>
                      <Typography sx={{ fontSize: '1vw', fontWeight: 'bold' }}>
                        {business.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.8vw', color: 'rgba(0, 0, 0, 0.6)' }}>
                        {business.city}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography sx={{ 
                  textAlign: 'center', 
                  color: 'rgba(0, 0, 0, 0.5)',
                  fontSize: '1vw',
                  mt: '2vw'
                }}>
                  У вас пока нет избранных бизнесов
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default FeaturedPage;
