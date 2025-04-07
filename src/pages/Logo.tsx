import { useState } from 'react'
import './logo.css'
import { Box, Typography } from '@mui/material'
import './styles/fonts/akony-bold.otf'


function Logo() {
  return (
    <>
    <Box className='Parent-All' sx={{display: 'flex', flexDirection: 'column', gap: '1vw', alignItems: 'center'}}>
    <Typography sx={{
          display: 'flex',
          position: 'absolute',
          fontSize: '6.4vw',
          left: '21vw',
          color: 'white',
          top: '2vw',
        }}>
          QWERTY</Typography>
          <Typography sx={{
            display: 'flex',
            position: 'absolute',
            fontSize: '7vw',
            left: '28vw',
            color: 'white',
            top: '8.7vw',
          }}>
          TOWN</Typography>
      <Box className='Parent-Top' sx={{display: 'flex', gap: '1vw'}}>
        <Box sx={{
            width: '20vw',
            height: '13vw',
            borderRadius: '0.5vw',
            bgcolor: '#212121',
          }}>
            
        </Box>
        <Box sx={{
            width: '10vw',
            height: '13vw',
            borderRadius: '0.5vw',
            bgcolor: '#212121',
          }}>
            
        </Box>
      </Box>
      <Box className='Parent-Bot' sx={{display: 'flex'}}>
        <Box sx={{
            width: '31vw',
            height: '5vw',
            borderRadius: '0.5vw',
            bgcolor: '#212121',
            position: 'relative',
          }}>
        </Box>    
      </Box>
    </Box>
    </>
  )
}

export default Logo