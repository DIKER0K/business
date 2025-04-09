import { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, IconButton, createSvgIcon, CircularProgress } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import { motion } from 'framer-motion';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { Link, useLocation, useParams } from 'react-router-dom';
import { User } from 'firebase/auth';
import LunchDiningRoundedIcon from '@mui/icons-material/LunchDiningRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import HotelClassOutlinedIcon from '@mui/icons-material/HotelClassOutlined';

const VkIcon = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path className="st0" d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974h-3.255c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.376 2.708z"/></svg>,
  'VkIcon'
);

interface RestaurantNavigationPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLocation: string;
  loadingLocation: boolean;
  getLocation: () => void;
  user?: User;
}

function RestaurantNavigationPanel({ 
  currentLocation,
  loadingLocation,
  getLocation,
}: RestaurantNavigationPanelProps) {
  const location = useLocation();
  const { businessId } = useParams();

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
      animate={{ height: '6vw' }}
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
          to={`/business/${businessId}/restaurant_menu`}
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
            backgroundColor: location.pathname === `/business/${businessId}/restaurant_menu` ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: location.pathname === `/business/${businessId}/restaurant_menu` ? '0.8vw' : '0',
            boxShadow: location.pathname === `/business/${businessId}/restaurant_menu` ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw'
          }}>
            <LunchDiningRoundedIcon sx={{ 
              fontSize: '1.8vw', 
              color: location.pathname === `/business/${businessId}/restaurant_menu` ? '#fff' : '#1d1d1d'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: location.pathname === `/business/${businessId}/restaurant_menu` ? '#1d1d1d' : '#1d1d1d'
          }}>Меню</Typography>
        </Box>

        <Box 
          component={Link}
          to="/reviews"
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
            backgroundColor: location.pathname === '/reviews' ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: location.pathname === '/reviews' ? '0.8vw' : '0',
            boxShadow: location.pathname === '/reviews' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw',
            cursor: 'pointer'
          }}>
            <HotelClassOutlinedIcon sx={{ 
              fontSize: '1.8vw', 
              color: location.pathname === '/reviews' ? '#fff' : '#1d1d1d'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: location.pathname === '/reviews' ? '#1d1d1d' : '#1d1d1d'
          }}>Отзывы</Typography>
        </Box>

        <Box 
          component={Link}
          to={`/app`}
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
            backgroundColor: location.pathname === `/app/` ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: location.pathname === `/app` ? '0.8vw' : '0',
            boxShadow: location.pathname === `/app` ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw'
          }}>
            <LocationOnRoundedIcon sx={{ 
              fontSize: '1.8vw', 
              color: location.pathname === `/app` ? '#fff' : '#1d1d1d'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: location.pathname === `/app` ? '#1d1d1d' : '#1d1d1d'
          }}>Локации</Typography>
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
              {loadingLocation ? 'Определение...' : currentLocation}
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

export default RestaurantNavigationPanel;