import * as React from 'react';
import { styled } from '@mui/material/styles';
import './styles/TableReservation.css'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import Menu from '../components/Menu';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import HotelClassIcon from '@mui/icons-material/HotelClass';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocationPinIcon from '@mui/icons-material/LocationPin';

function BusinessManProfile() {
  return (
    <Box sx={{ 
      flexGrow: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      height: '46vw',
      margin: '2vw'
    }}>
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        mb: '4vw'
      }}>
        {/* Левая колонка с меню и контентом */}
        <Box sx={{ flex: 1}}>
          
          {/* Блок с меню и карточками блюд */}
          <Box sx={{ 
            bgcolor: 'white', 
            borderRadius: '2vw', 
            p: '1.25vw',
            height: '100%'
          }}>
            <Box sx={{ mb: 3 }}>
              <KeyboardArrowLeftOutlinedIcon />
            </Box>
            {/* <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                Баранки
              </Grid>
              <Grid item xs={12} sm={4}>
                Борщ
              </Grid>
              <Grid item xs={12} sm={4}>
                Холодец
              </Grid>
            </Grid> */}
          </Box>
        </Box>
        
        {/* Правая колонка о ресторане */}
        <Box sx={{ 
          width: '17vw', 
          ml: '1.5vw', 
          bgcolor: 'white', 
          borderRadius: '2vw', 
          p: '1.25vw', 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
        }}>
          <Typography sx={{color:'black', fontSize: '2vw', display: 'flex', justifyContent: 'center'}}>Меню</Typography>
          <Typography sx={{color:'grey', mb: '1vw', fontSize: '1vw', display: 'flex', justifyContent: 'center'}}>Салаты</Typography>
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between'
          }}>
            <Box>
              <Typography variant="body2" sx={{mb: 1}}>Ресторан "Бублики"</Typography>
              <Typography variant="body2" sx={{mb: 1}}>г. Калининград, ул. Пушкина 78</Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{mb: 1}}>Часы работы:</Typography>
              <Typography variant="body2" sx={{mb: 1}}>Пн-Пт: 9:00-21:00</Typography>
              <Typography variant="body2" sx={{mb: 1}}>Сб-Вс: 10:00-22:00</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Нижняя панель навигации - обновленная версия */}
      <Box sx={{ 
        bgcolor: 'white', 
        borderRadius: '2vw',  
        p: '1vw', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 'auto',
        mb: '1vw',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: '2vw',
          gap: '3vw',
          cursor: 'pointer',
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MenuIcon sx={{ fontSize: '1.8vw', mb: '0.3vw' }} />
            <Typography variant="body2" sx={{fontSize: '1vw'}}>Меню</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <HotelClassIcon sx={{ fontSize: '1.8vw', mb: '0.3vw' }} />
            <Typography variant="body2" sx={{fontSize: '1vw'}}>Отзывы</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalendarMonthIcon sx={{ fontSize: '1.8vw', mb: '0.3vw' }} />
            <Typography variant="body2" sx={{fontSize: '1vw'}}>Бронь</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MenuBookIcon sx={{ fontSize: '1.8vw', mb: '0.3vw' }} />
            <Typography variant="body2" sx={{fontSize: '1vw'}}>Состав</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <LocationPinIcon sx={{ fontSize: '1.8vw', mb: '0.3vw' }} />
            <Typography variant="body2" sx={{fontSize: '1vw'}}>Локации</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default BusinessManProfile
