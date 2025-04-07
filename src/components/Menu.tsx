import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function Menu() {
  return (
    <Box sx={{display:'flex', gap:"20px", mb: 2}}>
      <Typography sx={{color:'white'}}>Главная</Typography>
      <Typography sx={{color:'white'}}>Места</Typography>
      <Typography sx={{color:'white'}}>Контакты</Typography>
      <Typography sx={{color:'white'}}>О нас</Typography>
    </Box>
  );
}

export default Menu;