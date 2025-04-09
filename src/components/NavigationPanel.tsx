import { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, IconButton, createSvgIcon, CircularProgress, TextField, Button, MenuItem, Switch, styled, Avatar } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import { motion } from 'framer-motion';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { Link, useLocation } from 'react-router-dom';
import { User, updatePassword, updatePhoneNumber, signOut } from 'firebase/auth';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';

const VkIcon = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path className="st0" d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974h-3.255c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.376 2.708z"/></svg>,
  'VkIcon'
);

interface NavigationPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLocation: string;
  loadingLocation: boolean;
  getLocation: () => void;
  user: User;
}

const DarkModeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(0.3vw)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(1.1vw)',
      '& .MuiSwitch-thumb': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#535353' : '#535353',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#535353' : '#2F2F2F',
    width: 32,
    height: 32,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
      '#fff',
    )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#535353' : '#2F2F2F',
    borderRadius: 20 / 2,
  },
}));

function NavigationPanel({ 
  currentLocation,
  loadingLocation,
  getLocation,
  user,
}: NavigationPanelProps) {
  const location = useLocation();

  // Добавим состояния для полей формы
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [businessType, setBusinessType] = useState('Кафе');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasBusiness, setHasBusiness] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [generatingAvatar, setGeneratingAvatar] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [newPassword, setNewPassword] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const generateAIAvatar = async () => {
    try {
      setGeneratingAvatar(true);
      const response = await fetch('https://api.deepai.org/api/text2img', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': '85223f82-aec0-453b-8dff-35f0439b778e' // Замените на действительный ключ
        },
        body: JSON.stringify({
          text: `Professional business logo for ${businessName || 'a company'}, minimalist style`,
        })
      });
      
      const data = await response.json();
      if(data.output_url) {
        setAvatarUrl(data.output_url);
      }
    } catch (error) {
      console.error('Ошибка генерации аватара:', error);
      alert('Ошибка генерации: проверьте API ключ и интернет-соединение');
    } finally {
      setGeneratingAvatar(false);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async () => {
    if (!user) {
      alert('Требуется авторизация');
      return;
    }
    
    if (hasBusiness) {
      alert('Вы можете добавить только один бизнес');
      return;
    }

    try {
      setLoading(true);
      // Добавляем uid пользователя в данные бизнеса
      const businessData = {
        name: businessName,
        phone,
        email,
        description,
        website,
        type: businessType,
        city,
        address,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: user.uid, // Явно используем uid авторизованного пользователя
      };

      // Добавляем документ в коллекцию businesses
      const docRef = await addDoc(collection(db, 'businesses'), businessData);
      console.log('Business added with ID: ', docRef.id);
      
      // Очищаем форму
      setBusinessName('');
      setPhone('');
      setEmail('');
      setDescription('');
      setWebsite('');
      setCity('');
      setAddress('');
      
      alert('Бизнес успешно добавлен!');
    } catch (error) {
      console.error('Error adding business: ', error);
      alert('Ошибка при добавлении бизнеса');
    } finally {
      setLoading(false);
    }
  };

  // Функция сохранения изменений
  const handleSaveChanges = async () => {
    try {
      const updates = [];
      
      // Обновление номера телефона
      if (phoneNumber !== user.phoneNumber) {
        // Требуется реализация верификации номера
        // await updatePhoneNumber(user, phoneNumber);
        updates.push('номер телефона');
      }

      // Обновление пароля
      if (newPassword) {
        await updatePassword(user, newPassword);
        setNewPassword('');
        updates.push('пароль');
      }

      if (updates.length > 0) {
        alert(`Успешно обновлено: ${updates.join(', ')}`);
      } else {
        alert('Нет изменений для сохранения');
      }
      
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert(`Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
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
        height: ['/business', '/settings'].includes(location.pathname) ? '18vw' : '6vw',
        marginTop: ['/business', '/settings'].includes(location.pathname) ? '-12vw' : '0'
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
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
        {/* Блок навигации */}
        <Box 
          component={Link}
          to="/business"
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
          onClick={(e) => {
            if (location.pathname === '/business') {
              e.preventDefault();
              window.history.back();
            }
          }}
        >
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: location.pathname === '/business' ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: location.pathname === '/business' ? '0.8vw' : '0',
            boxShadow: location.pathname === '/business' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw'
          }}>
            <BusinessCenterIcon sx={{ 
              fontSize: '1.8vw', 
              color: location.pathname === '/business' ? '#fff' : '#1d1d1d'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: location.pathname === '/business' ? '#1d1d1d' : '#1d1d1d'
          }}>Бизнес</Typography>
        </Box>

        <Box 
          component={Link}
          to="/settings"
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: location.pathname === '/settings' ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: location.pathname === '/settings' ? '0.8vw' : '0',
            boxShadow: location.pathname === '/settings' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw'
          }}>
            <SettingsIcon sx={{ 
              fontSize: '1.8vw', 
              color: location.pathname === '/settings' ? '#fff' : '#1d1d1d'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: location.pathname === '/settings' ? '#1d1d1d' : '#1d1d1d'
          }}>Настройки</Typography>
        </Box>

        <Box 
          component={Link}
          to="/featured"
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: location.pathname === '/featured' ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: location.pathname === '/featured' ? '0.8vw' : '0',
            boxShadow: location.pathname === '/featured' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw',
            cursor: 'pointer'
          }}>
            <BookmarkRoundedIcon sx={{ 
              fontSize: '1.8vw', 
              color: location.pathname === '/featured' ? '#fff' : '#1d1d1d'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: location.pathname === '/featured' ? '#1d1d1d' : '#1d1d1d'
          }}>Избранное</Typography>
        </Box>

        <Box 
          component={Link}
          to="/location"
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: location.pathname === '/location' ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: location.pathname === '/location' ? '0.8vw' : '0',
            boxShadow: location.pathname === '/location' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw',
            cursor: 'pointer'
          }}>
            <LocationOnRoundedIcon sx={{ 
              fontSize: '1.8vw', 
              color: location.pathname === '/location' ? '#fff' : '#1d1d1d'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: location.pathname === '/location' ? '#1d1d1d' : '#1d1d1d'
          }}>Локации</Typography>
        </Box>

        <Box 
          component={Link}
          to="/employer"
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: location.pathname === '/employer' ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: location.pathname === '/employer' ? '0.8vw' : '0',
            boxShadow: location.pathname === '/employer' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw',
            cursor: 'pointer'
          }}>
            <BusinessCenterIcon sx={{ 
              fontSize: '1.8vw', 
              color: location.pathname === '/employer' ? '#fff' : '#1d1d1d'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: location.pathname === '/employer' ? '#1d1d1d' : '#1d1d1d'
          }}>ИП</Typography>
        </Box>

        {/* Изменяем условие отображения только для /business */}
        {location.pathname === '/business' && (
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1d1d1d',
            borderRadius: '1vw',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            mb: '0.3vw',
            cursor: 'pointer',
            position: 'absolute',
            right: '50vw'
          }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#1d1d1d',
                color: 'white',
                borderRadius: '0.5vw',
                padding: '0.5vw 2vw',
                fontSize: '0.9vw',
                textTransform: 'none',
                height: '3vw',
                '&:hover': {
                  bgcolor: '#333'
                },
                '&:disabled': {
                  bgcolor: '#666',
                  color: '#999'
                }
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Добавляем...' : 'Добавить бизнес'}
            </Button>
          </Box>
        )}

        {/* Блок геолокации */}
        <Box sx={{
          position: 'absolute',
          right: '-10vw',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5vw'
        }}>
          <VkIcon />
          <TelegramIcon />
          <InstagramIcon />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => {
              console.log("Кнопка определения местоположения нажата");
              getLocation();
            }} disabled={loadingLocation} size="small">
              {loadingLocation ? 
                <CircularProgress size={24} sx={{color:'black'}} /> : 
                <PlaceRoundedIcon sx={{color:'black'}}/>
              }
            </IconButton>
            <Typography sx={{ color: 'black', fontSize: '0.9vw', mr: '0.5vw' }}>
              {loadingLocation ? 'Определение...' : (currentLocation || 'Местоположение не определено')}
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <DarkModeSwitch />
                <IconButton aria-label="delete">
                    <RemoveRedEyeRoundedIcon sx={{color:'black'}} />
                </IconButton>
            </Box>
            <Box sx={{display:'flex', alignItems:'center'}}>
                <Typography sx={{color: 'black'}}>Язык</Typography>
                <IconButton>
                    <ArrowDropDownOutlinedIcon sx={{color: 'black'}} />
                </IconButton>
                <Avatar sx={{width: '1.8vw', height: '1.8vw', color: 'black'}} src="/broken-image.jpg" />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5vw',
        width: '100%',
        padding: '0vw 2vw',
        bgcolor: 'white',
        borderRadius: '2vw',
        maxWidth: '100%',
        boxSizing: 'border-box',
        display: location.pathname === '/business' ? 'flex' : 'none',
      }}>
        {/* Первая строка: аватарка, название бизнеса, телефон, почта, описание */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '5vw 1fr 1fr 1fr 1fr',
          gap: '1.5vw',
          alignItems: 'flex-start',
          width: '100%'
        }}>
          {/* Аватарка */}
          <Box sx={{ 
            width: '5vw', 
            height: '5vw', 
            borderRadius: '50%', 
            bgcolor: '#a5a5a5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative'
          }}>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Business avatar" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
              />
            ) : (
              <>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                />
                <label htmlFor="avatar-upload">
                  <IconButton component="span">
                    <CameraAltIcon sx={{ fontSize: '1.8vw' }} />
                  </IconButton>
                </label>
              </>
            )}
          </Box>
          {/* <Button 
              variant="contained" 
              color="primary"
              onClick={generateAIAvatar}
              disabled={generatingAvatar}
              size="small"
              sx={{
                position: 'absolute',
                width: '10vw',
                height: '2.8vw',
                fontSize: '0.9vw',
                borderRadius: '2vw',
                bgcolor: '#1d1d1d',
                color: 'white',
                
              }}
            >
              {generatingAvatar ? 'Генерация...' : 'Генерация ИИ'}
            </Button> */}
          {/* Название бизнеса */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Введите название бизнеса
            </Typography>
            <TextField
              placeholder="Название бизнеса"
              variant="outlined"
              fullWidth
              size="small"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '2vw',
                  bgcolor: 'white',
                  fontSize: '0.9vw',
                  height: '2.8vw',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  }
                }
              }}
            />
          </Box>
          
          {/* Телефон */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Введите номер телефона
            </Typography>
            <TextField
              placeholder="Телефон"
              variant="outlined"
              fullWidth
              size="small"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '2vw',
                  bgcolor: 'white',
                  fontSize: '0.9vw',
                  height: '2.8vw',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  }
                }
              }}
            />
          </Box>
          
          {/* Почта */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Оставьте почту
            </Typography>
            <TextField
              placeholder="Почта"
              variant="outlined"
              fullWidth
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '2vw',
                  bgcolor: 'white',
                  fontSize: '0.9vw',
                  height: '2.8vw',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  }
                }
              }}
            />
          </Box>
          
          {/* Описание бизнеса */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Опишите ваш бизнес
            </Typography>
            <TextField
              placeholder="Описание"
              variant="outlined"
              fullWidth
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '2vw',
                  bgcolor: 'white',
                  fontSize: '0.9vw',
                  height: '2.8vw',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  }
                }
              }}
            />
          </Box>
        </Box>
        
        {/* Вторая строка: сайт, тип бизнеса, город, часы работы, адрес */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '1.5vw',
          width: '100%'
        }}>
          {/* Сайт */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Укажите сайт (если есть)
            </Typography>
            <TextField
              placeholder="Сайт"
              variant="outlined"
              fullWidth
              size="small"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '2vw',
                  bgcolor: 'white',
                  fontSize: '0.9vw',
                  height: '2.8vw',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  }
                }
              }}
            />
          </Box>
          
          {/* Тип бизнеса */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Тип бизнеса
            </Typography>
            <TextField
              select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  borderRadius: '2vw',
                  bgcolor: 'white',
                  fontSize: '0.9vw',
                  height: '2.8vw',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  }
                }
              }}
            >
              <MenuItem value="Кафе">Кафе</MenuItem>
              <MenuItem value="Парикмахерская">Парикмахерская</MenuItem>
            </TextField>
          </Box>
          
          {/* Город */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Укажите город
            </Typography>
            <TextField
              select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  borderRadius: '2vw',
                  bgcolor: 'white',
                  fontSize: '0.9vw',
                  height: '2.8vw',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  }
                }
              }}
            >
              <MenuItem value="Калининград">Калининград</MenuItem>
              <MenuItem value="Москва">Москва</MenuItem>
              <MenuItem value="Санкт-Петербург">Санкт-Петербург</MenuItem>
            </TextField>
          </Box>
          
          {/* Часы работы */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Часы работы
            </Typography>
            <TextField
              select
              defaultValue=""
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Указать"
              InputProps={{
                sx: {
                  borderRadius: '2vw',
                  bgcolor: 'white',
                  fontSize: '0.9vw',
                  height: '2.8vw',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  }
                }
              }}
            >
              <MenuItem value="">Указать</MenuItem>
              <MenuItem value="24/7">Круглосуточно</MenuItem>
              <MenuItem value="9-18">9:00 - 18:00</MenuItem>
              <MenuItem value="10-22">10:00 - 22:00</MenuItem>
            </TextField>
          </Box>
          
          {/* Адрес */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Укажите адрес
            </Typography>
            <TextField
              placeholder="Адрес"
              variant="outlined"
              fullWidth
              size="small"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '2vw',
                  bgcolor: 'white',
                  fontSize: '0.9vw',
                  height: '2.8vw',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.15vw'
                  }
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5vw',
        width: '100%',
        padding: '0vw 2vw',
        bgcolor: 'white',
        borderRadius: '2vw',
        maxWidth: '100%',
        boxSizing: 'border-box',
        marginTop: '2vw',
        display: location.pathname === '/settings' ? 'flex' : 'none',
      }}>
        {/* Строка с настройками */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '5vw 1fr 1fr 1fr 1fr',
          gap: '1.5vw',
          alignItems: 'center',
          width: '100%',
          position: 'relative'
        }}>
          {/* Аватарка */}
          <Box sx={{ 
            width: '5vw', 
            height: '5vw', 
            borderRadius: '50%', 
            bgcolor: '#c7c7c7',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="settings-avatar-upload"
              type="file"
            />
            <label htmlFor="settings-avatar-upload">
              <IconButton component="span">
                <CameraAltIcon sx={{ fontSize: '1.8vw' }} />
              </IconButton>
            </label>
          </Box>

          {/* Смена телефона */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Номер телефона
            </Typography>
            <TextField
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                sx: {
                  borderRadius: '2vw',
                  fontSize: '0.9vw',
                  height: '2.8vw',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.2vw'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.2vw'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.2vw'
                  }
                }
              }}
            />
          </Box>

          {/* Смена пароля */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#1d1d1d' }}>
              Новый пароль
            </Typography>
            <TextField
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                sx: {
                  borderRadius: '2vw',
                  fontSize: '0.9vw',
                  height: '2.8vw',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.2vw'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.2vw'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1d1d1d',
                    borderWidth: '0.2vw'
                  }
                }
              }}
            />
          </Box>

          {/* Уведомления */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#1d1d1d' }}>
              Уведомления
            </Typography>
            <Button 
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              variant="outlined" 
              sx={{
                borderColor: '#1d1d1d',
                color: '#1d1d1d',
                '&:hover': {
                  borderColor: '#333',
                  backgroundColor: 'rgba(29,29,29,0.1)'
                },
                borderRadius: '2vw',
                fontSize: '0.9vw',
                height: '2.8vw',
                textTransform: 'none',
                borderWidth: '0.2vw'
              }}
            >
              {notificationsEnabled ? 'Выключить' : 'Включить'}
            </Button>
          </Box>

          {/* Выход */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#1d1d1d' }}>
              Аккаунт
            </Typography>
            <Button 
              variant="contained"
              onClick={() => signOut(auth).then(() => window.location.reload())}
              sx={{
                bgcolor: '#1d1d1d',
                color: 'white',
                borderRadius: '2vw',
                fontSize: '0.9vw',
                height: '2.8vw',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#333'
                }
              }}
            >
              Выйти
            </Button>
          </Box>

          {/* Кнопка сохранения */}
          <Button
            variant="contained"
            onClick={handleSaveChanges}
            sx={{
              position: 'absolute',
              bottom: '-4vw',
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: '#1d1d1d',
              color: 'white',
              borderRadius: '2vw',
              padding: '0.8vw 3vw',
              fontSize: '0.9vw',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#333'
              }
            }}
          >
            Сохранить изменения
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}

export default NavigationPanel;