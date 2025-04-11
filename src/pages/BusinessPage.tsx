import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase/config';
import { Avatar, Typography, Grid, CircularProgress } from '@mui/material';
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from 'framer-motion';
import { db } from '../firebase/config';

function BusinessPage() {
  const location = useLocation();
  const auth = getAuth(app);
  const [userBusinesses, setUserBusinesses] = useState<any[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(
            collection(db, "businesses"),
            where("ownerId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const businesses = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setUserBusinesses(businesses);
        } catch (error) {
          console.error("Error loading businesses:", error);
        } finally {
          setLoadingBusinesses(false);
        }
      } else {
        setLoadingBusinesses(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '41vw',
      bgcolor: '#1d1d1d',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        p: '1vw',
        gap: '1vw',
        overflow: 'hidden'
      }}>
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
        
        <motion.div
          style={{
            width: '20vw',
            backgroundColor: 'white',
            borderRadius: '1vw',
            padding: '1.5vw',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
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
            <Typography variant="h6" sx={{
              fontSize: '1.5vw',
              fontWeight: 'bold',
              mb: '1vw'
            }}>
              Ваши бизнесы
            </Typography>
            
            {loadingBusinesses ? (
              <CircularProgress />
            ) : userBusinesses.length > 0 ? (
              <Grid container spacing={2}>
                {userBusinesses.map((business) => (
                  <Grid item xs={12} key={business.id}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1vw',
                      p: '1vw',
                      borderRadius: '0.5vw',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}>
                      <Avatar 
                        src={business.photoURL} 
                        sx={{ width: '3vw', height: '3vw' }}
                      />
                      <Box>
                        <Typography sx={{ fontSize: '1.2vw', fontWeight: 500 }}>
                          {business.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.9vw', color: '#666' }}>
                          {business.type}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography sx={{ fontSize: '1vw', color: '#666' }}>
                У вас пока нет бизнесов
              </Typography>
            )}
          </Box>
        </motion.div>
      </Box>
    </Box>
  )
}

export default BusinessPage
