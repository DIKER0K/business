import * as React from 'react';
import { useState, useEffect } from 'react';
import './styles/Profile.css'
import Box from '@mui/material/Box';
import { Typography, Avatar, CircularProgress, Divider, Grid, Paper, IconButton, Button } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';
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
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const itemsPerPage = 4; // Показываем 4 локации в списке
  
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
    setSelectedBusiness(null);
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
        setFavorites(prev => prev.filter(id => id !== businessId));
      } else {
        // Добавляем в избранное
        await updateDoc(userRef, {
          favorites: arrayUnion(businessId)
        });
        setFavorites(prev => [...prev, businessId]);
      }
    } catch (error) {
      console.error("Ошибка при обновлении избранного:", error);
    }
  };

  // Функция для выбора локации
  const handleSelectBusiness = (business: Business) => {
    setSelectedBusiness(business);
  };

  // Отображение основного контента в зависимости от активной вкладки
  const renderMainContent = () => {
    if (activeTab === "locations" && selectedBusiness) {
      // Если выбрана локация, показываем детальную информацию
      return (
        <Box sx={{ 
          p: '1.5vw',
          height: '100%',
          position: 'relative',
          borderRadius: '1vw',
          overflow: 'hidden'
        }}>
          {/* Фоновое изображение */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 1
            }
          }}>
            {selectedBusiness.photoURL ? (
              <img 
                src={selectedBusiness.photoURL} 
                alt={selectedBusiness.name}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover'
                }}
              />
            ) : (
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                bgcolor: '#333'
              }} />
            )}
          </Box>
          
          {/* Контент поверх изображения */}
          <Box sx={{ 
            position: 'relative', 
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ fontSize: '2.2vw', fontWeight: 'bold' }}>
                {selectedBusiness.name}
              </Typography>
              
              <IconButton 
                onClick={() => setSelectedBusiness(null)}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1, fontSize: '1.2vw' }} />
              <Typography sx={{ fontSize: '1.2vw' }}>
                {selectedBusiness.city}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccessTimeIcon sx={{ mr: 1, fontSize: '1.2vw' }} />
              <Typography sx={{ fontSize: '1.2vw' }}>
                {selectedBusiness.hours}
              </Typography>
            </Box>
            
            <Typography variant="h6" sx={{ mb: 1, fontSize: '1.4vw' }}>
              Описание
            </Typography>
            
            <Typography sx={{ fontSize: '1.1vw', mb: 3, maxWidth: '80%' }}>
              {selectedBusiness.description || "Описание отсутствует"}
            </Typography>
            
            </Box>
        </Box>
      );
    } else if (activeTab === "locations") {
      // Если локация не выбрана, показываем пустой экран с инструкцией
      return (
        <Box sx={{ 
          p: '1.5vw',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#666'
        }}>
          <LocationOnIcon sx={{ fontSize: '4vw', mb: 2, color: '#ccc' }} />
          <Typography variant="h5" sx={{ mb: 1, fontSize: '1.6vw' }}>
            Выберите локацию
          </Typography>
          <Typography sx={{ fontSize: '1.1vw', textAlign: 'center', maxWidth: '60%' }}>
            Выберите локацию из списка справа, чтобы увидеть подробную информацию
          </Typography>
        </Box>
      );
    } else if (activeTab === "favorites") {
      // Код для вкладки "Избранное"
      // ... существующий код ...
    } else if (activeTab === "settings") {
      // Код для вкладки "Настройки"
      // ... существующий код ...
    } else {
      // Код для вкладки "Профиль" (по умолчанию)
      // ... существующий код ...
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '48vw', 
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
          width: '20vw', 
          bgcolor: 'white', 
          borderRadius: '1vw',
          p: '1.5vw',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Информация о пользователе */}
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
              
              {/* Список мест вместо "Недавно посещали" */}
              {activeTab === "locations" && (
                <>
                  <Typography sx={{ fontSize: '1.2vw', fontWeight: 'bold', mb: 1 }}>
                    Места
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.5vw', 
                    flexGrow: 1,
                    overflow: 'auto',
                    maxHeight: 'calc(100% - 3vw)', // Оставляем место только для заголовка
                    width: '100%',
                    '&::-webkit-scrollbar': {
                      width: '0.4vw',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1',
                      borderRadius: '0.2vw',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#888',
                      borderRadius: '0.2vw',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: '#555',
                    },
                  }}>
                    {loadingBusinesses ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : businesses.length > 0 ? (
                      businesses.map((business) => (
                        <Box 
                          key={business.id}
                          onClick={() => setSelectedBusiness(business)}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            height: '3.8vw', // Фиксированная высота для всех кнопок
                            borderRadius: '0.8vw',
                            backgroundImage: business.photoURL ? `url(${business.photoURL})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            bgcolor: business.photoURL ? 'transparent' : '#eee',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s ease',
                            flexShrink: 0, // Предотвращает сжатие элементов
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.3)',
                              transition: 'background-color 0.3s ease'
                            },
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                              '&::before': {
                                backgroundColor: 'rgba(0, 0, 0, 0.6)'
                              },
                              '& .business-hours': {
                                opacity: 1,
                                transform: 'translateX(0)'
                              }
                            }
                          }}
                        >
                          <Box sx={{ 
                            position: 'relative', 
                            zIndex: 1, 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center',
                            pl: 1.5
                          }}>
                            <Typography sx={{ 
                              fontSize: '1.1vw', 
                              fontWeight: 'bold',
                              color: 'white',
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                            }}>
                              {business.name}
                            </Typography>
                          </Box>
                          
                          <Box 
                            className="business-hours"
                            sx={{ 
                              position: 'relative', 
                              zIndex: 1,
                              pr: 1.5,
                              opacity: 0,
                              transform: 'translateX(10px)',
                              transition: 'opacity 0.3s ease, transform 0.3s ease'
                            }}
                          >
                            <Typography sx={{ 
                              fontSize: '0.9vw', 
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              padding: '0.3vw 0.6vw',
                              borderRadius: '1vw'
                            }}>
                              <AccessTimeIcon sx={{ fontSize: '0.9vw', mr: 0.5 }} />
                              {business.hours}
                            </Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography sx={{ fontSize: '0.9vw', color: '#999', textAlign: 'center', my: 2 }}>
                        Нет доступных мест
                      </Typography>
                    )}
                  </Box>
                </>
              )}
              
              {/* В правой панели для вкладки "favorites" */}
              {activeTab === "favorites" && (
                <>
                  <Typography sx={{ fontSize: '1.2vw', fontWeight: 'bold', mb: 1 }}>
                    Избранное
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.5vw', 
                    flexGrow: 1,
                    overflow: 'auto',
                    maxHeight: 'calc(100% - 3vw)', // Оставляем место только для заголовка
                    width: '100%',
                    '&::-webkit-scrollbar': {
                      width: '0.4vw',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1',
                      borderRadius: '0.2vw',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#888',
                      borderRadius: '0.2vw',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: '#555',
                    },
                  }}>
                    {loadingBusinesses || loadingFavorites ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : favorites.length > 0 ? (
                      businesses
                        .filter(business => favorites.includes(business.id))
                        .map((business) => (
                          <Box 
                            key={business.id}
                            onClick={() => setSelectedBusiness(business)}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              height: '3.8vw', // Фиксированная высота для всех кнопок
                              borderRadius: '0.8vw',
                              backgroundImage: business.photoURL ? `url(${business.photoURL})` : 'none',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              bgcolor: business.photoURL ? 'transparent' : '#eee',
                              position: 'relative',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              transition: 'transform 0.2s ease',
                              flexShrink: 0, // Предотвращает сжатие элементов
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                transition: 'background-color 0.3s ease'
                              },
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                '&::before': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.6)'
                                },
                                '& .business-hours': {
                                  opacity: 1,
                                  transform: 'translateX(0)'
                                }
                              }
                            }}
                          >
                            <Box sx={{ 
                              position: 'relative', 
                              zIndex: 1, 
                              display: 'flex', 
                              flexDirection: 'column',
                              justifyContent: 'center',
                              pl: 1.5
                            }}>
                              <Typography sx={{ 
                                fontSize: '1.1vw', 
                                fontWeight: 'bold',
                                color: 'white',
                                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                              }}>
                                {business.name}
                              </Typography>
                            </Box>
                            
                            <Box 
                              className="business-hours"
                              sx={{ 
                                position: 'relative', 
                                zIndex: 1,
                                pr: 1.5,
                                opacity: 0,
                                transform: 'translateX(10px)',
                                transition: 'opacity 0.3s ease, transform 0.3s ease'
                              }}
                            >
                              <Typography sx={{ 
                                fontSize: '0.9vw', 
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                padding: '0.3vw 0.6vw',
                                borderRadius: '1vw'
                              }}>
                                <AccessTimeIcon sx={{ fontSize: '0.9vw', mr: 0.5 }} />
                                {business.hours}
                              </Typography>
                            </Box>
                          </Box>
                        ))
                    ) : (
                      <Typography sx={{ fontSize: '0.9vw', color: '#999', textAlign: 'center', my: 2 }}>
                        У вас пока нет избранных мест
                      </Typography>
                    )}
                  </Box>
                </>
              )}
              
              {/* Для других вкладок показываем "Недавно посещали" */}
              {activeTab !== "locations" && activeTab !== "favorites" && (
                <>
                  <Typography sx={{ fontSize: '1.2vw', fontWeight: 'bold', mb: 1 }}>
                    Недавно посещали
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
                    {/* Пока пусто */}
                    <Typography sx={{ fontSize: '0.9vw', color: '#999', textAlign: 'center', my: 2 }}>
                      История посещений пуста
                    </Typography>
                  </Box>
                </>
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
          overflow: 'hidden',
          margin: '0 1vw 1vw 1vw'
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
