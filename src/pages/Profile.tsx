import * as React from 'react';
import { useState, useEffect } from 'react';
import './styles/Profile.css'
import Box from '@mui/material/Box';
import { Typography, Avatar, CircularProgress, Divider, Grid, Paper, IconButton } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, getDocs, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { app } from '../firebase/config';
import { motion } from 'framer-motion';

// Интерфейс для бизнеса/локации
interface Business {
  id: string;
  name: string;
  description: string;
  hours: string;
  city: string;
  photoURL: string | null;
  ownerId: string;
  ownerEmail: string;
}

function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userLocation, setUserLocation] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3; // Показываем только 3 локации на странице
  
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Проверка авторизации пользователя
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserEmail(currentUser.email || "");
        
        // Получаем дополнительные данные пользователя из Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserLocation(userData.location || "");
            setFavorites(userData.favorites || []);
          }
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
        }
      } else {
        setUser(null);
        setUserEmail("");
        setUserLocation("");
        setFavorites([]);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [auth, db]);

  // Загрузка бизнесов/локаций при монтировании компонента
  useEffect(() => {
    if (user) {
      fetchBusinesses();
    }
  }, [user]);

  // Сбрасываем текущую страницу при смене вкладки
  useEffect(() => {
    setCurrentPage(0);
  }, [activeTab]);

  // Загрузка бизнесов/локаций
  const fetchBusinesses = async () => {
    if (!user) return;
    
    setLoadingBusinesses(true);
    try {
      const businessesQuery = query(
        collection(db, "businesses")
      );
      
      const querySnapshot = await getDocs(businessesQuery);
      const businessesList: Business[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        businessesList.push({
          id: doc.id,
          name: data.name || "Без названия",
          description: data.description || "",
          hours: data.hours || "Круглосуточно",
          city: data.city || "Город не указан",
          photoURL: data.photoURL || null,
          ownerId: data.ownerId || "",
          ownerEmail: data.ownerEmail || ""
        });
      });
      
      setBusinesses(businessesList);
    } catch (error) {
      console.error("Ошибка при загрузке локаций:", error);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  // Добавление/удаление из избранного
  const toggleFavorite = async (businessId: string) => {
    if (!user) return;
    
    try {
      const userRef = doc(db, "users", user.uid);
      
      if (favorites.includes(businessId)) {
        // Удаляем из избранного
        await updateDoc(userRef, {
          favorites: arrayRemove(businessId)
        });
        setFavorites(favorites.filter(id => id !== businessId));
      } else {
        // Добавляем в избранное
        await updateDoc(userRef, {
          favorites: arrayUnion(businessId)
        });
        setFavorites([...favorites, businessId]);
      }
    } catch (error) {
      console.error("Ошибка при обновлении избранного:", error);
    }
  };

  // Отображение основного контента в зависимости от активной вкладки
  const renderMainContent = () => {
    if (activeTab === "locations") {
      // Вычисляем общее количество страниц
      const totalPages = Math.ceil(businesses.length / itemsPerPage);
      
      // Получаем текущую страницу бизнесов
      const currentBusinesses = businesses.slice(
        currentPage * itemsPerPage, 
        (currentPage + 1) * itemsPerPage
      );
      
      return (
        <Box sx={{ p: '1.5vw' }}>
          <Typography variant="h5" sx={{ mb: 3, fontSize: '1.6vw', fontWeight: 'bold' }}>
            Локации
          </Typography>
          
          {loadingBusinesses ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : businesses.length > 0 ? (
            <Box sx={{ position: 'relative' }}>
              <Grid container spacing={2}>
                {currentBusinesses.map((business) => (
                  <Grid item xs={4} key={business.id}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        height: '26vw', // Увеличенный размер карточки
                        width: '20vw',
                        borderRadius: '1vw',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      {/* Фото локации - фиксированной высоты */}
                      <Box 
                        sx={{ 
                          height: '12vw', // Увеличенная высота фото
                          width: '100%', 
                          bgcolor: '#f0f0f0',
                          position: 'relative'
                        }}
                      >
                        {business.photoURL ? (
                          <img 
                            src={business.photoURL} 
                            alt={business.name}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <Box 
                            sx={{ 
                              width: '100%', 
                              height: '100%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              bgcolor: '#f0f0f0'
                            }}
                          >
                            <LocationOnIcon sx={{ fontSize: '3vw', color: '#ccc' }} />
                          </Box>
                        )}
                        
                        {/* Кнопка избранного */}
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(business.id);
                          }}
                          sx={{
                            position: 'absolute',
                            top: '0.5vw',
                            right: '0.5vw',
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.9)'
                            },
                            width: '2.2vw',
                            height: '2.2vw'
                          }}
                        >
                          {favorites.includes(business.id) ? (
                            <FavoriteIcon sx={{ fontSize: '1.2vw', color: '#ff4081' }} />
                          ) : (
                            <FavoriteBorderIcon sx={{ fontSize: '1.2vw' }} />
                          )}
                        </IconButton>
                      </Box>
                      
                      {/* Информация о локации */}
                      <Box sx={{ p: '1.2vw' }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '1.3vw',
                            mb: '0.6vw',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {business.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: '0.6vw' }}>
                          <LocationOnIcon sx={{ fontSize: '1.1vw', mr: '0.4vw', color: '#666' }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: '1vw', 
                              color: '#666',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {business.city}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon sx={{ fontSize: '1.1vw', mr: '0.4vw', color: '#666' }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: '1vw', 
                              color: '#666',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {business.hours}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
              Локации не найдены
            </Typography>
          )}
        </Box>
      );
    } else if (activeTab === "favorites") {
      // Вычисляем общее количество страниц для избранного
      const favoritedBusinesses = businesses.filter(business => favorites.includes(business.id));
      const totalPages = Math.ceil(favoritedBusinesses.length / itemsPerPage);
      
      // Получаем текущую страницу избранных бизнесов
      const currentFavorites = favoritedBusinesses.slice(
        currentPage * itemsPerPage, 
        (currentPage + 1) * itemsPerPage
      );
      
      return (
        <Box sx={{ p: '1.5vw' }}>
          <Typography variant="h5" sx={{ mb: 3, fontSize: '1.6vw', fontWeight: 'bold' }}>
            Избранное
          </Typography>
          
          {loadingBusinesses || loadingFavorites ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : currentFavorites.length > 0 ? (
            <Box sx={{ position: 'relative' }}>
              <Grid container spacing={2}>
                {currentFavorites.map((business) => (
                  <Grid item xs={4} key={business.id}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        height: '22vw', // Увеличенный размер карточки
                        width: '20vw',
                        borderRadius: '1vw',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      {/* Фото локации - фиксированной высоты */}
                      <Box 
                        sx={{ 
                          height: '12vw', // Увеличенная высота фото
                          width: '100%', 
                          bgcolor: '#f0f0f0',
                          position: 'relative'
                        }}
                      >
                        {business.photoURL ? (
                          <Box 
                            component="img"
                            src={business.photoURL}
                            alt={business.name}
                            sx={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <Box 
                            sx={{ 
                              width: '100%', 
                              height: '100%', 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: '#e0e0e0'
                            }}
                          >
                            <LocationOnIcon sx={{ fontSize: '4vw', color: '#999' }} />
                          </Box>
                        )}
                        
                        {/* Кнопка избранного (поверх фото) */}
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: '0.7vw', 
                            right: '0.7vw',
                            bgcolor: 'rgba(255,255,255,0.8)',
                            borderRadius: '50%',
                            width: '2.5vw',
                            height: '2.5vw',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'scale(1.1)'
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(business.id);
                          }}
                        >
                          <FavoriteIcon sx={{ color: '#ff6b6b', fontSize: '1.6vw' }} />
                        </Box>
                      </Box>
                      
                      {/* Информация о локации */}
                      <Box sx={{ p: '1.2vw' }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '1.3vw',
                            mb: '0.6vw',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {business.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: '0.6vw' }}>
                          <LocationOnIcon sx={{ fontSize: '1.1vw', mr: '0.4vw', color: '#666' }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: '1vw', 
                              color: '#666',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {business.city}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon sx={{ fontSize: '1.1vw', mr: '0.4vw', color: '#666' }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: '1vw', 
                              color: '#666',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {business.hours}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
              У вас пока нет избранных локаций
            </Typography>
          )}
        </Box>
      );
    } else if (activeTab === "settings") {
      // ... существующий код для настроек ...
    } else {
      // ... существующий код для профиля ...
    }
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 4vw)',
      margin: '2vw'
    }}>
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        mb: '2vw'
      }}>
        {/* Основное содержимое */}
        <Box sx={{ 
          flex: 1, 
          bgcolor: 'white', 
          borderRadius: '2vw',
          mr: '2vw',
          overflow: 'hidden',
          boxShadow: '0vw 0.2vw 0.5vw rgba(0, 0, 0, 0.1)'
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            renderMainContent()
          )}
        </Box>
        
        {/* Правая панель с информацией о пользователе */}
        <Box sx={{ 
          width: '17vw', 
          bgcolor: 'white', 
          borderRadius: '2vw',
          p: '1.5vw',
          boxShadow: '0vw 0.2vw 0.5vw rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Аватар и имя пользователя */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: '4vw', 
                    height: '4vw', 
                    bgcolor: '#646cff',
                    fontSize: '1.8vw',
                    mb: 1
                  }}
                >
                  {userEmail.charAt(0).toUpperCase()}
                </Avatar>
                <Typography sx={{ fontSize: '1.2vw', fontWeight: 'bold' }}>
                  {userEmail}
                </Typography>
              </Box>
              
              {/* Локация */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ fontSize: '1.2vw', mr: 1, color: '#666' }} />
                <Typography sx={{ fontSize: '1vw' }}>
                  {userLocation || "Не найдено"}
                </Typography>
              </Box>
              
              {/* Избранное */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FavoriteIcon sx={{ fontSize: '1.2vw', mr: 1, color: '#666' }} />
                <Typography sx={{ fontSize: '1vw' }}>
                  {favorites.length} мест в избранном
                </Typography>
              </Box>
              
              {/* Отзывы */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontSize: '1vw' }}>
                  0 отзывов
                </Typography>
              </Box>
              
              {/* Разделитель */}
              <Divider sx={{ my: 2 }} />
              
              {/* Недавно посещали */}
              <Typography sx={{ fontSize: '1.2vw', fontWeight: 'bold', mb: 1 }}>
                Недавно посещали:
              </Typography>
              
              {/* Здесь можно добавить список недавно посещенных мест */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
                {/* Пока пусто */}
              </Box>
              
              {/* Пагинация со стрелками - перемещена в правую панель */}
              {activeTab === "locations" && businesses.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mt: 'auto',
                  pt: 2,
                  gap: 2
                }}>
                  <IconButton 
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    sx={{ 
                      bgcolor: currentPage === 0 ? 'rgba(0,0,0,0.05)' : 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: '1vw' }} />
                  </IconButton>
                  
                  <Typography sx={{ fontSize: '1vw' }}>
                    {currentPage + 1} из {Math.ceil(businesses.length / itemsPerPage)}
                  </Typography>
                  
                  <IconButton 
                    disabled={currentPage === Math.ceil(businesses.length / itemsPerPage) - 1}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    sx={{ 
                      bgcolor: currentPage === Math.ceil(businesses.length / itemsPerPage) - 1 ? 'rgba(0,0,0,0.05)' : 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <ArrowForwardIosIcon sx={{ fontSize: '1vw' }} />
                  </IconButton>
                </Box>
              )}
              
              {/* Пагинация для избранного - также перемещена в правую панель */}
              {activeTab === "favorites" && favorites.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mt: 'auto',
                  pt: 2,
                  gap: 2
                }}>
                  <IconButton 
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    sx={{ 
                      bgcolor: currentPage === 0 ? 'rgba(0,0,0,0.05)' : 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: '1vw' }} />
                  </IconButton>
                  
                  <Typography sx={{ fontSize: '1vw' }}>
                    {currentPage + 1} из {Math.ceil(favorites.length / itemsPerPage)}
                  </Typography>
                  
                  <IconButton 
                    disabled={currentPage === Math.ceil(favorites.length / itemsPerPage) - 1}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    sx={{ 
                      bgcolor: currentPage === Math.ceil(favorites.length / itemsPerPage) - 1 ? 'rgba(0,0,0,0.05)' : 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <ArrowForwardIosIcon sx={{ fontSize: '1vw' }} />
                  </IconButton>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
      
      {/* Нижняя панель навигации с анимацией */}
      <motion.div
        style={{
          backgroundColor: 'white',
          borderRadius: '2vw',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0vw 0.2vw 0.5vw rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
        animate={{ 
          height: activeTab === "business" ? '22vw' : '6vw'
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Панель с кнопками навигации (всегда видима) */}
        <Box sx={{
          display: 'flex',
          padding: '1vw 2vw',
          height: '4vw',
          alignItems: 'center',
          width: '100%',
          zIndex: 1,
          gap: '3vw'
        }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              color: activeTab === "business" ? '#646cff' : 'inherit',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab(activeTab === "business" ? "profile" : "business")}
          >
            <BusinessCenterIcon sx={{ fontSize: '1.8vw', mb: '0.3vw' }} />
            <Typography variant="body2" sx={{fontSize: '1vw'}}>Бизнес</Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              color: activeTab === "favorites" ? '#646cff' : 'inherit',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab(activeTab === "favorites" ? "profile" : "favorites")}
          >
            <FavoriteIcon sx={{ fontSize: '1.8vw', mb: '0.3vw' }} />
            <Typography variant="body2" sx={{fontSize: '1vw'}}>Избранное</Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              color: activeTab === "settings" ? '#646cff' : 'inherit',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab(activeTab === "settings" ? "profile" : "settings")}
          >
            <SettingsIcon sx={{ fontSize: '1.8vw', mb: '0.3vw' }} />
            <Typography variant="body2" sx={{fontSize: '1vw'}}>Настройки</Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              color: activeTab === "locations" ? '#646cff' : 'inherit',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab(activeTab === "locations" ? "profile" : "locations")}
          >
            <LocationOnIcon sx={{ fontSize: '1.8vw', mb: '0.3vw' }} />
            <Typography variant="body2" sx={{fontSize: '1vw'}}>Локации</Typography>
          </Box>
        </Box>
        
        {/* Содержимое бизнес-панели */}
        {activeTab === "business" && (
          <Box 
            sx={{ 
              padding: '1vw 2vw',
              height: 'calc(100% - 4vw)',
              overflow: 'auto'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1.4vw' }}>
              Управление бизнесом
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1vw' }}>
              Здесь вы можете управлять своими бизнес-аккаунтами и создавать новые.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {/* Здесь можно добавить карточки бизнесов */}
              <Box sx={{ 
                width: '18vw', 
                height: '8vw', 
                bgcolor: '#f5f5f5', 
                borderRadius: '1vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <Typography variant="body1" sx={{ fontSize: '1.2vw' }}>
                  + Добавить бизнес
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </motion.div>
    </Box>
  )
}

export default Profile
