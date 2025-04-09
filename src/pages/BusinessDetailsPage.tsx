import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  Box, 
  Typography, 
  Avatar, 
  CircularProgress, 
  Button, 
  Grid, 
  Paper, 
  IconButton 
} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

interface Business {
  id: string;
  name: string;
  type?: string;
  photoURL?: string;
  rating?: number;
  city?: string;
  description?: string;
  phone?: string;
  address?: string;
  schedule?: Record<string, string>;
}

function BusinessDetailsPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        if (!businessId) return;
        
        const docRef = doc(db, "businesses", businessId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBusiness({
            id: docSnap.id,
            ...docSnap.data()
          } as Business);
        } else {
          console.log("Бизнес не найден");
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [businessId]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!business) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: 2
      }}>
        <Typography variant="h4">Бизнес не найден</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
        >
          Вернуться назад
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f5f5f5',
      p: 4
    }}>
      <IconButton 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        <ArrowBackIosNewRoundedIcon />
        <Typography variant="body1">Назад</Typography>
      </IconButton>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Grid container spacing={4}>
          {/* Левая колонка - Основная информация */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Avatar 
                src={business.photoURL} 
                sx={{ 
                  width: 200, 
                  height: 200, 
                  borderRadius: 4,
                  alignSelf: 'center'
                }}
              />
              
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {business.name}
              </Typography>
              
              <Typography variant="h5" color="text.secondary">
                {business.city}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {business.description || 'Описание отсутствует'}
              </Typography>
            </Box>
          </Grid>

          {/* Правая колонка - Контактная информация */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              bgcolor: '#fafafa',
              p: 3,
              borderRadius: 4
            }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Контактная информация
              </Typography>

              {business.phone && (
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Телефон
                  </Typography>
                  <Typography variant="h6">
                    {business.phone}
                  </Typography>
                </Box>
              )}

              {business.address && (
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Адрес
                  </Typography>
                  <Typography variant="h6">
                    {business.address}
                  </Typography>
                </Box>
              )}

              {business.schedule && (
                <Box>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                    График работы
                  </Typography>
                  {Object.entries(business.schedule).map(([day, time]) => (
                    <Box 
                      key={day}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        mb: 1
                      }}
                    >
                      <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                        {day}:
                      </Typography>
                      <Typography variant="body1">
                        {time || 'выходной'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default BusinessDetailsPage; 