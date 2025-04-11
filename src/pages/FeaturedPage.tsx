import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase/config';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { Avatar, Typography, IconButton, Divider, Grid, CircularProgress } from '@mui/material';
import { getFirestore, collection, getDocs, query, where, limit, doc, getDoc, updateDoc } from "firebase/firestore";
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import RecommendedBusinesses from '../components/RecommendedBusinesses';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';

interface Business {
  id: string;
  name: string;
  type?: string;
  photoURL?: string;
  rating?: number;
  city?: string;
  description?: string;
}

interface FeaturedPageProps {
  currentLocation: string;
  loadingLocation: boolean;
  getLocation: () => void;
}

function FeaturedPage({ currentLocation, loadingLocation, getLocation }: FeaturedPageProps) {
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [favoriteBusinesses, setFavoriteBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const navigate = useNavigate();
  const { businessId } = useParams();
  const auth = getAuth(app);

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

  const toggleFavorite = async (businessId: string) => {
    if (!user) return;

    try {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const currentFavorites = user.favorites || [];
      
      const isFavorite = currentFavorites.includes(businessId);
      const newFavorites = isFavorite 
        ? currentFavorites.filter(id => id !== businessId)
        : [...currentFavorites, businessId];

      await updateDoc(userRef, {
        favorites: newFavorites
      });

      setUser(prev => ({...prev, favorites: newFavorites}));
      fetchFavorites({...user, favorites: newFavorites});

    } catch (error) {
      console.error("Ошибка обновления избранного:", error);
    }
  };

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
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        p: '1vw',
        gap: '1vw',
        overflow: 'hidden'
      }}>
        <RecommendedBusinesses 
          businesses={businesses}
          loadingBusinesses={loadingBusinesses}
          currentLocation={currentLocation}
        />
        
        <Box sx={{ 
          width: '20vw',
          bgcolor: 'white', 
          borderRadius: '1vw',
          p: '1vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          <Typography variant="h6" sx={{color: 'black', fontSize: '1.5vw', mb: 2}}>
              Избранное
            </Typography>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'left',
            flexDirection: 'column',
            gap: '0.5vw'
          }}>
            {loadingFavorites ? (
              <CircularProgress size={24} />
            ) : favoriteBusinesses.length > 0 ? (
              favoriteBusinesses.map((business) => (
                <Box 
                  key={business.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                  onClick={() => {
                    if (business.type === 'Кафе')  {
                      navigate(`/business/${business.id}/restaurant_menu`);
                    } else if (business.type === 'Парикмахерская') {
                      navigate(`/business/${business.id}/barber_services`);
                    }
                  }}
                >
                  <Avatar 
                    src={business.photoURL} 
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                    <Typography variant="body2">
                      {business.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2, mt: 1 }}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        index < Math.round(business.rating || 0) ? (
                          <StarRateRoundedIcon key={index} sx={{ color: '#ffc107', fontSize: '1.2rem' }} />
                        ) : (
                          <StarOutlineRoundedIcon key={index} sx={{ color: '#black', fontSize: '1.2rem' }} />
                        )
                      ))}
                    </Box>
                  </Box>
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(business.id);
                    }}
                    sx={{ ml: 'auto' }}
                  >
                    {user?.favorites?.includes(business.id) ? (
                      <FavoriteRoundedIcon sx={{ color: '#black', fontSize: '1.2rem' }} />
                    ) : (
                      <FavoriteBorderRoundedIcon sx={{ color: '#gray', fontSize: '1.2rem' }} />
                    )}
                  </IconButton>
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
  );
}

export default FeaturedPage;
