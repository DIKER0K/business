import { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, IconButton, createSvgIcon, CircularProgress, TextField, Button, Avatar, Grid, Select, MenuItem, FormControl } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { motion } from 'framer-motion';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';

const VkIcon = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path className="st0" d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974h-3.255c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.376 2.708z"/></svg>,
  'VkIcon'
);

interface NavigationPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBusiness: any | null;
  favorites: string[];
  toggleFavorite: (businessId: string) => void;
  user: any;
  handleLogout: () => void;
}

function NavigationPanel({ 
  activeTab, 
  setActiveTab, 
  selectedBusiness, 
  favorites, 
  toggleFavorite,
}: NavigationPanelProps) {
  const [location, setLocation] = useState("Калининград");
  const [loading, setLoading] = useState(false);
  
  // Состояния для формы создания бизнеса
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessPhoto, setBusinessPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessType, setBusinessType] = useState<"кафе" | "парикмахерская">("кафе");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");

  const getLocation = () => {
    setLoading(true);
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
            console.error("Ошибка при определении местоположения:", error);
            setLocation("Калининград");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Ошибка геолокации:", error);
          setLocation("Калининград");
          setLoading(false);
        }
      );
    } else {
      setLocation("Калининград");
      setLoading(false);
    }
  };

  // Функция для обработки загрузки файла
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setBusinessPhoto(event.target.files[0]);
    }
  };
  return (
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
        gap: '3vw',
        position: 'relative'
      }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab(activeTab === "business" ? "profile" : "business")}
        >
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: activeTab === "business" ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: activeTab === "business" ? '0.8vw' : '0',
            boxShadow: activeTab === "business" ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw'
          }}>
            <BusinessCenterIcon sx={{ 
              fontSize: '1.8vw', 
              color: activeTab === "business" ? '#fff' : 'inherit'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: activeTab === "business" ? '#1d1d1d' : 'inherit'
          }}>Бизнес</Typography>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab(activeTab === "favorites" ? "profile" : "favorites")}
        >
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: activeTab === "favorites" ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: activeTab === "favorites" ? '0.8vw' : '0',
            boxShadow: activeTab === "favorites" ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw'
          }}>
            <FavoriteIcon sx={{ 
              fontSize: '1.8vw', 
              color: activeTab === "favorites" ? '#fff' : 'inherit'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: activeTab === "favorites" ? '#1d1d1d' : 'inherit',
          }}>Избранное</Typography>
        </Box>
        
        {/* Кнопка лайка по центру - показывается только когда выбрана локация */}
        {(activeTab === "locations" || activeTab === "favorites") && selectedBusiness && (
          <Box 
            sx={{ 
              position: 'absolute',
              left: '49vw',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2
            }}
          >
            <IconButton 
              onClick={() => toggleFavorite(selectedBusiness.id)}
              sx={{ 
                color: favorites.includes(selectedBusiness.id) ? 'red' : '#1d1d1d',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                padding: '0.8vw',
                '&:hover': { 
                  backgroundColor: '#fff',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {favorites.includes(selectedBusiness.id) ? 
                <FavoriteIcon sx={{ fontSize: '2vw' }} /> : 
                <FavoriteBorderIcon sx={{ fontSize: '2vw' }} />
              }
            </IconButton>
          </Box>
        )}
        {(activeTab === "business") && (
          <Box 
            sx={{ 
              position: 'absolute',
              left: '49vw',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2
            }}
          >
            <Button 
              sx={{color: 'white', backgroundColor: '#1d1d1d', borderRadius: '1vw'}} 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Добавить бизнес"}
            </Button>
          </Box>
        )}
        
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab(activeTab === "settings" ? "profile" : "settings")}
        >
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: activeTab === "settings" ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: activeTab === "settings" ? '0.8vw' : '0',
            boxShadow: activeTab === "settings" ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw'
          }}>
            <SettingsIcon sx={{ 
              fontSize: '1.8vw', 
              color: activeTab === "settings" ? '#fff' : 'inherit'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: activeTab === "settings" ? '#1d1d1d' : 'inherit',
          }}>Настройки</Typography>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab(activeTab === "locations" ? "profile" : "locations")}
        >
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: activeTab === "locations" ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: activeTab === "locations" ? '0.8vw' : '0',
            boxShadow: activeTab === "locations" ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw'
          }}>
            <LocationOnIcon sx={{ 
              fontSize: '1.8vw', 
              color: activeTab === "locations" ? '#fff' : 'inherit'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: activeTab === "locations" ? '#1d1d1d' : 'inherit'
          }}>Локации</Typography>
        </Box>
        <Box sx={{
            position: 'absolute',
            right: '0vw',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5vw'
        }}>
            <VkIcon />
            <TelegramIcon />
            <InstagramIcon />
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              }}>
                <IconButton onClick={getLocation} disabled={loading} size="small">
                {loading ? 
                  <CircularProgress size={20} sx={{ color: 'black' }} /> : 
                  <PlaceRoundedIcon sx={{ color: 'black', fontSize: '1.2vw' }} />
                }
              </IconButton>
              <Typography sx={{ color: 'black', fontSize: '0.9vw', mr: '0.5vw' }}>
                {loading ? 'Определение...' : location}
              </Typography>
          </Box>
        </Box>
        </Box>

      {/* Содержимое вкладки "Бизнес" */}
      {activeTab === "business" && (
        <Grid container spacing={2} sx={{
          padding: '1vw 2vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: '1vw',
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5vw'
          }}>
            <Typography variant="h6" sx={{ fontSize: '0.6vw', fontWeight: 'bold', color: '#979797' }}>
              Сгенерировать ИИ
            </Typography>
            <Button 
              sx={{color: 'white', backgroundColor: '#1d1d1d', borderRadius: '1vw'}} 
              variant="contained" 
              color="primary"
              component="label"
            >
              Загрузить фото
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            <Avatar />
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5vw'}}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography variant="h6" sx={{ fontSize: '0.6vw', fontWeight: 'bold', color: '#979797' }}>
                Введите название бизнеса
              </Typography>
              <TextField
                label="Название бизнеса"
                variant="outlined"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography variant="h6" sx={{ fontSize: '0.6vw', fontWeight: 'bold', color: '#979797' }}>
                Введите номер телефона
              </Typography>
              <TextField
                label="Номер телефона"
                variant="outlined"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
              />
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography variant="h6" sx={{ fontSize: '0.6vw', fontWeight: 'bold', color: '#979797' }}>
                Оставьте почту
              </Typography>
              <TextField
                label="Почта"
                variant="outlined"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
              />
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography variant="h6" sx={{ fontSize: '0.6vw', fontWeight: 'bold', color: '#979797' }}>
                Опишите ваш бизнес
              </Typography>
              <TextField
                label="Описать"
                variant="outlined"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
              />
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography variant="h6" sx={{ fontSize: '0.6vw', fontWeight: 'bold', color: '#979797' }}>
                Укажите сайт(если есть)
              </Typography>
              <TextField
                label="Сайт"
                variant="outlined"
                value={businessWebsite}
                onChange={(e) => setBusinessWebsite(e.target.value)}
              />
            </Box>
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5vw'}}>
          <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography variant="h6" sx={{ fontSize: '0.6vw', fontWeight: 'bold', color: '#979797' }}>
                Тип бизнеса
              </Typography>
              <FormControl>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={businessType}
                label="Тип"
                onChange={(e) => setBusinessType(e.target.value as "кафе" | "парикмахерская")}
                >
                <MenuItem value={"кафе"}>Кафе</MenuItem>
                <MenuItem value={"парикмахерская"}>Парикмахерская</MenuItem>
              </Select>
              </FormControl>
          </Box>
          <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography variant="h6" sx={{ fontSize: '0.6vw', fontWeight: 'bold', color: '#979797' }}>
                Город
              </Typography>
              <TextField
                label="Город"
                variant="outlined"
                value={businessCity}
                onChange={(e) => setBusinessCity(e.target.value)}
              />
          </Box>
          <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography variant="h6" sx={{ fontSize: '0.6vw', fontWeight: 'bold', color: '#979797' }}>
                Часы работы
              </Typography>
              <TextField
                label="Часы работы"
                variant="outlined"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
              />
          </Box>
          <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1vw'
            }}>
              <Typography variant="h6" sx={{ fontSize: '0.6vw', fontWeight: 'bold', color: '#979797' }}>
                Укажите адрес
              </Typography>
              <TextField
                label="Адрес"
                variant="outlined"
              />
          </Box>
          </Box>
        </Grid>
      )}
    </motion.div>
  );
}

export default NavigationPanel;