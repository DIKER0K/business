import { Box, Typography, Grid, CircularProgress, Avatar } from '@mui/material';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import { useNavigate } from 'react-router-dom';

interface Business {
  id: string;
  name: string;
  type?: string;
  photoURL?: string;
  rating?: number;
  city?: string;
  // другие поля бизнеса
}

interface RecommendedBusinessesProps {
  businesses: Business[];
  loadingBusinesses: boolean;
  currentLocation: string;
}

const RecommendedBusinesses = ({ 
  businesses, 
  loadingBusinesses,
  currentLocation 
}: RecommendedBusinessesProps) => {
  
  // Вспомогательная функция для капитализации
  const capitalizeEachWord = (str: string) => {
    if (!str) return '';
    return str.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const navigate = useNavigate();
  return (
    <Box sx={{ 
      flex: 1,
      bgcolor: 'white',
      borderRadius: '1vw',
      overflow: 'hidden',
      p: '1vw',
      background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(background_1.png) no-repeat center center',
      backgroundSize: 'cover',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        p: '2vw'
      }}>
        <Typography variant="h6" sx={{color: 'white', fontSize: '2vw'}}>
          Возможно, вам понравится:
        </Typography>
      </Box>
      <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'space-around', mt: '-2vw'}}>
        {loadingBusinesses ? (
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        ) : businesses.map((business) => (
          <Grid item xs={12} md={6} lg={3} key={business.id}>
            <Box sx={{
              bgcolor: 'white',
              borderRadius: '1vw',
              overflow: 'hidden',
              alignItems: 'center',
              display: 'flex',
              background: 'transparent',
              p: '3vw',
              gap: '1vw',
              position: 'relative',
            }}
            onClick={() => {
              if (business.type === 'Кафе')  {
                navigate(`/business/${business.id}/restaurant_menu`);
              } else if (business.type === 'Парикмахерская') {
                  navigate(`/business/${business.id}/barber_services`);
                }
              }}
            >
              <Avatar sx={{width: '7vw', height: '7vw', zIndex: 2}} src={business?.photoURL} />
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5vw',
                alignItems: 'left',
                zIndex: 2
              }}>
                <Typography variant="h6" sx={{
                  fontSize: '2vw',
                  color: 'white'
                }}>
                  {capitalizeEachWord(business.name)}
                </Typography>
                <Typography variant="body2" sx={{
                  fontSize: '1.5vw',
                  color: 'white'
                }}>
                  {capitalizeEachWord(business.type) || 'Не указано'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    index < Math.round(business.rating || 0) ? (
                      <StarRateRoundedIcon key={index} sx={{ color: '#ffc107', fontSize: '1.2rem' }} />
                    ) : (
                      <StarOutlineRoundedIcon key={index} sx={{ color: '#ddd', fontSize: '1.2rem' }} />
                    )
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RecommendedBusinesses; 