import * as React from 'react';
import { styled } from '@mui/material/styles';
import './styles/TableReservation.css'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import Menu from '../components/Menu';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';

function TableReservation() {
  return (
    <Box sx={{ 
      flexGrow: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh'
    }}>
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        mb: 8
      }}>
        {/* Левая колонка с меню и контентом */}
        <Box sx={{ flex: 1 }}>
          {/* Верхнее меню */}
          
          <Menu />
          
          {/* Блок с меню и карточками блюд */}
          <Box sx={{ 
            bgcolor: 'white', 
            borderRadius: '2vw', 
            p: 3,
            height: 'calc(100% - 40px)'
          }}>
            <Box sx={{ mb: 3 }}>
              <KeyboardArrowLeftOutlinedIcon />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                Баранки
              </Grid>
              <Grid item xs={12} sm={4}>
                Борщ
              </Grid>
              <Grid item xs={12} sm={4}>
                Холодец
              </Grid>
            </Grid>
          </Box>
        </Box>
        
        {/* Правая колонка о ресторане */}
        <Box sx={{ 
          width: '300px', 
          ml: 2, 
          bgcolor: 'white', 
          borderRadius: '2vw', 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
        }}>
          <Typography sx={{color:'black', mb: 2}}>Информация о ресторане</Typography>
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
      
      {/* Нижняя панель навигации*/}
      <Box sx={{ 
        bgcolor: 'white', 
        borderRadius: '2vw',  
        p: 4, 
        display: 'flex', 
        justifyContent: 'center',
        mt: 'auto',
        mb: 3
      }}>
        <Grid container sx={{ maxWidth: '200px' }} justifyContent="space-between">
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            Меню
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            Отзывы
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            Бронь
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default TableReservation
