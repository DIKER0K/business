import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { Typography } from "@mui/material"
import "./styles/StartPage.css"
import "./styles/fonts/SF-Pro-Display-Medium.otf"
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const DarkModeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
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
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        
        return () => unsubscribe();
    }, [auth]);
    
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
                        borderRadius: '999px',
                        padding: '10px 16px',
                        fontWeight: 500,
                        fontSize: '16px',
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
                        borderRadius: '999px',
                        padding: '10px 16px',
                        fontWeight: 500,
                        fontSize: '16px',
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
        {/* <Box sx={{
            display: 'flex', 
            alignItems: 'center', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            marginTop: '-28vw',
            gap: '16px',
            width: '300px'
        }}>            
            <Typography variant="h6" sx={{color: 'white', mt: 4, mb: 2}}>
                Создание бизнеса
            </Typography>
            
            <TextField 
                id="name" 
                label="Название" 
                variant="standard" 
                fullWidth
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                InputLabelProps={{
                    style: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                InputProps={{
                    style: { color: 'white' },
                    sx: {
                        '&:before': { borderBottomColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover:not(.Mui-disabled):before': { borderBottomColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused:after': { borderBottomColor: 'primary.main' }
                    }
                }}
            />
            
            <TextField 
                id="description" 
                label="Описание" 
                variant="standard" 
                fullWidth
                multiline
                rows={3}
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                InputLabelProps={{
                    style: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                InputProps={{
                    style: { color: 'white' },
                    sx: {
                        '&:before': { borderBottomColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover:not(.Mui-disabled):before': { borderBottomColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused:after': { borderBottomColor: 'primary.main' }
                    }
                }}
            />
            
            <TextField 
                id="hours" 
                label="Часы работы" 
                variant="standard" 
                fullWidth
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="Пн-Пт: 9:00-21:00, Сб-Вс: 10:00-22:00"
                InputLabelProps={{
                    style: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                InputProps={{
                    style: { color: 'white' },
                    sx: {
                        '&:before': { borderBottomColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover:not(.Mui-disabled):before': { borderBottomColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused:after': { borderBottomColor: 'primary.main' }
                    }
                }}
            />
            
            <TextField 
                id="city" 
                label="Город" 
                variant="standard" 
                fullWidth
                value={businessCity}
                onChange={(e) => setBusinessCity(e.target.value)}
                InputLabelProps={{
                    style: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                InputProps={{
                    style: { color: 'white' },
                    sx: {
                        '&:before': { borderBottomColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover:not(.Mui-disabled):before': { borderBottomColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused:after': { borderBottomColor: 'primary.main' }
                    }
                }}
            />
            
            <Button
                variant="contained"
                component="label"
                sx={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: '999px',
                    padding: '10px 16px',
                    fontWeight: 500,
                    fontSize: '16px',
                    boxShadow: 'none',
                    mt: 2
                }}
            >
                {businessPhoto ? 'Фото выбрано' : 'Добавить фото'}
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </Button>
            
            {businessError && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {businessError}
                </Typography>
            )}
            
            {businessSuccess && (
                <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
                    Бизнес успешно создан!
                </Typography>
            )}
            
            <Button 
                variant="contained" 
                onClick={handleCreateBusiness}
                disabled={businessLoading || !user}
                sx={{
                    backgroundColor: '#646cff',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: '999px',
                    padding: '10px 16px',
                    fontWeight: 500,
                    fontSize: '16px',
                    '&:hover': {
                        backgroundColor: '#535bf2',
                        boxShadow: 'none'
                    },
                    boxShadow: 'none',
                    mt: 2
                }}
            >
                {businessLoading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    'Создать бизнес'
                )}
            </Button>
        </Box> */}
        <Box sx={{marginTop: '-28vw'}}>
            <Box sx={{ mt: 4, width: '100%', maxWidth: '1200px', px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
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
                        borderRadius: '999px',
                        padding: '10px 16px',
                        fontWeight: 500,
                        marginBottom: '10px',
                        fontSize: '16px',
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
                            borderRadius: '12px',
                            maxHeight: '300px'
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
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                        {businesses.map((business) => (
                            <Box key={business.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 24px)' }, maxWidth: '500px' }}>
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
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                        zIndex: 1
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
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
                                                mb: 2
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
                                            my: 2
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
                                            mt: 'auto'
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
                                                        backgroundColor: 'rgba(255,255,255,0.1)',
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
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ 
                        bgcolor: 'rgba(0,0,0,0.3)', 
                        p: 4, 
                        borderRadius: 2,
                        textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.1)'
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
            <Button variant="contained" color="primary" sx={{borderRadius: '999px', padding: '10px 16px', fontWeight: 500, fontSize: '16px', backgroundColor: '#FFFFFF', boxShadow: 'none', color: 'black'}}>
                Смотреть еще
            </Button>
        </Box>
        <Dialog 
            open={openAuthModal} 
            onClose={handleCloseAuthModal}
            PaperProps={{
                style: {
                    backgroundColor: '#212121',
                    color: 'white',
                    borderRadius: '12px'
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
                <Box sx={{ pt: 2, minWidth: '300px' }}>
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