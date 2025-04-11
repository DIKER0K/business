import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { Paper, Typography } from "@mui/material"
import "./styles/StartPage.css"
import "./styles/fonts/SF-Pro-Display-Medium.otf"
import "./styles/fonts/benzin-bold.otf"
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import TelegramIcon from '@mui/icons-material/Telegram';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase/config';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { getFirestore, doc, setDoc, collection, addDoc, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import BusinessCard from '../components/BusinessCard';
import { useNavigate } from 'react-router-dom';

const DarkModeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(0.3vw)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(1.1vw)',
      '& .MuiSwitch-thumb': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#535353' : '#535353',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#535353' : '#2F2F2F',
    width: 32,
    height: 32,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
      '#fff',
    )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#535353' : '#2F2F2F',
    borderRadius: 20 / 2,
  },
}));

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

function StartPage() {
    const [location, setLocation] = useState<string>("Калининград");
    const [loading, setLoading] = useState<boolean>(false);
    const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [authError, setAuthError] = useState<string>("");
    const [authTab, setAuthTab] = useState<number>(0);
    const [authLoading, setAuthLoading] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    
    const [businessName, setBusinessName] = useState<string>("");
    const [businessDescription, setBusinessDescription] = useState<string>("");
    const [businessHours, setBusinessHours] = useState<string>("");
    const [businessCity, setBusinessCity] = useState<string>(location);
    const [businessPhoto, setBusinessPhoto] = useState<File | null>(null);
    const [businessLoading, setBusinessLoading] = useState<boolean>(false);
    const [businessError, setBusinessError] = useState<string>("");
    const [businessSuccess, setBusinessSuccess] = useState<boolean>(false);
    
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loadingBusinesses, setLoadingBusinesses] = useState<boolean>(false);
    
    const [cityMenuAnchorEl, setCityMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [loadingCities, setLoadingCities] = useState<boolean>(false);
    
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    const navigate = useNavigate();
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                navigate('/app');
            }
        });
        
        return () => unsubscribe();
    }, [auth, navigate]);
    
    useEffect(() => {
        setBusinessCity(location);
    }, [location]);
    
    const getLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=ru`
                        );
                        const data = await response.json();
                        const city = data.address.city || 
                                    data.address.town || 
                                    data.address.village || 
                                    "Калининград";
                        setLocation(city);
                    } catch (error) {
                        console.error("Ошибка при определении местоположения:", error);
                        setLocation("Калининград");
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error("Ошибка геолокации:", error);
                    setLocation("Калининград");
                    setLoading(false);
                }
            );
        } else {
            setLocation("Калининград");
            setLoading(false);
        }
    };

    const handleOpenAuthModal = () => {
        setOpenAuthModal(true);
        setAuthError("");
    };
    
    const handleCloseAuthModal = () => {
        setOpenAuthModal(false);
        setEmail("");
        setPassword("");
        setAuthError("");
    };
    
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setAuthTab(newValue);
        setAuthError("");
    };
    
    const handleRegister = async () => {
        if (!email || !password) {
            setAuthError("Пожалуйста, заполните все поля");
            return;
        }
        
        setAuthLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date(),
                lastLogin: new Date(),
                displayName: user.displayName || null,
                photoURL: user.photoURL || null,
                location: location
            });
            
            handleCloseAuthModal();
        } catch (error: any) {
            console.error("Ошибка регистрации:", error);
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setAuthError("Этот email уже используется");
                    break;
                case 'auth/invalid-email':
                    setAuthError("Некорректный email");
                    break;
                case 'auth/weak-password':
                    setAuthError("Слишком слабый пароль");
                    break;
                default:
                    setAuthError("Ошибка при регистрации");
            }
        } finally {
            setAuthLoading(false);
        }
    };
    
    const handleLogin = async () => {
        if (!email || !password) {
            setAuthError("Пожалуйста, заполните все поля");
            return;
        }
        
        setAuthLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await setDoc(doc(db, "users", user.uid), {
                lastLogin: new Date()
            }, { merge: true });
            
            handleCloseAuthModal();
        } catch (error: any) {
            console.error("Ошибка входа:", error);
            switch (error.code) {
                case 'auth/invalid-email':
                    setAuthError("Некорректный email");
                    break;
                case 'auth/user-disabled':
                    setAuthError("Аккаунт отключен");
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    setAuthError("Неверный email или пароль");
                    break;
                default:
                    setAuthError("Ошибка при входе");
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setBusinessPhoto(event.target.files[0]);
        }
    };
    
    const handleCreateBusiness = async () => {
        if (!user) {
            setBusinessError("Для создания бизнеса необходимо авторизоваться");
            return;
        }
        
        if (!businessName || !businessDescription || !businessHours || !businessCity) {
            setBusinessError("Пожалуйста, заполните все обязательные поля");
            return;
        }
        
        setBusinessLoading(true);
        setBusinessError("");
        
        try {
            let photoURL = null;
            
            if (businessPhoto) {
                const storageRef = ref(storage, `business_photos/${user.uid}_${Date.now()}_${businessPhoto.name}`);
                const snapshot = await uploadBytes(storageRef, businessPhoto);
                photoURL = await getDownloadURL(snapshot.ref);
            }
            
            const businessData = {
                name: businessName,
                description: businessDescription,
                hours: businessHours,
                city: businessCity,
                photoURL: photoURL,
                ownerId: user.uid,
                ownerEmail: user.email,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const docRef = await addDoc(collection(db, "businesses"), businessData);
            
            setBusinessName("");
            setBusinessDescription("");
            setBusinessHours("");
            setBusinessCity(location);
            setBusinessPhoto(null);
            setBusinessSuccess(true);
            
            setTimeout(() => {
                setBusinessSuccess(false);
            }, 3000);
            
        } catch (error) {
            console.error("Ошибка при создании бизнеса:", error);
            setBusinessError("Произошла ошибка при создании бизнеса. Пожалуйста, попробуйте снова.");
        } finally {
            setBusinessLoading(false);
        }
    };

    const fetchBusinesses = async () => {
        setLoadingBusinesses(true);
        try {
            const businessesQuery = query(
                collection(db, "businesses"),
                where("city", "==", location),
                limit(6)
            );
            
            const querySnapshot = await getDocs(businessesQuery);
            const businessesList: Business[] = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                businessesList.push({
                    id: doc.id,
                    name: data.name,
                    description: data.description,
                    hours: data.hours,
                    city: data.city,
                    photoURL: data.photoURL,
                    ownerId: data.ownerId,
                    ownerEmail: data.ownerEmail,
                    createdAt: data.createdAt.toDate(),
                    updatedAt: data.updatedAt.toDate()
                });
            });
            
            setBusinesses(businessesList);
        } catch (error) {
            console.error("Ошибка при загрузке бизнесов:", error);
        } finally {
            setLoadingBusinesses(false);
        }
    };
    
    useEffect(() => {
        fetchBusinesses();
    }, [location]);
    
    useEffect(() => {
        if (businessSuccess) {
            fetchBusinesses();
        }
    }, [businessSuccess]);

    const fetchAvailableCities = async () => {
        setLoadingCities(true);
        try {
            const querySnapshot = await getDocs(collection(db, "businesses"));
            
            const citiesSet = new Set<string>();
            
            citiesSet.add(location);
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.city) {
                    citiesSet.add(data.city);
                }
            });
            
            const citiesArray = Array.from(citiesSet).sort();
            
            setAvailableCities(citiesArray);
        } catch (error) {
            console.error("Ошибка при загрузке городов:", error);
        } finally {
            setLoadingCities(false);
        }
    };
    
    useEffect(() => {
        fetchAvailableCities();
    }, []);
    
    useEffect(() => {
        if (businessSuccess) {
            fetchAvailableCities();
        }
    }, [businessSuccess]);

    const openCityMenu = Boolean(cityMenuAnchorEl);
    
    const handleOpenCityMenu = (event: React.MouseEvent<HTMLElement>) => {
        setCityMenuAnchorEl(event.currentTarget);
        fetchAvailableCities();
    };
    
    const handleCloseCityMenu = () => {
        setCityMenuAnchorEl(null);
    };
    
    const handleSelectCity = (city: string) => {
        setLocation(city);
        handleCloseCityMenu();
    };

    return(
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: '2vw'}}>
        <Box sx={{display:'flex', alignItems:'center', justifyContent: "center", gap: '5vw'}}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <DarkModeSwitch />
                <IconButton aria-label="delete">
                    <RemoveRedEyeRoundedIcon sx={{color:'white'}} />
                </IconButton>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Typography sx={{color:'white'}}>{loading ? 'Определение...' : location}</Typography>
                <IconButton onClick={getLocation} disabled={loading}>
                    {loading ? 
                        <CircularProgress size={24} sx={{color:'white'}} /> : 
                        <PlaceRoundedIcon sx={{color:'white'}}/>
                    }
                </IconButton>
            </Box>
            <Box sx={{display:'flex', alignItems:'center'}}>
                <Typography sx={{color: 'white'}}>Язык</Typography>
                <IconButton>
                    <ArrowDropDownOutlinedIcon sx={{color: 'white'}} />
                </IconButton>
                <Avatar sx={{width: '1.8vw', height: '1.8vw'}} src="/broken-image.jpg" />
            </Box>
            
            {!user ? (
                <Button
                    variant="contained"
                    startIcon={<TelegramIcon />}
                    onClick={handleOpenAuthModal}
                    sx={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        textTransform: 'none',
                        borderRadius: '0.6vw',
                        padding: '0.6vw 1.1vw',
                        fontWeight: 500,
                        fontSize: '1.1vw',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            boxShadow: 'none'
                        },
                        boxShadow: 'none'
                    }}
                >
                    Войти с помощью Telegram
                </Button>
            ) : (
                <Button
                    variant="contained"
                    onClick={() => auth.signOut()}
                    sx={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        textTransform: 'none',
                        borderRadius: '0.6vw',
                        padding: '0.6vw 1.1vw',
                        fontWeight: 500,
                        fontSize: '1.1vw',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            boxShadow: 'none'
                        },
                        boxShadow: 'none'
                    }}
                >
                    Выйти
                </Button>
            )}
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-28vw'}}>
            <img className='logo' src="logo.svg" alt="logo" />
        </Box>
        
        <Box sx={{marginTop: '-28vw'}}>
            <Box sx={{ mt: 4, width: '100%', maxWidth: '62.5vw', px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
                <Typography variant="h5" sx={{ color: 'white', mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    В {location}е
                </Typography>
                <Button
                    variant="contained"
                    endIcon={<ArrowDropDownOutlinedIcon />}
                    onClick={handleOpenCityMenu}
                    sx={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textTransform: 'none',
                        borderRadius: '0.6vw',
                        padding: '0.6vw 1.1vw',
                        fontWeight: 500,
                        marginBottom: '1.1vw',
                        fontSize: '1.1vw',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            boxShadow: 'none'
                        },
                        boxShadow: 'none'
                    }}
                >
                    {loadingCities ? 'Загрузка городов...' : 'Выбрать другой город'}
                </Button>
                
                <Menu
                    anchorEl={cityMenuAnchorEl}
                    open={openCityMenu}
                    onClose={handleCloseCityMenu}
                    PaperProps={{
                        style: {
                            backgroundColor: '#212121',
                            color: 'white',
                            borderRadius: '0.6vw',
                            maxHeight: '15.6vw'
                        }
                    }}
                >
                    {loadingCities ? (
                        <MenuItem disabled>
                            <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                            Загрузка городов...
                        </MenuItem>
                    ) : availableCities.length > 0 ? (
                        availableCities.map((city) => (
                            <MenuItem 
                                key={city} 
                                onClick={() => handleSelectCity(city)}
                                selected={city === location}
                                sx={{ 
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.1)'
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: 'rgba(100,108,255,0.2)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(100,108,255,0.3)'
                                        }
                                    }
                                }}
                            >
                                {city}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Нет доступных городов
                        </MenuItem>
                    )}
                </Menu>
                
                {loadingBusinesses ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress sx={{ color: 'white' }} />
                    </Box>
                ) : businesses.length > 0 ? (
                    <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: { xs: 2, sm: 3 },
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: '72.9vw',
                        mx: 'auto'
                    }}>
                        {businesses.map((business) => (
                            <BusinessCard key={business.id} business={business} />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ 
                        bgcolor: 'rgba(0,0,0,0.3)', 
                        p: 4, 
                        borderRadius: '0.6vw',
                        textAlign: 'center',
                        border: '0.1vw solid rgba(255,255,255,0.1)'
                    }}>
                        <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                            В городе {location} пока нет бизнесов
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Станьте первым, кто добавит свой бизнес!
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4}}>
            <Button variant="contained" color="primary" sx={{
                borderRadius: '0.6vw', 
                padding: '0.6vw 1.1vw', 
                fontWeight: 800, 
                fontSize: '1.2vw', 
                backgroundColor: '#FFFFFF', 
                boxShadow: 'none', 
                color: 'black',
                textTransform: 'none'
            }}>
                Смотреть еще
            </Button>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: '10vw'}}>
            <Typography variant="h1" sx={{color: 'rgba(255, 255, 255, 1)', fontWeight: 800, fontSize: '3vw', fontFamily: 'benzin-bold !important'}}>
                НАША МИССИЯ
            </Typography>
            <img src={'old_logo.svg'} alt="old_logo" style={{width: '130vw', height: '130vw', marginTop: '-24vw', marginRight: '1vw'}} />
        </Box>

        <Box sx={{
            width: '100%',
            backgroundColor: '#2a2a2a',
            mt: '-10vw',
            pt: '2vw',
            pb: '2vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '95%',
                px: '2vw'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1vw'
                }}>
                    <Typography variant="h2" sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 700,
                        fontSize: '1.5vw',
                        
                    }}>
                        Связь с нами
                    </Typography>
                    
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5vw'
                    }}>
                        <Box sx={{
                            bgcolor: 'rgba(100, 108, 255, 0.2)',
                            borderRadius: '50%',
                            width: '2vw',
                            height: '2vw',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <TelegramIcon sx={{ fontSize: '1.2vw', color: 'white' }} />
                        </Box>
                        <Typography variant="h3" sx={{
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '1vw'
                        }}>
                            info@qwerty.town
                        </Typography>
                    </Box>
                    
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5vw'
                    }}>
                        <Box sx={{
                            bgcolor: 'rgba(100, 108, 255, 0.2)',
                            borderRadius: '50%',
                            width: '2vw',
                            height: '2vw',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" fill="white" viewBox="0 0 24 24">
                                <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"/>
                                <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a1 1 0 0 0-.086-1.391l-4.064-3.696z"/>
                            </svg>
                        </Box>
                        <Typography variant="h3" sx={{
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '1vw'
                        }}>
                            +7 (900) 345-49-99
                        </Typography>
                    </Box>
                </Box>
                
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1vw',
                }}>
                    <Typography variant="h2" sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 700,
                        fontSize: '1.5vw',
                    }}>
                        Найти нас
                    </Typography>
                    
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5vw'
                    }}>
                        <Box sx={{
                            bgcolor: 'rgba(100, 108, 255, 0.2)',
                            borderRadius: '50%',
                            width: '2vw',
                            height: '2vw',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <PlaceRoundedIcon sx={{ fontSize: '1.2vw', color: 'white' }} />
                        </Box>
                        <Typography variant="h3" sx={{
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '1vw'
                        }}>
                            г. Калининград, Литовский вал, д.38
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>

        <Dialog 
            open={openAuthModal} 
            onClose={handleCloseAuthModal}
            PaperProps={{
                style: {
                    backgroundColor: '#212121',
                    color: 'white',
                    borderRadius: '0.6vw'
                }
            }}
        >
            <DialogTitle>
                <Tabs 
                    value={authTab} 
                    onChange={handleTabChange} 
                    centered
                    textColor="inherit"
                    indicatorColor="primary"
                    sx={{ 
                        '& .MuiTab-root': { 
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-selected': { 
                                color: 'white' 
                            }
                        } 
                    }}
                >
                    <Tab label="Вход" />
                    <Tab label="Регистрация" />
                </Tabs>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, minWidth: '15.6vw' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputLabelProps={{
                            style: { color: 'rgba(255, 255, 255, 0.7)' }
                        }}
                        InputProps={{
                            style: { color: 'white' },
                            sx: {
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main'
                                }
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Пароль"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputLabelProps={{
                            style: { color: 'rgba(255, 255, 255, 0.7)' }
                        }}
                        InputProps={{
                            style: { color: 'white' },
                            sx: {
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main'
                                }
                            }
                        }}
                    />
                    {authError && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {authError}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button 
                    onClick={handleCloseAuthModal}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                    Отмена
                </Button>
                <Button 
                    onClick={authTab === 0 ? handleLogin : handleRegister}
                    variant="contained" 
                    disabled={authLoading}
                    sx={{
                        bgcolor: '#646cff',
                        '&:hover': {
                            bgcolor: '#535bf2'
                        }
                    }}
                >
                    {authLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        authTab === 0 ? "Войти" : "Зарегистрироваться"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
    )
}

export default StartPage