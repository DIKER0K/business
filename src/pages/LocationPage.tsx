import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase/config';
import { Typography} from '@mui/material';
import { getFirestore, collection, getDocs, query, where, limit, doc, getDoc } from "firebase/firestore";
import { CircularProgress, Avatar } from '@mui/material';
import { Placemark, YMaps, Map } from '@iminside/react-yandex-maps';

// Добавьте интерфейс Business в начало файла
interface Business {
  id: string;
  name: string;
  type?: string;
  photoURL?: string;
  rating?: number;
  city?: string;
  description?: string;
  coordinates?: Coordinates;
}

// В начале файла добавим интерфейс для координат
interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationPageProps {
  currentLocation: string;
  loadingLocation: boolean;
  getLocation: () => void;
}

function LocationPage({ currentLocation, loadingLocation, getLocation }: LocationPageProps) {
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [favoriteBusinesses, setFavoriteBusinesses] = useState<Business[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [selectedBusinessCoords, setSelectedBusinessCoords] = useState<Coordinates | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
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

  // Добавим функцию для загрузки избранного (аналогично FeaturedPage)
  const fetchFavorites = async (user: any) => {
    if (!user?.favorites?.length) {
      setFavoriteBusinesses([]);
      return;
    }
    
    setLoadingFavorites(true);
    try {
      const db = getFirestore();
      const favorites: Business[] = [];
      
      for (const businessId of user.favorites) {
        const docRef = doc(db, "businesses", businessId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          favorites.push({
            id: docSnap.id,
            ...docSnap.data()
          } as Business);
        }
      }
      
      setFavoriteBusinesses(favorites);
    } catch (error) {
      console.error("Ошибка загрузки избранного:", error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  // Обновим useEffect для пользователя
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUserData = async () => {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({...user, ...userData});
            fetchFavorites({...user, ...userData});
          }
        };
        fetchUserData();
      } else {
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
          background: '#white',
          backgroundSize: 'cover',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <YMaps>
            <Map 
              style={{width: '100%', height: '100%'}} 
              defaultState={{ center: [55.7558, 37.6176], zoom: 12 }}
              instanceRef={ref => ref && setMapInstance(ref)}
            >
              <Placemark geometry={[55.7558, 37.6176]} />
              {selectedBusinessCoords && (
                <Placemark 
                  geometry={[selectedBusinessCoords.lat, selectedBusinessCoords.lng]}
                  options={{ preset: 'islands#redIcon' }}
                />
              )}
            </Map>
          </YMaps>
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
              gap: '1vw',
              flexDirection: 'column'
            }}>
              <Typography variant="h6" sx={{color: 'black', fontSize: '1.5vw'}}>Избранное</Typography>

              {loadingFavorites ? (
              <CircularProgress size={24} />
            ) : favoriteBusinesses.length > 0 ? (
              favoriteBusinesses.map((business) => (
                <Box 
                  key={business.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 1,
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                  onClick={() => {
                    // Добавим установку координат для карты
                    if (business.coordinates) {
                      setSelectedBusinessCoords(business.coordinates);
                      if (mapInstance) {
                        mapInstance.setCenter([business.coordinates.lat, business.coordinates.lng]);
                      }
                    }
                  }}
                >
                  <Avatar 
                    src={business.photoURL} 
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography variant="body2">
                    {business.name}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Нет избранных мест
              </Typography>
            )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LocationPage;
