import { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, IconButton } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { motion } from 'framer-motion';

interface NavigationPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBusiness: any | null;
  favorites: string[];
  toggleFavorite: (businessId: string) => void;
}

function NavigationPanel({ 
  activeTab, 
  setActiveTab, 
  selectedBusiness, 
  favorites, 
  toggleFavorite 
}: NavigationPanelProps) {
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
      animate={{ 
        height: activeTab === "business" ? '22vw' : '6vw'
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Панель с кнопками навигации (всегда видима) */}
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
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab(activeTab === "business" ? "profile" : "business")}
        >
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: activeTab === "business" ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: activeTab === "business" ? '0.8vw' : '0',
            boxShadow: activeTab === "business" ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw'
          }}>
            <BusinessCenterIcon sx={{ 
              fontSize: '1.8vw', 
              color: activeTab === "business" ? '#fff' : 'inherit'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: activeTab === "business" ? '#1d1d1d' : 'inherit'
          }}>Бизнес</Typography>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab(activeTab === "favorites" ? "profile" : "favorites")}
        >
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: activeTab === "favorites" ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: activeTab === "favorites" ? '0.8vw' : '0',
            boxShadow: activeTab === "favorites" ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw'
          }}>
            <FavoriteIcon sx={{ 
              fontSize: '1.8vw', 
              color: activeTab === "favorites" ? '#fff' : 'inherit'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: activeTab === "favorites" ? '#1d1d1d' : 'inherit',
          }}>Избранное</Typography>
        </Box>
        
        {/* Кнопка лайка по центру - показывается только когда выбрана локация */}
        {(activeTab === "locations" || activeTab === "favorites") && selectedBusiness && (
          <Box 
            sx={{ 
              position: 'absolute',
              left: '49vw',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2
            }}
          >
            <IconButton 
              onClick={() => toggleFavorite(selectedBusiness.id)}
              sx={{ 
                color: favorites.includes(selectedBusiness.id) ? 'red' : '#1d1d1d',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                padding: '0.8vw',
                '&:hover': { 
                  backgroundColor: '#fff',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {favorites.includes(selectedBusiness.id) ? 
                <FavoriteIcon sx={{ fontSize: '2vw' }} /> : 
                <FavoriteBorderIcon sx={{ fontSize: '2vw' }} />
              }
            </IconButton>
          </Box>
        )}
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab(activeTab === "settings" ? "profile" : "settings")}
        >
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: activeTab === "settings" ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: activeTab === "settings" ? '0.8vw' : '0',
            boxShadow: activeTab === "settings" ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw'
          }}>
            <SettingsIcon sx={{ 
              fontSize: '1.8vw', 
              color: activeTab === "settings" ? '#fff' : 'inherit'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: activeTab === "settings" ? '#1d1d1d' : 'inherit',
          }}>Настройки</Typography>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab(activeTab === "locations" ? "profile" : "locations")}
        >
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: activeTab === "locations" ? '#1d1d1d' : 'transparent',
            borderRadius: '50%',
            padding: activeTab === "locations" ? '0.8vw' : '0',
            boxShadow: activeTab === "locations" ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            mb: '0.3vw'
          }}>
            <LocationOnIcon sx={{ 
              fontSize: '1.8vw', 
              color: activeTab === "locations" ? '#fff' : 'inherit'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            fontSize: '1vw',
            color: activeTab === "locations" ? '#1d1d1d' : 'inherit'
          }}>Локации</Typography>
        </Box>
      </Box>
    </motion.div>
  );
}

export default NavigationPanel;