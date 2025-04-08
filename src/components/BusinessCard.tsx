import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface Business {
    id: string;
    name: string;
    description: string;
    hours: string;
    city: string;
    photoURL: string | null;
    ownerId: string;
    ownerEmail: string;
    createdAt: Date;
    updatedAt: Date;
}

interface BusinessCardProps {
    business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
    return (
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 24px)' }, maxWidth: '500px' }}>
            <Card sx={{ 
                bgcolor: 'rgba(0, 0, 0, 0.7)', 
                color: 'white',
                height: '350px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                backgroundImage: business.photoURL ? `url(${business.photoURL})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1,
                    transition: 'background-color 0.3s ease'
                },
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                    '&:before': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)'
                    }
                }
            }}>
                <CardContent sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 3,
                    position: 'relative',
                    zIndex: 2,
                    height: '100%'
                }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography 
                            variant="h5" 
                            component="div"
                            sx={{ 
                                color: 'white',
                                fontWeight: 'bold',
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                textTransform: 'uppercase',
                                mb: 1
                            }}
                        >
                            {business.name}
                        </Typography>
                        
                        <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            '.MuiCard-root:hover &': {
                                opacity: 1
                            }
                        }}>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'white' }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                                {business.hours}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        overflow: 'auto',
                        my: 2,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '.MuiCard-root:hover &': {
                            opacity: 1
                        }
                    }}>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: 'rgba(255,255,255,0.9)',
                                lineHeight: 1.6,
                                textAlign: 'center',
                                maxHeight: '150px',
                                overflow: 'auto',
                                scrollbarWidth: 'thin',
                                '&::-webkit-scrollbar': {
                                    width: '4px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: 'rgba(255,255,255,0.1)',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: 'rgba(255,255,255,0.3)',
                                    borderRadius: '2px',
                                }
                            }}
                        >
                            {business.description}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 'auto',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '.MuiCard-root:hover &': {
                            opacity: 1
                        }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {business.city}
                            </Typography>
                        </Box>
                        
                        <Button 
                            variant="text" 
                            size="small"
                            sx={{ 
                                color: 'black',
                                backgroundColor: '#FFFFFF',
                                textTransform: 'none',
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.3)',
                                padding: '4px 12px',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    borderColor: 'rgba(255,255,255,0.5)'
                                }
                            }}
                        >
                            Ознакомиться
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default BusinessCard; 