import { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, IconButton, createSvgIcon, CircularProgress, Switch, styled } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import { motion } from 'framer-motion';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { Link, useLocation, useParams } from 'react-router-dom';
import { User } from 'firebase/auth';
import LunchDiningRoundedIcon from '@mui/icons-material/LunchDiningRounded';
import HotelClassOutlinedIcon from '@mui/icons-material/HotelClassOutlined';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { Avatar } from '@mui/material';

const VkIcon = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path className="st0" d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974h-3.255c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.376 2.708z"/></svg>,
  'VkIcon'
);

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

interface BarberNavigationPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLocation: string;
  loadingLocation: boolean;
  getLocation: () => void;
  user?: User;
}

function BarberNavigationPanel({ 
  currentLocation,
  loadingLocation,
  getLocation,
}: BarberNavigationPanelProps) {
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
        <Box 
          component={Link}
          to={`/business/${businessId}/barber_services`}
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
            backgroundColor: location.pathname === `/business/${businessId}/barber_services` ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: location.pathname === `/business/${businessId}/barber_services` ? '0.8vw' : '0',
            boxShadow: location.pathname === `/business/${businessId}/barber_services` ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw'
          }}>
            <LunchDiningRoundedIcon sx={{ 
              fontSize: '1.8vw', 
              color: location.pathname === `/business/${businessId}/barber_services` ? '#fff' : '#1d1d1d'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: location.pathname === `/business/${businessId}/barber_services` ? '#1d1d1d' : '#1d1d1d'
          }}>Услуги</Typography>
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

        <Box sx={{
          position: 'absolute',
          right: '-14vw',
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
    </motion.div>
  );
}

export default BarberNavigationPanel;