import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  CircularProgress, 
  Typography 
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface CreateBusinessFormProps {
  businessName: string;
  setBusinessName: (value: string) => void;
  businessDescription: string;
  setBusinessDescription: (value: string) => void;
  businessHours: string;
  setBusinessHours: (value: string) => void;
  businessCity: string;
  setBusinessCity: (value: string) => void;
  businessPhoto: File | null;
  setBusinessPhoto: (file: File | null) => void;
  isSubmitting: boolean;
  handleCreateBusiness: () => Promise<void>;
}

const CreateBusinessForm: React.FC<CreateBusinessFormProps> = ({
  businessName,
  setBusinessName,
  businessDescription,
  setBusinessDescription,
  businessHours,
  setBusinessHours,
  businessCity,
  setBusinessCity,
  businessPhoto,
  setBusinessPhoto,
  isSubmitting,
  handleCreateBusiness
}) => {
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setBusinessPhoto(event.target.files[0]);
    }
  };

  return (
    <Box sx={{
      padding: '1vw 2vw',
      display: 'flex',
      flexDirection: 'column',
      gap: '1vw',
      overflowY: 'auto',
      height: '16vw',
      '&::-webkit-scrollbar': {
        width: '0.4vw',
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '0.2vw',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '0.2vw',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#555',
      },
    }}>
      <Box sx={{ display: 'flex', gap: '1vw' }}>
        {/* Левая колонка с полями ввода */}
        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.8vw' }}>
          <TextField
            label="Название бизнеса"
            variant="outlined"
            fullWidth
            size="small"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            InputProps={{
              style: { fontSize: '0.9vw' }
            }}
            InputLabelProps={{
              style: { fontSize: '0.9vw' }
            }}
          />
          
          <TextField
            label="Описание"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            size="small"
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            InputProps={{
              style: { fontSize: '0.9vw' }
            }}
            InputLabelProps={{
              style: { fontSize: '0.9vw' }
            }}
          />
          
          <TextField
            label="Часы работы"
            variant="outlined"
            fullWidth
            size="small"
            value={businessHours}
            onChange={(e) => setBusinessHours(e.target.value)}
            placeholder="Пн-Пт: 9:00-18:00, Сб-Вс: выходной"
            InputProps={{
              style: { fontSize: '0.9vw' }
            }}
            InputLabelProps={{
              style: { fontSize: '0.9vw' }
            }}
          />
          
          <TextField
            label="Город"
            variant="outlined"
            fullWidth
            size="small"
            value={businessCity}
            onChange={(e) => setBusinessCity(e.target.value)}
            InputProps={{
              style: { fontSize: '0.9vw' }
            }}
            InputLabelProps={{
              style: { fontSize: '0.9vw' }
            }}
          />
        </Box>
        
        {/* Правая колонка с загрузкой фото и кнопкой создания */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8vw', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            sx={{
              width: '10vw',
              height: '10vw',
              border: '1px dashed #ccc',
              borderRadius: '0.5vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#f9f9f9'
            }}
            component="label"
          >
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
            {businessPhoto ? (
              <Box 
                component="img" 
                src={URL.createObjectURL(businessPhoto)} 
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <>
                <AddPhotoAlternateIcon sx={{ fontSize: '2vw', color: '#999', mb: '0.5vw' }} />
                <Typography sx={{ fontSize: '0.8vw', color: '#999', textAlign: 'center', px: '1vw' }}>
                  Нажмите, чтобы загрузить фото
                </Typography>
              </>
            )}
          </Box>
          
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#1d1d1d',
              color: 'white',
              fontSize: '0.9vw',
              '&:hover': {
                backgroundColor: '#333'
              }
            }}
            onClick={handleCreateBusiness}
            disabled={isSubmitting || !businessName || !businessDescription || !businessCity}
          >
            {isSubmitting ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              'Создать бизнес'
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateBusinessForm;
