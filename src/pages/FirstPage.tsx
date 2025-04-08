import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase/config';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { Avatar, Typography, IconButton, Divider, Grid, CircularProgress } from '@mui/material';
import { getFirestore, collection, getDocs, query, where, limit } from "firebase/firestore";
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';

interface FirstPageProps {
  currentLocation: string;
  loadingLocation: boolean;
  getLocation: () => void;
}

function FirstPage({ currentLocation, loadingLocation, getLocation }: FirstPageProps) {
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);

  // Добавьте эту вспомогательную функцию в начало компонента
  const capitalizeEachWord = (str: string) => {
    if (!str) return '';
    return str.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
          p: '1vw',
          background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(background_1.png) no-repeat center center',
          backgroundSize: 'cover',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            p: '2vw'
          }}>
            <Typography variant="h6" sx={{color: 'white', fontSize: '2vw'}}>Возможно, вам понравится:</Typography>
          </Box>
          <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'space-around', mt: '-2vw'}}>
            {loadingBusinesses ? (
              <Grid item xs={12}>
                <CircularProgress />
              </Grid>
            ) : businesses.map((business) => (
              <Grid item xs={12} md={6} lg={3} key={business.id}>
                <Box sx={{
                  bgcolor: 'white',
                  borderRadius: '1vw',
                  overflow: 'hidden',
                  alignItems: 'center',
                  display: 'flex',
                  background: 'transparent',
                  p: '3vw',
                  gap: '1vw'
                }}>
                  <Avatar sx={{width: '7vw', height: '7vw'}} src={business?.photoURL} />
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5vw',
                    alignItems: 'left'
                  }}>
                    <Typography variant="h6" sx={{
                      fontSize: '2vw',
                      color: 'white'
                    }}>
                      {capitalizeEachWord(business.name)}
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontSize: '1.5vw',
                      color: 'white'
                    }}>
                      {capitalizeEachWord(business.type) || 'Не указано'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      index < Math.round(business.rating || 0) ? (
                        <StarRateRoundedIcon key={index} sx={{ color: '#ffc107', fontSize: '1.2rem' }} />
                      ) : (
                        <StarOutlineRoundedIcon key={index} sx={{ color: '#ddd', fontSize: '1.2rem' }} />
                      )
                    ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
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
              <Avatar src={user?.photoURL} />
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.1vw'
                }}>
                <Typography variant="h6">{user?.displayName || 'Без имени'}</Typography>
                <Typography variant="h6">{user?.role || 'Пользователь'}</Typography>
              </Box>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <IconButton onClick={getLocation} disabled={loadingLocation}>
                {loadingLocation ? <CircularProgress size={20} /> : <PlaceRoundedIcon />}
                <Typography variant="h6" sx={{color: 'black'}}>{currentLocation}</Typography>
              </IconButton>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography variant="h6">{(user?.favorites && user.favorites.length) || 0} мест в избранном</Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography variant="h6">{(user?.reviews && user.reviews.length) || 0} отзывов</Typography>
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

export default FirstPage
