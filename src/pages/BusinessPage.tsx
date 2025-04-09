import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase/config';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { Avatar, Typography, IconButton, Divider, Grid, CircularProgress } from '@mui/material';
import { getFirestore, collection, getDocs, query, where, limit } from "firebase/firestore";
import { motion } from 'framer-motion';

function BusinessPage() {
  const location = useLocation();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '42vw',
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
        <motion.div
          style={{
            flex: 1,
            backgroundColor: '#1F1F1F',
            borderRadius: '1vw',
            overflow: 'hidden',
            padding: '1vw',
          }}
          animate={{ 
            height: location.pathname === '/business' ? '25.5vw' : '39.5vw'
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          layout
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '3vw',
          }}>
            {/* Основной заголовок */}
            <Typography 
              component="div"
              sx={{
                color: 'white',
                fontSize: '3.5vw',
                fontWeight: 'bold',
                textAlign: 'left',
                mb: '1vw'
              }}
            >
              Продвигайте свой бизнес
              <Typography 
                component="div"
                sx={{
                  color: 'white',
                  fontSize: '2.5vw',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  mt: '0.5vw'
                }}
              >
                вместе с QWERTY TOWN!
              </Typography>
            </Typography>

            {/* Блок описания */}
            <Box component="div" sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                component="div"
                sx={{
                  color: 'white',
                  fontSize: '2vw',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  mb: '1vw'
                }}
              >
                Продвигайте свой бизнес благодаря
                <Typography 
                  component="span" 
                  sx={{
                    display: 'block',
                    fontSize: '2vw',
                    fontWeight: 'bold',
                    mt: '0.5vw'
                  }}
                >
                  большой команде QWERTY TOWN!
                </Typography>
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: 'white',
                  fontSize: '2vw',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  mt: '2vw'
                }}
              >
                Вы делаете - продукт
                <Typography
                  component="span"
                  sx={{
                    display: 'block',
                    fontSize: '2vw',
                    fontWeight: 'bold',
                    mt: '0.5vw'
                  }}
                >
                  Мы делаем - продажи
                </Typography>
              </Typography>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vw',
            width: '100vw',
            position: 'absolute',
            top: '-10vw',
            left: '-12vw'
          }}>
            <img 
              src="/Vector.svg" 
              alt="NEXTIX Logo" 
              style={{ 
                maxWidth: '60vw', 
                maxHeight: '60vw',
                opacity: 0.7
              }} 
            />
          </Box>
        </motion.div>
        
        {/* Правая панель*/}
        <motion.div
          style={{
            width: '20vw',
            backgroundColor: 'white',
            borderRadius: '1vw',
            padding: '1.5vw',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          animate={{ 
            height: location.pathname === '/business' ? '24.5vw' : '38.5vw'
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          layout
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '0.5vw'
          }}>
          </Box>
        </motion.div>
      </Box>
    </Box>
  )
}

export default BusinessPage
