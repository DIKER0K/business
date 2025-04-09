import { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, IconButton, createSvgIcon, CircularProgress, TextField, Button, MenuItem } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import { motion } from 'framer-motion';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { Link, useLocation } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

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
}

function NavigationPanel({ 
  activeTab, 
  setActiveTab,
  currentLocation,
  loadingLocation,
  getLocation
}: NavigationPanelProps) {
  const location = useLocation();

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
        height: location.pathname === '/business' ? '18vw' : '6vw',
        marginTop: location.pathname === '/business' ? '-12vw' : '0'
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
            <BusinessCenterIcon sx={{ 
              fontSize: '1.8vw', 
              color: location.pathname === '/featured' ? '#fff' : '#1d1d1d'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: location.pathname === '/featured' ? '#1d1d1d' : '#1d1d1d'
          }}>Избранное</Typography>
        </Box>

        {/* Блок геолокации */}
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={getLocation} disabled={loadingLocation} size="small">
              {loadingLocation ? 
                <CircularProgress size={20} sx={{ color: 'black' }} /> : 
                <PlaceRoundedIcon sx={{ color: 'black', fontSize: '1.2vw' }} />
              }
            </IconButton>
            <Typography sx={{ color: 'black', fontSize: '0.9vw', mr: '0.5vw' }}>
              {loadingLocation ? 'Определение...' : currentLocation}
            </Typography>
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
        boxSizing: 'border-box'
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
            bgcolor: '#f5f5f5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}>
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
          </Box>
          
          {/* Название бизнеса */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Введите название бизнеса
            </Typography>
            <TextField
              placeholder="Например ООО Билл"
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
            />
          </Box>
          
          {/* Телефон */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Введите номер телефона
            </Typography>
            <TextField
              placeholder="+7(999)999-99-99"
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
            />
          </Box>
          
          {/* Почта */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Оставьте почту
            </Typography>
            <TextField
              placeholder="example@gmail.com"
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
            />
          </Box>
          
          {/* Описание бизнеса */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Опишите ваш бизнес
            </Typography>
            <TextField
              placeholder="Описать"
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
              placeholder="Указать"
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
            />
          </Box>
          
          {/* Тип бизнеса */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Тип бизнеса
            </Typography>
            <TextField
              select
              defaultValue="cafe"
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
              <MenuItem value="cafe">Кафе</MenuItem>
              <MenuItem value="barbershop">Парикмахерская</MenuItem>
            </TextField>
          </Box>
          
          {/* Город */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.8vw', color: '#666' }}>
              Укажите город
            </Typography>
            <TextField
              select
              defaultValue="kaliningrad"
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
              <MenuItem value="kaliningrad">Калининград</MenuItem>
              <MenuItem value="moscow">Москва</MenuItem>
              <MenuItem value="spb">Санкт-Петербург</MenuItem>
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
              placeholder="Указать"
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
            />
          </Box>
        </Box>
        
        {/* Кнопка "Добавить бизнес" */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '1vw' }}>
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
              }
            }}
          >
            Добавить бизнес
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}

export default NavigationPanel;