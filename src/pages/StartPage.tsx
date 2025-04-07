import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { Typography } from "@mui/material"
import "./styles/StartPage.css"
import "./styles/fonts/SF-Pro-Display-Medium.otf"
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import TelegramIcon from '@mui/icons-material/Telegram';
import Button from '@mui/material/Button';

const DarkModeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
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

function StartPage() {
    const [location, setLocation] = useState<string>("Не определено");
    const [loading, setLoading] = useState<boolean>(false);
    
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
                                    "Не определено";
                        setLocation(city);
                    } catch (error) {
                        console.error("Ошибка при определении местоположения:", error);
                        setLocation("Ошибка определения");
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error("Ошибка геолокации:", error);
                    setLocation("Доступ запрещен");
                    setLoading(false);
                }
            );
        } else {
            setLocation("Геолокация не поддерживается");
            setLoading(false);
        }
    };

    return(
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: '2vw'}}>
        <Box sx={{display:'flex', alignItems:'center', justifyContent: "center", gap: '5vw'}}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <DarkModeSwitch />
                <IconButton aria-label="delete">
                    <RemoveRedEyeRoundedIcon sx={{color:'white'}} />
                </IconButton>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Typography sx={{color:'white'}}>{loading ? 'Определение...' : location}</Typography>
                <IconButton onClick={getLocation} disabled={loading}>
                    {loading ? 
                        <CircularProgress size={24} sx={{color:'white'}} /> : 
                        <PlaceRoundedIcon sx={{color:'white'}}/>
                    }
                </IconButton>
            </Box>
            <Box sx={{display:'flex', alignItems:'center'}}>
                <Typography sx={{color: 'white'}}>Язык</Typography>
                <IconButton>
                    <ArrowDropDownOutlinedIcon sx={{color: 'white'}} />
                </IconButton>
                <Avatar sx={{width: '1.8vw', height: '1.8vw'}} src="/broken-image.jpg" />
            </Box>
            <Button
                variant="contained"
                startIcon={<TelegramIcon />}
                sx={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: '999px',
                    padding: '10px 16px',
                    fontWeight: 500,
                    fontSize: '16px',
                    '&:hover': {
                        backgroundColor: 'transparent',
                        boxShadow: 'none'
                    },
                    boxShadow: 'none'
                }}
            >
                Войти с помощью Telegram
            </Button>
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-28vw'}}>
            <img className='logo' src="logo.svg" alt="logo" />
        </Box>
    </Box>
    )
}

export default StartPage