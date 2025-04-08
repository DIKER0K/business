import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase/config';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { Avatar, Typography, IconButton, Divider, Grid, CircularProgress } from '@mui/material';
import { getFirestore, collection, getDocs, query, where, limit } from "firebase/firestore";

function FeaturedPage() {
  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useState("Калининград");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);

  // Функция для определения местоположения
  const getLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=ru`
            );
            const data = await response.json();
            const city = data.address.city || 
                        data.address.town || 
                        data.address.village || 
                        "Калининград";
            setLocation(city);
          } catch (error) {
            console.error("Ошибка определения:", error);
            setLocation("Калининград");
          } finally {
            setLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Ошибка геолокации:", error);
          setLocation("Калининград");
          setLoadingLocation(false);
        }
      );
    } else {
      setLocation("Калининград");
      setLoadingLocation(false);
    }
  };

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
            <Typography variant="h6">Возможно, вам понравится хуй в рот:</Typography>
          </Box>
          <Grid container spacing={2}>
            {loadingBusinesses ? (
              <Grid item xs={12}>
                <CircularProgress />
              </Grid>
            ) : businesses.map((business) => (
              <Grid item xs={12} md={6} lg={4} key={business.id}>
                <Box sx={{
                  bgcolor: 'white',
                  borderRadius: '1vw',
                  overflow: 'hidden',
                  p: '1vw'
                }}>
                  <Avatar src={business?.photoURL} />
                  <Typography variant="h6">{business.name}</Typography>
                  <Typography variant="body2">{business.description}</Typography>
                  <Typography variant="h6">{business.rating || 0} / 5</Typography>
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
              <IconButton onClick={getLocation}>
                    <PlaceRoundedIcon />
                    <Typography variant="h6" sx={{color: 'black'}}>{location}</Typography>
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
          <Divider color='#B7B7B7' sx={{mt: '2vw', mb: '2vw'}} />
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '1vw'
          }}>
            <Typography variant="h6">Недавно посещали:</Typography>
            {user?.recentlyVisited && user.recentlyVisited.length > 0 ? (
              user.recentlyVisited.map((place: any) => (
                <Typography variant="h6" key={place.id}>{place.name}</Typography>
              ))
            ) : (
              <Typography variant="h6">Ничего не посещали</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default FeaturedPage
