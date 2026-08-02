// Deployment Version: 2026-04-16-PROD
import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Sprout, 
  Calculator, 
  BookOpen, 
  Camera, 
  MessageSquare, 
  Info, 
  Mic, 
  Globe,
  CloudSun,
  ChevronRight,
  Play,
  Quote,
  Phone,
  HelpCircle,
  FileText,
  Award,
  Settings,
  X,
  RefreshCcw,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  ExternalLink,
  Leaf,
  FlaskConical,
  Droplets,
  LineChart as LineChartIcon,
  History,
  Plus,
  TrendingUp,
  Share2,
  ImagePlus,
  ShieldCheck,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Screen, Crop } from './types';
import { COLORS, CROPS, ATTRIBUTION, CROP_GUIDES, YOUTUBE_VIDEOS } from './constants';
import { GoogleGenAI, Type } from "@google/genai";
import Logo from './components/Logo';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
// --- Safe Speech Synthesis Helpers ---

const getSafeSpeechSynthesis = () => {
  if (typeof window === 'undefined') return null;
  return window?.speechSynthesis || null;
};

const safeCancelSpeech = () => {
  try {
    const speech = getSafeSpeechSynthesis();
    if (speech && typeof speech.cancel === 'function') {
      speech.cancel();
    }
  } catch (err) {
    console.warn("Speech synthesis cancel failed:", err);
  }
};

const safeGetVoices = (): SpeechSynthesisVoice[] => {
  try {
    const speech = getSafeSpeechSynthesis();
    if (speech && typeof speech.getVoices === 'function') {
      return speech.getVoices() || [];
    }
  } catch (err) {
    console.warn("Speech synthesis getVoices failed:", err);
  }
  return [];
};

const safeSpeak = (utterance: SpeechSynthesisUtterance) => {
  try {
    const speech = getSafeSpeechSynthesis();

    console.log("Speech object:", speech);

    if (speech && typeof speech.speak === 'function') {
      console.log("Calling speech.speak()");
      speech.speak(utterance);
    } else {
      console.log("speech.speak not available");
    }
  } catch (err) {
    console.warn("Speech synthesis speak failed:", err);
  }
};

// --- Utils ---

const cleanTextForSpeech = (text: string, isHindi: boolean) => {
  if (!text) return "";
  let cleaned = text;
  
  // Replace hyphens between numbers with "to" or "से"
  cleaned = cleaned.replace(/(\d+)-(\d+)/g, isHindi ? "$1 से $2" : "$1 to $2");
  
  // Replace common abbreviations
  cleaned = cleaned.replace(/FYM/g, isHindi ? "गोबर की खाद" : "Farm Yard Manure");
  
  // Replace units and symbols that confuse TTS
  if (isHindi) {
    cleaned = cleaned.replace(/\//g, " प्रति ");
    cleaned = cleaned.replace(/%/g, " प्रतिशत ");
    cleaned = cleaned.replace(/kg/gi, " किलोग्राम ");
    cleaned = cleaned.replace(/gm/gi, " ग्राम ");
    cleaned = cleaned.replace(/cm/gi, " सेंटीमीटर ");
    cleaned = cleaned.replace(/mm/gi, " मिलीमीटर ");
    cleaned = cleaned.replace(/ml/gi, " मिलीलीटर ");
    cleaned = cleaned.replace(/ltr/gi, " लीटर ");
    cleaned = cleaned.replace(/sq\.?ft/gi, " वर्ग फुट ");
    cleaned = cleaned.replace(/acre/gi, " एकड़ ");
    // Replace Danda with period for better TTS compatibility
    cleaned = cleaned.replace(/।/g, ". ");
  } else {
    cleaned = cleaned.replace(/\//g, " per ");
    cleaned = cleaned.replace(/%/g, " percent ");
  }

  // Replace parentheses with commas for natural pauses
  cleaned = cleaned.replace(/\(/g, ", ").replace(/\)/g, ", ");
  
  // Replace multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ');

  return cleaned.trim();
};

// --- Components ---

const Header = ({ 
  isHindi, 
  setIsHindi, 
  currentScreen, 
  onBack,
  onSpeak
}: { 
  isHindi: boolean; 
  setIsHindi: (v: boolean) => void; 
  currentScreen: Screen;
  onBack: () => void;
  onSpeak: () => void;
}) => {
  return (
    <header className="bg-organic-green text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentScreen !== Screen.DASHBOARD && (
            <button onClick={onBack} className="p-1">
              <ChevronRight className="rotate-180" />
            </button>
          )}
          <Logo 
            size={36} 
            showText={true} 
            isHindi={isHindi} 
            variant="light" 
          />
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsHindi(!isHindi)}
            className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
          >
            <Globe size={14} />
            {isHindi ? 'English' : 'हिंदी'}
          </button>
          <button 
            onClick={onSpeak}
            className="bg-harvest-yellow text-organic-green p-2 rounded-full shadow-inner active:scale-95 transition-transform"
          >
            <Mic size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

const SplashScreen = ({ isHindi }: { isHindi: boolean }) => {
  useEffect(() => {
    // Pleasant farming sound (birds chirping)
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_062035a3df.mp3?filename=birds-chirping-7511.mp3');
    audio.volume = 0.4;
    
    // Play the sound
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Auto-play might be blocked by browser until first interaction
        console.log("Startup sound auto-play prevented. This is normal for some browsers.");
      });
    }

    return () => {
      // Fade out and stop sound when splash screen exits
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume -= 0.05;
        } else {
          audio.pause();
          clearInterval(fadeOut);
        }
      }, 50);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-organic-green flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Logo size={120} variant="light" />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8"
      >
        <h1 className="text-4xl font-black text-white tracking-tighter">
          {isHindi ? 'ऑर्गेनिक मित्र' : 'Organic Mitra'}
        </h1>
        <div className="h-1 w-12 bg-harvest-yellow mx-auto mt-2 rounded-full" />
        <p className="text-white/60 text-xs uppercase tracking-[0.3em] mt-4 font-bold">
          {isHindi ? 'कृषि विज्ञान केंद्र जबलपुर (म.प्र.)' : 'Krishi Vigyan Kendra Jabalpur (M.P.)'}
        </p>
      </motion.div>

      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center">
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-1/2 h-full bg-harvest-yellow"
          />
        </div>
        <p className="text-white/40 text-[10px] mt-4 font-medium uppercase tracking-widest">
          {isHindi ? 'प्राकृतिक खेती, समृद्ध किसान' : 'Natural Farming, Prosperous Farmer'}
        </p>
      </div>
    </motion.div>
  );
};

const Navigation = ({ currentScreen, setScreen, isHindi, onExpertClick }: { currentScreen: Screen, setScreen: (s: Screen) => void, isHindi: boolean, onExpertClick: () => void }) => {
  const items = [
    { id: Screen.DASHBOARD, icon: Home, label: isHindi ? 'होम' : 'Home' },
    { id: Screen.CROP_SELECTION, icon: Sprout, label: isHindi ? 'फसल' : 'Crops' },
    { id: Screen.PEST_IDENTIFIER, icon: Camera, label: isHindi ? 'पहचान' : 'Identify' },
    { id: Screen.EXPERT_CONNECT, icon: MessageSquare, label: isHindi ? 'विशेषज्ञ' : 'Expert' },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 p-2 fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center pb-6">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            if (item.id === Screen.EXPERT_CONNECT) {
              onExpertClick();
            } else {
              setScreen(item.id);
            }
          }}
          className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
        >
          <item.icon size={24} strokeWidth={currentScreen === item.id ? 2.5 : 2} />
          <span className="text-[10px] font-bold">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// --- Screens ---

const DAILY_ADVISORIES = [
  {
    en: 'Apply Jeevamrit to your wheat crop. It significantly boosts soil fertility.',
    hi: 'गेहूं की फसल में जीवामृत का छिड़काव करें। यह मिट्टी की उर्वरता बढ़ाता है।'
  },
  {
    en: 'Check for early signs of yellow rust in wheat. Early detection saves the harvest.',
    hi: 'गेहूं में पीला रतुआ (Yellow Rust) के शुरुआती लक्षणों की जांच करें। समय पर पहचान फसल बचाती है।'
  },
  {
    en: 'Prepare your fields for summer crops by adding well-decomposed cow dung manure.',
    hi: 'अच्छी तरह से सड़ी हुई गोबर की खाद डालकर अपने खेतों को गर्मी की फसलों के लिए तैयार करें।'
  },
  {
    en: 'Mulching helps retain soil moisture. Use dry leaves or straw around your vegetable plants.',
    hi: 'मल्चिंग मिट्टी की नमी बनाए रखने में मदद करती है। अपनी सब्जियों के पौधों के चारों ओर सूखी पत्तियों या पुआल का उपयोग करें।'
  },
  {
    en: 'Neem oil spray is a great organic way to control aphids and mites in your garden.',
    hi: 'नीम के तेल का छिड़काव आपके बगीचे में एफिड्स और माइट्स को नियंत्रित करने का एक बेहतरीन जैविक तरीका है।'
  },
  {
    en: 'Ensure proper drainage in your fields to prevent root rot during unexpected rains.',
    hi: 'अचानक होने वाली बारिश के दौरान जड़ सड़न को रोकने के लिए अपने खेतों में जल निकासी की उचित व्यवस्था सुनिश्चित करें।'
  },
  {
    en: 'Rotate your crops to break pest cycles and naturally improve soil health.',
    hi: 'कीट चक्रों को तोड़ने और प्राकृतिक रूप से मिट्टी के स्वास्थ्य में सुधार के लिए अपनी फसलों को बदल-बदल कर लगाएं।'
  }
];

const getDailyAdvisory = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return DAILY_ADVISORIES[dayOfYear % DAILY_ADVISORIES.length];
};

const Dashboard = ({ setScreen, isHindi, onExpertClick }: { setScreen: (s: Screen) => void, isHindi: boolean, onExpertClick: () => void }) => {
  const advisory = getDailyAdvisory();

  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
    city: string;
    isAuto: boolean;
  }>({
    lat: 23.18,
    lon: 79.99,
    city: isHindi ? 'जबलपुर, म.प्र.' : 'Jabalpur, M.P.',
    isAuto: false
  });

  // Sync default city name when language changes
  useEffect(() => {
    if (!location.isAuto) {
      setLocation(prev => ({
        ...prev,
        city: isHindi ? 'जबलपुर, म.प्र.' : 'Jabalpur, M.P.'
      }));
    }
  }, [isHindi]);

  const [weather, setWeather] = useState<{
    temp: number;
    humidity: number;
    rain: number;
    wind: number;
    code: number;
    loading: boolean;
    lastUpdated: string;
    error?: string;
  }>({
    temp: 28,
    humidity: 45,
    rain: 10,
    wind: 12,
    code: 1,
    loading: true,
    lastUpdated: '',
    error: undefined
  });

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Try to get city name via reverse geocoding
          let cityName = isHindi ? 'स्थानीय स्थान' : 'Local Location';
          try {
            if (!navigator.onLine) throw new Error('Offline');

            const geoResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=${isHindi ? 'hi' : 'en'}`,
              {
                cache: 'no-cache',
                referrerPolicy: "no-referrer",
                headers: {
                  'Accept': 'application/json',
                  'User-Agent': 'OrganicMitraApp/1.0'
                }
              }
            );
            
            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              const address = geoData.address;
              cityName = address.city || address.town || address.village || address.state_district || address.state || cityName;
            }
          } catch (e) {
            console.warn('Reverse geocoding failed, using coordinates', e);
          }

          setLocation({
            lat: latitude,
            lon: longitude,
            city: cityName,
            isAuto: true
          });
        },
        (error) => {
          console.warn('Geolocation warning (tolerated):', error);
          // Keep default Jabalpur if error or denied
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    }
  };

  const fetchWeather = async (retryCount = 0) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased timeout to 15s

    try {
      if (!navigator.onLine) {
        throw new Error('Offline');
      }

      setWeather(prev => ({ ...prev, loading: true, error: undefined }));
      
      // Ensure lat/lon are valid numbers
      let lat = Number(location.lat);
      let lon = Number(location.lon);
      
      if (isNaN(lat) || isNaN(lon)) {
        lat = 23.18;
        lon = 79.99;
      }

      // Optimized URL and added headers for better reliability
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${lon.toFixed(2)}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`,
        { 
          signal: controller.signal,
          cache: 'no-cache',
          referrerPolicy: "no-referrer",
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API_${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.current) {
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          rain: data.current.precipitation,
          wind: Math.round(data.current.wind_speed_10m),
          code: data.current.weather_code,
          loading: false,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          error: undefined
        });
      } else {
        throw new Error('DATA_FORMAT');
      }
    } catch (error: any) {
      let errorMsg = 'FETCH_ERROR';
      
      if (error.name === 'AbortError') {
        console.warn('Weather fetch timed out');
        errorMsg = 'TIMEOUT';
      } else if (error.message === 'Offline') {
        console.warn('Weather fetch skipped: User is offline');
        errorMsg = 'OFFLINE';
      } else if (error.message.startsWith('API_')) {
        errorMsg = error.message;
      } else {
        console.error('Weather fetch error:', error);
        errorMsg = error.message || 'NETWORK_ERROR';
        
        // Retry logic for transient failures (max 2 retries)
        if (retryCount < 2 && navigator.onLine) {
          console.log(`Retrying weather fetch (${retryCount + 1}/2)...`);
          setTimeout(() => fetchWeather(retryCount + 1), 3000);
          return;
        }
      }
      
      setWeather(prev => ({ 
        ...prev, 
        loading: false,
        lastUpdated: isHindi ? 'विफल' : 'Failed',
        error: errorMsg
      }));
    } finally {
      clearTimeout(timeoutId);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, [location.lat, location.lon]);

  const getWeatherDesc = (code: number) => {
    if (code === 0) return isHindi ? 'साफ आकाश' : 'Clear Sky';
    if (code <= 3) return isHindi ? 'आंशिक रूप से बादल' : 'Partly Cloudy';
    if (code >= 45 && code <= 48) return isHindi ? 'कोहरा' : 'Foggy';
    if (code >= 51 && code <= 67) return isHindi ? 'बारिश' : 'Raining';
    if (code >= 71 && code <= 77) return isHindi ? 'बर्फबारी' : 'Snowing';
    if (code >= 80 && code <= 99) return isHindi ? 'तूफान' : 'Thunderstorm';
    return isHindi ? 'आंशिक रूप से बादल' : 'Partly Cloudy';
  };

  const WeatherIcon = ({ code }: { code: number }) => {
    if (code === 0) return <Sun size={64} className="opacity-80" />;
    if (code <= 3) return <CloudSun size={64} className="opacity-80" />;
    if (code >= 51 && code <= 99) return <CloudRain size={64} className="opacity-80" />;
    return <Cloud size={64} className="opacity-80" />;
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Weather Widget */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden group">
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button 
            onClick={detectLocation}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
            title={isHindi ? 'स्थान पहचानें' : 'Detect Location'}
          >
            <Globe size={16} />
          </button>
          <button 
            onClick={fetchWeather}
            className={`p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all ${weather.loading ? 'animate-spin' : ''}`}
          >
            <RefreshCcw size={16} />
          </button>
        </div>
        
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium opacity-90">{location.city}</p>
              {weather.lastUpdated && (
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${weather.error ? 'bg-red-500/20' : 'bg-white/10'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${weather.error ? 'bg-red-400' : 'bg-green-400 animate-pulse'}`} />
                  <span className="text-[10px] opacity-80 uppercase tracking-wider font-bold">
                    {weather.error ? (isHindi ? 'त्रुटि' : 'Error') : (isHindi ? 'लाइव' : 'Live')}
                  </span>
                  <span className="text-[10px] opacity-60 ml-1">
                    {weather.lastUpdated === 'Failed' || weather.lastUpdated === 'विफल' 
                      ? (isHindi ? 'पुनः प्रयास करें' : 'Retry') 
                      : weather.lastUpdated}
                  </span>
                </div>
              )}
            </div>
            <h2 className="text-4xl font-bold mt-1">{weather.temp}°C</h2>
            <p className="text-lg font-semibold">{getWeatherDesc(weather.code)}</p>
          </div>
          <WeatherIcon code={weather.code} />
        </div>
        <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-xs font-medium">
          <span>{isHindi ? `नमी: ${weather.humidity}%` : `Humidity: ${weather.humidity}%`}</span>
          <span>{isHindi ? `बारिश: ${weather.rain}mm` : `Rain: ${weather.rain}mm`}</span>
          <span>{isHindi ? `हवा: ${weather.wind}km/h` : `Wind: ${weather.wind}km/h`}</span>
        </div>
      </div>

      {/* Advisory */}
      <div className="bg-harvest-yellow/20 border border-harvest-yellow rounded-2xl p-4 flex gap-4 items-start">
        <div className="bg-harvest-yellow p-2 rounded-full text-organic-green">
          <Info size={20} />
        </div>
        <div>
          <h3 className="font-bold text-organic-green">{isHindi ? 'आज की सलाह' : "Today's Advisory"}</h3>
          <p className="text-sm text-gray-700 leading-snug mt-1">
            {isHindi ? advisory.hi : advisory.en}
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setScreen(Screen.CROP_SELECTION)}
          className="rural-card flex flex-col items-center gap-3 py-6"
        >
          <div className="bg-green-100 p-4 rounded-full text-organic-green">
            <Sprout size={32} />
          </div>
          <span className="font-bold text-center">{isHindi ? 'जैविक खेती गाइड' : 'Organic Guide'}</span>
        </button>
        <button 
          onClick={() => setScreen(Screen.SOIL_TRACKER)}
          className="rural-card flex flex-col items-center gap-3 py-6"
        >
          <div className="bg-amber-100 p-4 rounded-full text-amber-700">
            <FlaskConical size={32} />
          </div>
          <span className="font-bold text-center">{isHindi ? 'मिट्टी स्वास्थ्य ट्रैकर' : 'Soil Health Tracker'}</span>
        </button>
        <button 
          onClick={() => setScreen(Screen.PEST_IDENTIFIER)}
          className="rural-card flex flex-col items-center gap-3 py-6"
        >
          <div className="bg-red-100 p-4 rounded-full text-red-600">
            <Camera size={32} />
          </div>
          <span className="font-bold text-center">{isHindi ? 'कीट पहचान' : 'Pest ID'}</span>
        </button>
        <button 
          onClick={() => setScreen(Screen.NATURAL_FARMING)}
          className="rural-card flex flex-col items-center gap-3 py-6"
        >
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
            <Leaf size={32} />
          </div>
          <span className="font-bold text-center">{isHindi ? 'प्राकृतिक खेती' : 'Natural Farming'}</span>
        </button>
        <button 
          onClick={() => setScreen(Screen.MARKET_CERT)}
          className="rural-card flex flex-col items-center gap-3 py-6"
        >
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <Award size={32} />
          </div>
          <span className="font-bold text-center">{isHindi ? 'प्रमाणन और बाजार' : 'Market & Cert'}</span>
        </button>
        <button 
          onClick={() => setScreen(Screen.LEARNING_HUB)}
          className="rural-card flex flex-col items-center gap-3 py-6"
        >
          <div className="bg-purple-100 p-4 rounded-full text-purple-600">
            <BookOpen size={32} />
          </div>
          <span className="font-bold text-center">{isHindi ? 'सीखें' : 'Learning Hub'}</span>
        </button>
        <button 
          onClick={() => setScreen(Screen.CALCULATOR)}
          className="rural-card flex flex-col items-center gap-3 py-6 col-span-2"
        >
          <div className="bg-orange-100 p-4 rounded-full text-orange-600">
            <Calculator size={32} />
          </div>
          <span className="font-bold text-center">{isHindi ? 'जैविक इनपुट कैलकुलेटर' : 'Organic Input Calculator'}</span>
        </button>
      </div>

      {/* Attribution Footer */}
      <div className="text-center pt-4 opacity-60">
        <p className="text-[10px] font-medium leading-relaxed">
          {ATTRIBUTION.ownership}
        </p>
        <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
          Version: 2026-04-16-PROD
        </p>
      </div>
    </div>
  );
};

const CropSelection = ({ setScreen, isHindi, onSelectCrop }: { setScreen: (s: Screen) => void, isHindi: boolean, onSelectCrop: (c: Crop) => void }) => {
  const [filter, setFilter] = useState<'All' | 'Kharif' | 'Rabi' | 'Zaid'>('All');

  const filteredCrops = filter === 'All' ? CROPS : CROPS.filter(c => c.season === filter);

  return (
    <div className="p-4 pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-organic-green">{isHindi ? 'अपनी फसल चुनें' : 'Select Your Crop'}</h2>
      
      {/* Season Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['All', 'Kharif', 'Rabi', 'Zaid'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border ${
              filter === s ? 'bg-organic-green text-white border-organic-green' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {isHindi ? (s === 'All' ? 'सभी' : s) : s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredCrops.map((crop) => (
          <button
            key={crop.id}
            onClick={() => onSelectCrop(crop)}
            className="rural-card flex flex-col items-center gap-2 py-6 relative overflow-hidden"
          >
            <span className="text-4xl mb-2">{crop.icon}</span>
            <span className="font-bold text-lg">{isHindi ? crop.hindiName : crop.name}</span>
            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-bold uppercase">
              {crop.season}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const FarmingGuide = ({ crop, isHindi, onSelectStep, setScreen }: { crop: Crop, isHindi: boolean, onSelectStep: (step: any) => void, setScreen: (s: Screen) => void }) => {
  const [playingVideo, setPlayingVideo] = useState(false);
  const steps = CROP_GUIDES[crop.id] || [];

  const openVideo = (id: string) => {
    window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-black/5">
        <span className="text-4xl">{crop.icon}</span>
        <div>
          <h2 className="text-xl font-bold text-organic-green">{isHindi ? crop.hindiName : crop.name}</h2>
          <p className="text-sm text-gray-500">{isHindi ? 'जैविक खेती गाइड' : 'Organic Farming Guide'}</p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx}
            onClick={() => onSelectStep(step)}
            className="rural-card flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-organic-green/10 flex items-center justify-center text-xl">
                {step.icon}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Step {idx + 1}</p>
                <h3 className="font-bold text-lg">{isHindi ? step.hindi : step.title}</h3>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-full group-active:bg-organic-green group-active:text-white transition-colors">
              <ChevronRight size={20} />
            </div>
          </motion.div>
        ))}
      </div>

      <button 
        onClick={() => {
          const videoKey = `${crop.id.toUpperCase()}_GUIDE` as keyof typeof YOUTUBE_VIDEOS;
          openVideo(YOUTUBE_VIDEOS[videoKey] || YOUTUBE_VIDEOS.JEEVAMRIT_GUIDE);
        }} 
        className="btn-primary w-full mt-4"
      >
        <Play size={20} />
        {isHindi ? 'वीडियो गाइड देखें' : 'Watch Video Guide'}
      </button>
    </div>
  );
};

const StepDetail = ({ step, isHindi, setScreen }: { step: any, isHindi: boolean, setScreen: (s: Screen) => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const openVideo = (id: string) => {
    window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
  };

  useEffect(() => {
    return () => {
      safeCancelSpeech();
    };
  }, []);

 
   const handleSpeak = async () => {
  try {
    if (isPlaying) {
      await TextToSpeech.stop();
      setIsPlaying(false);
      return;
    }

    const rawText = isHindi ? step.hindiContent : step.content;
    const proTip = isHindi
      ? 'महत्वपूर्ण सुझाव: हमेशा सुबह या शाम को ही छिड़काव करें।'
      : 'Pro Tip: Always spray in the early morning or late evening.';

    const fullText = `${rawText}. ${proTip}`;
    const text = cleanTextForSpeech(fullText, isHindi);

    setIsPlaying(true);

    await TextToSpeech.speak({
      text,
      lang: isHindi ? 'hi-IN' : 'en-US',
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
    });

    setIsPlaying(false);
  } catch (error) {
    console.warn('Native text-to-speech failed:', error);
    setIsPlaying(false);
  }
};
  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-20 h-20 rounded-full bg-organic-green/10 flex items-center justify-center text-5xl mb-2">
            {step.icon}
          </div>
          <h2 className="text-2xl font-bold text-organic-green">{isHindi ? step.hindi : step.title}</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-soil-white p-5 rounded-2xl border border-black/5">
            <p className="text-lg leading-relaxed text-gray-800 font-medium">
              {isHindi ? step.hindiContent : step.content}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-harvest-yellow/10 p-4 rounded-2xl border border-harvest-yellow/30 flex gap-4 items-start">
              <div className="bg-harvest-yellow p-2 rounded-full text-organic-green shrink-0">
                <Info size={18} />
              </div>
              <p className="text-sm font-bold text-organic-green">
                {isHindi ? 'महत्वपूर्ण सुझाव: हमेशा सुबह या शाम को ही छिड़काव करें।' : 'Pro Tip: Always spray in the early morning or late evening.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={handleSpeak}
          className={`btn-primary flex-1 ${isPlaying ? 'bg-red-600' : ''}`}
        >
          <Mic size={20} className={isPlaying ? 'animate-pulse' : ''} />
          {isPlaying ? (isHindi ? 'रुकें' : 'Stop') : (isHindi ? 'सुनें' : 'Listen')}
        </button>
        <button 
          onClick={() => setScreen(Screen.EXPERT_CONNECT)}
          className="btn-secondary flex-1"
        >
          <MessageSquare size={20} />
          {isHindi ? 'सवाल पूछें' : 'Ask Question'}
        </button>
      </div>
    </div>
  );
};

const PestIdentifier = ({ isHindi, onExpertClick }: { isHindi: boolean, onExpertClick: () => void }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const preprocessImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // 2000px is high resolution for detail while remaining stable for API payloads
        const LIMIT = 2000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > LIMIT) {
            height *= LIMIT / width;
            width = LIMIT;
          }
        } else {
          if (height > LIMIT) {
            width *= LIMIT / height;
            height = LIMIT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          try {
            // Subtle enhancement for better AI recognition
            ctx.filter = 'contrast(1.1) brightness(1.02)';
          } catch (e) {
            console.warn("Canvas filter not supported");
          }
          ctx.drawImage(img, 0, 0, width, height);
        }
        // Use high quality JPEG
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setStatus(isHindi ? "फोटो तैयार कर रहा है..." : "Preparing photo...");
    setResult(null);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImage(base64);
      
      try {
        // Preprocess to enhance visibility while maintaining high resolution
        const processed = await preprocessImage(base64);
        handleIdentify(processed);
      } catch (err) {
        console.error("Preprocessing error:", err);
        handleIdentify(base64); 
      }
    };
    reader.readAsDataURL(file);
  };

  const handleIdentify = async (base64Image: string) => {
    if (!base64Image) return;
    
    setAnalyzing(true);
    setStatus(isHindi ? "AI फोटो का विश्लेषण कर रहा है… (कुछ सेकंड लग सकते हैं)" : "AI is analyzing the photo... (may take a few seconds)");
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API_KEY_MISSING");
      }

      const ai = new GoogleGenAI({ apiKey });
      // Using Gemini 3 Flash for maximum stability and speed
      const model = "gemini-3-flash-preview";
      
      const prompt = isHindi 
        ? `आप एक वरिष्ठ कृषि वैज्ञानिक हैं। इस तस्वीर का बहुत बारीकी से विश्लेषण करें।
           पौधे के कीटों (जैसे: सफेद मक्खी, महू, मिलीबग, थ्रिप्स) या रोगों (जैसे: झुलसा, चूर्णिल आसिता, रस्ट) की पहचान करें।
           
           नियम:
           1. कीट/रोग का सटीक नाम और सटीकता प्रतिशत (0-100) दें।
           2. हमेशा एक प्रभावी जैविक (Organic) उपचार विस्तार से बताएं (जैसे नीम का तेल, अग्निस्त्र, ब्रह्मास्त्र का उपयोग)।
           3. यदि कीट स्पष्ट नहीं है, तो "संभावित" कीट का नाम दें।
           4. उत्तर केवल JSON फॉर्मेट में दें।`
        : `You are a senior agricultural scientist. Analyze this photo very closely.
           Identify common crop pests (Whitefly, Aphids, Mealybug, Thrips) or diseases (Blight, Powdery Mildew, Rust).
           
           Rules:
           1. Provide the exact name and confidence percentage (0-100).
           2. Always provide a detailed effective Organic remedy (e.g., use of Neem oil, Agnistra, Brahmastra).
           3. If the pest is not clear, provide a "Probable" identification.
           4. Respond ONLY in JSON format.`;

      // Ensure base64 data is clean
      const imageData = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageData
              }
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              remedy: { type: Type.STRING }
            },
            required: ["name", "confidence", "remedy"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("EMPTY_RESPONSE");
      
      try {
        const data = JSON.parse(text);
        setResult(data);
      } catch (parseErr) {
        console.error("JSON Parse Error:", text);
        throw new Error("INVALID_JSON");
      }
    } catch (error: any) {
      console.error("Identification error:", error);
      
      let errorMessage = isHindi 
        ? "क्षमा करें, AI इस फोटो से समस्या की पहचान नहीं कर सका। कृपया एक साफ़ और नज़दीकी फोटो लें।" 
        : "Sorry, AI couldn't identify the issue. Please try a clearer close-up shot.";

      if (error.message === "API_KEY_MISSING") {
        errorMessage = isHindi 
          ? "सिस्टम त्रुटि: API की (Key) नहीं मिली। कृपया सेटिंग्स की जांच करें।" 
          : "System Error: API Key missing. Please check settings.";
      } else if (error.message === "EMPTY_RESPONSE" || error.message === "INVALID_JSON") {
        errorMessage = isHindi
          ? "सर्वर से गलत प्रतिक्रिया मिली। कृपया फिर से कोशिश करें।"
          : "Invalid response from server. Please try again.";
      }

      setResult({
        name: isHindi ? "पहचान विफल" : "Identification Failed",
        remedy: errorMessage,
        confidence: 0
      });
    } finally {
      setAnalyzing(false);
      setStatus("");
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-organic-green">{isHindi ? 'कीट और रोग पहचान' : 'Pest & Disease ID'}</h2>
      
      {/* Hidden inputs */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        className="hidden" 
        ref={cameraInputRef}
        onChange={handleFileChange}
      />
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={galleryInputRef}
        onChange={handleFileChange}
      />

      <div className="aspect-square bg-gray-200 rounded-3xl border-4 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
        {image ? (
          <img 
            src={image} 
            className="w-full h-full object-cover" 
            alt="Scanned pest"
          />
        ) : (
          <div className="flex flex-col items-center p-8 text-center">
            <Camera size={64} className="text-gray-400 mb-4" />
            <p className="text-gray-500 font-bold">
              {isHindi ? 'कीट या रोगग्रस्त पत्ते की फोटो खींचें' : 'Take a photo of the pest or diseased leaf'}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {isHindi ? 'AI तुरंत पहचान करेगा और जैविक समाधान बताएगा' : 'AI will instantly identify and suggest organic solutions'}
            </p>
          </div>
        )}

        {analyzing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 border-4 border-harvest-yellow border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-white text-lg">{status}</p>
          </div>
        )}
      </div>

      {!analyzing && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button 
              onClick={() => cameraInputRef.current?.click()} 
              className="btn-primary flex-1 bg-organic-green"
            >
              <Camera size={24} />
              {isHindi ? 'कैमरा' : 'Camera'}
            </button>
            <button 
              onClick={() => galleryInputRef.current?.click()} 
              className="btn-primary flex-1 bg-harvest-yellow text-organic-green"
            >
              <ImagePlus size={24} />
              {isHindi ? 'गैलरी' : 'Gallery'}
            </button>
          </div>
          {image && (
            <button 
              onClick={() => { setImage(null); setResult(null); }} 
              className="w-full py-3 bg-gray-100 rounded-xl text-gray-500 flex items-center justify-center gap-2 font-bold"
            >
              <RefreshCcw size={20} />
              {isHindi ? 'फिर से शुरू करें' : 'Reset'}
            </button>
          )}
        </div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-2xl p-5 border-2 shadow-xl space-y-4 ${
            result.confidence < 50 ? 'border-harvest-yellow' : 'border-organic-green'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-xs font-bold uppercase ${
                result.confidence < 50 ? 'text-earth-brown' : 'text-organic-green'
              }`}>
                {result.confidence < 50 
                  ? (isHindi ? 'संभावित समस्या' : 'Probable Issue')
                  : (isHindi ? 'पहचान' : 'Identification')
                }
              </p>
              <h3 className="text-2xl font-bold">{result.name}</h3>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              result.confidence < 50 ? 'bg-yellow-100 text-earth-brown' : 'bg-green-100 text-organic-green'
            }`}>
              {result.confidence}% Match
            </span>
          </div>

          {result.confidence < 50 && result.confidence > 0 && (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-xs text-earth-brown italic">
              {isHindi 
                ? "नोट: फोटो थोड़ी धुंधली हो सकती है, इसलिए यह एक संभावित पहचान है। बेहतर परिणाम के लिए फिर से साफ़ फोटो लें।" 
                : "Note: The photo might be slightly unclear, so this is a probable identification. For better results, retake a clearer photo."}
            </div>
          )}

          <div className="bg-harvest-yellow/10 p-4 rounded-xl border border-harvest-yellow/30">
            <p className="text-xs font-bold text-earth-brown uppercase mb-1">{isHindi ? 'जैविक उपचार' : 'Organic Remedy'}</p>
            <p className="font-medium">{result.remedy}</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-primary flex-1 py-3 text-sm" onClick={() => {
              if (result.confidence === 0 && image) {
                handleIdentify(image); // Retry with existing image
              } else {
                setImage(null); 
                setResult(null);
              }
            }}>
              {result.confidence === 0 ? (isHindi ? 'फिर से कोशिश करें' : 'Retry') : (isHindi ? 'फिर से स्कैन करें' : 'Scan Again')}
            </button>
            <button className="btn-secondary flex-1 py-3 text-sm" onClick={() => {
              if (result.confidence === 0) {
                setImage(null);
                setResult(null);
              } else {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(result.name + " organic treatment")}`, '_blank');
              }
            }}>
              {result.confidence === 0 ? (isHindi ? 'नई फोटो लें' : 'New Photo') : (isHindi ? 'अधिक जानकारी' : 'More Info')}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const InputCalculator = ({ isHindi }: { isHindi: boolean }) => {
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('Acre');

  const getConversionFactor = () => {
    if (unit === 'Hectare') return 2.471;
    if (unit === 'Bigha') return 0.625;
    return 1; // Acre
  };

  const factor = getConversionFactor();
  const numericArea = parseFloat(area) || 0;
  const effectiveArea = numericArea * factor;

  return (
    <div className="p-4 pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-organic-green">{isHindi ? 'जैविक इनपुट कैलकुलेटर' : 'Organic Input Calc'}</h2>
      
      <div className="rural-card space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-2">
            {isHindi ? 'भूमि क्षेत्र दर्ज करें' : 'Enter Land Area'}
          </label>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold outline-none focus:border-organic-green"
            />
            <select 
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold outline-none"
            >
              <option value="Acre">{isHindi ? 'एकड़' : 'Acre'}</option>
              <option value="Bigha">{isHindi ? 'बीघा' : 'Bigha'}</option>
              <option value="Hectare">{isHindi ? 'हेक्टेयर' : 'Hectare'}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="bg-organic-green/5 p-4 rounded-xl flex justify-between items-center">
            <span className="font-medium">{isHindi ? 'जीवामृत (तरल)' : 'Jeevamrit (Liquid)'}</span>
            <span className="font-bold text-organic-green">{(effectiveArea * 200).toFixed(0)} L</span>
          </div>
          <div className="bg-organic-green/5 p-4 rounded-xl flex justify-between items-center">
            <span className="font-medium">{isHindi ? 'घनजीवामृत (ठोस)' : 'Ghanjeevamrit (Solid)'}</span>
            <span className="font-bold text-organic-green">{(effectiveArea * 250).toFixed(0)} Kg</span>
          </div>
          <div className="bg-organic-green/5 p-4 rounded-xl flex justify-between items-center">
            <span className="font-medium">{isHindi ? 'वर्मीकम्पोस्ट' : 'Vermicompost'}</span>
            <span className="font-bold text-organic-green">{(effectiveArea * 1000).toFixed(0)} Kg</span>
          </div>
        </div>
      </div>

      <div className="bg-earth-brown/10 p-4 rounded-2xl border border-earth-brown/20 flex gap-4 items-center">
        <div className="bg-earth-brown text-white p-2 rounded-full">
          <HelpCircle size={20} />
        </div>
        <p className="text-xs font-medium text-earth-brown">
          {isHindi 
            ? 'ये सिफारिशें सामान्य हैं। सटीक मात्रा के लिए मिट्टी परीक्षण रिपोर्ट देखें।' 
            : 'These are general recommendations. Refer to soil test report for precision.'}
        </p>
      </div>
    </div>
  );
};

const ExpertConnect = ({ isHindi }: { isHindi: boolean }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: isHindi ? 'जीवामृत कैसे बनाएं?' : 'How to make Jeevamrit?',
      a: isHindi 
        ? '10 किलो गोबर, 10 लीटर गोमूत्र, 2 किलो गुड़, 2 किलो बेसन और एक मुट्ठी खेत की मिट्टी को 200 लीटर पानी में मिलाकर 7 दिनों तक छाया में रखें।' 
        : 'Mix 10kg cow dung, 10L cow urine, 2kg jaggery, 2kg pulse flour, and a handful of farm soil in 200L water. Keep in shade for 7 days.'
    },
    {
      q: isHindi ? 'जैविक प्रमाणीकरण कैसे लें?' : 'How to get organic certification?',
      a: isHindi 
        ? 'निकटतम कृषि विज्ञान केंद्र या कृषि विभाग में पंजीकरण करें। रूपांतरण अवधि 3 वर्ष है। PGS-India या NPOP के तहत आवेदन करें।' 
        : 'Register at the nearest Krishi Vigyan Kendra or Agriculture Dept. The conversion period is 3 years. Apply under PGS-India or NPOP.'
    },
    {
      q: isHindi ? 'नीम का तेल कहां मिलेगा?' : 'Where to find Neem oil?',
      a: isHindi 
        ? 'यह स्थानीय कृषि सेवा केंद्रों या सहकारी समितियों पर उपलब्ध है। आप घर पर भी नीम की निंबोली से इसे बना सकते हैं।' 
        : 'It is available at local agri-service centers or cooperatives. You can also make it at home using neem seeds.'
    }
  ];

  return (
    <div className="p-4 pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-organic-green">{isHindi ? 'विशेषज्ञ से जुड़ें' : 'Expert Connect'}</h2>
      
      <div className="rural-card flex items-center gap-4 p-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
          <img src="https://picsum.photos/seed/expert/200/200" alt="Expert" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{isHindi ? 'डॉ. ए.के. सिंह' : 'Dr. A.K. Singh'}</h3>
          <p className="text-sm text-gray-500 font-medium">{isHindi ? 'जैविक खेती विशेषज्ञ, कृषि विज्ञान केंद्र' : 'Organic Specialist, Krishi Vigyan Kendra'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <a 
          href="tel:9424638238"
          className="btn-primary flex-col py-8 h-auto no-underline"
        >
          <Phone size={32} />
          <span className="text-sm mt-2">{isHindi ? 'कॉल करें' : 'Call Now'}</span>
        </a>
        <a 
          href="sms:9424638238"
          className="btn-secondary flex-col py-8 h-auto no-underline"
        >
          <MessageSquare size={32} />
          <span className="text-sm mt-2">{isHindi ? 'चैट करें' : 'Chat'}</span>
        </a>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-gray-600 uppercase text-xs tracking-wider">{isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequent Questions'}</h4>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
              <button 
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full p-4 flex justify-between items-center text-left"
              >
                <span className="font-bold text-sm">{faq.q}</span>
                <ChevronRight size={16} className={`text-gray-400 transition-transform ${expandedFaq === i ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-50 pt-2"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SCHEMES = [
  {
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    hindiName: 'परम्परागत कृषि विकास योजना (PKVY)',
    desc: 'Promotes organic farming through cluster approach and PGS certification.',
    hindiDesc: 'क्लस्टर दृष्टिकोण और PGS प्रमाणन के माध्यम से जैविक खेती को बढ़ावा देता है।',
    url: 'https://dap.dac.gov.in/pkvy/',
    color: 'bg-green-50 text-green-700 border-green-100'
  },
  {
    name: 'PM-Kisan Samman Nidhi',
    hindiName: 'पीएम-किसान सम्मान निधि',
    desc: 'Direct income support of ₹6,000 per year to all landholding farmers.',
    hindiDesc: 'सभी भूमिधारक किसानों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।',
    url: 'https://pmkisan.gov.in/',
    color: 'bg-blue-50 text-blue-700 border-blue-100'
  },
  {
    name: 'PM Fasal Bima Yojana (PMFBY)',
    hindiName: 'प्रधानमंत्री फसल बीमा योजना',
    desc: 'Crop insurance for farmers against natural calamities and pests.',
    hindiDesc: 'प्राकृतिक आपदाओं और कीटों के खिलाफ किसानों के लिए फसल बीमा।',
    url: 'https://pmfby.gov.in/',
    color: 'bg-orange-50 text-orange-700 border-orange-100'
  },
  {
    name: 'Soil Health Card Scheme',
    hindiName: 'मृदा स्वास्थ्य कार्ड योजना',
    desc: 'Provides farmers with soil nutrient status and fertilizer recommendations.',
    hindiDesc: 'किसानों को मिट्टी के पोषक तत्वों की स्थिति और उर्वरक सिफारिशें प्रदान करता है।',
    url: 'https://soilhealth.dac.gov.in/',
    color: 'bg-purple-50 text-purple-700 border-purple-100'
  }
];

const MarketCert = ({ isHindi }: { isHindi: boolean }) => {
  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  const showInfo = (msg: string) => {
    setActiveInfo(msg);
    setTimeout(() => setActiveInfo(null), 3000);
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 pb-24 space-y-6 relative">
      <h2 className="text-2xl font-bold text-organic-green">{isHindi ? 'बाजार और प्रमाणन' : 'Market & Cert'}</h2>
      
      <AnimatePresence>
        {activeInfo && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-4 right-4 bg-organic-green text-white p-4 rounded-xl shadow-2xl z-[60] text-center font-bold"
          >
            {activeInfo}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg">
          <Award size={40} className="mb-4 text-harvest-yellow" />
          <h3 className="text-xl font-bold mb-2">{isHindi ? 'जैविक प्रमाणन प्रक्रिया' : 'Organic Certification'}</h3>
          <p className="text-sm opacity-90 leading-relaxed">
            {isHindi 
              ? 'NPOP/PGS-India के तहत पंजीकरण करें। 3 साल का रूपांतरण समय लगता है।' 
              : 'Register under NPOP/PGS-India. Requires 3 years conversion period.'}
          </p>
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => openUrl('https://pgsindia-ncof.gov.in/')}
              className="bg-white text-green-700 font-bold px-4 py-2 rounded-lg text-sm active:scale-95 transition-transform"
            >
              {isHindi ? 'PGS-India पोर्टल' : 'PGS-India Portal'}
            </button>
            <button 
              onClick={() => showInfo(isHindi ? 'पंजीकरण फॉर्म जल्द ही उपलब्ध होगा' : 'Registration form will be available soon')}
              className="bg-green-800/50 text-white font-bold px-4 py-2 rounded-lg text-sm active:scale-95 transition-transform"
            >
              {isHindi ? 'पंजीकरण शुरू करें' : 'Start Registration'}
            </button>
          </div>
        </div>

        <div className="rural-card space-y-4">
          <h4 className="font-bold text-organic-green flex items-center gap-2">
            <Globe size={18} />
            {isHindi ? 'निकटतम जैविक बाजार' : 'Nearby Organic Markets'}
          </h4>
          <div className="space-y-3">
            {[
              { name: 'Jabalpur Mandi', dist: '5 km' },
              { name: 'Sihora Organic Hub', dist: '32 km' },
              { name: 'Patan Farmer Market', dist: '24 km' },
            ].map((m, i) => (
              <div key={i} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0">
                <span className="font-medium">{m.name}</span>
                <span className="text-xs font-bold text-gray-400">{m.dist}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => openUrl('https://agmarknet.gov.in/')}
            className="w-full text-center text-xs text-organic-green font-bold underline py-2"
          >
            {isHindi ? 'सभी मंडियों के भाव देखें (Agmarknet)' : 'Check all Mandi prices (Agmarknet)'}
          </button>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-gray-600 text-xs uppercase tracking-widest px-2">
            {isHindi ? 'प्रमुख सरकारी योजनाएं' : 'Key Govt Schemes'}
          </h4>
          {SCHEMES.map((scheme, i) => (
            <div 
              key={i}
              onClick={() => openUrl(scheme.url)}
              className={`${scheme.color} border rounded-2xl p-4 flex gap-4 cursor-pointer active:scale-[0.98] transition-all`}
            >
              <FileText size={24} className="shrink-0" />
              <div>
                <h4 className="font-bold text-sm">{isHindi ? scheme.hindiName : scheme.name}</h4>
                <p className="text-[10px] mt-1 opacity-80 leading-tight">
                  {isHindi ? scheme.hindiDesc : scheme.desc}
                </p>
                <span className="text-[10px] font-bold underline mt-2 block">
                  {isHindi ? 'वेबसाइट पर जाएं' : 'Visit Website'} →
                </span>
              </div>
            </div>
          ))}
          
          <div 
            onClick={() => openUrl('https://www.myscheme.gov.in/')}
            className="bg-gray-100 border border-gray-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ExternalLink size={20} className="text-gray-500" />
              <span className="text-sm font-bold text-gray-700">
                {isHindi ? 'अन्य सभी योजनाएं खोजें' : 'Search all other schemes'}
              </span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

const LearningHub = ({ isHindi }: { isHindi: boolean }) => {
  const [selectedStory, setSelectedStory] = useState<{ name: string, hindiName: string, story: string, fullStory: string, avatar: string } | null>(null);

  const openVideo = (id: string) => {
    window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
  };

  const trainingVideos = [
    {
      id: 'jeevamrit_vid_001',
      youtubeId: YOUTUBE_VIDEOS.JEEVAMRIT_GUIDE,
      title: isHindi ? 'जीवामृत बनाने की विधि' : 'How to make Jeevamrit',
      views: '45k',
      duration: '8:45',
      thumbnail: `https://img.youtube.com/vi/${YOUTUBE_VIDEOS.JEEVAMRIT_GUIDE}/mqdefault.jpg`
    },
    {
      id: 'pest_control_vid_002',
      youtubeId: YOUTUBE_VIDEOS.PEST_CONTROL_ORGANIC,
      title: isHindi ? 'जैविक कीट नियंत्रण' : 'Organic Pest Control',
      views: '32k',
      duration: '12:20',
      thumbnail: `https://img.youtube.com/vi/${YOUTUBE_VIDEOS.PEST_CONTROL_ORGANIC}/mqdefault.jpg`
    },
    {
      id: 'vermicompost_vid_003',
      youtubeId: YOUTUBE_VIDEOS.VERMICOMPOST_UNIT,
      title: isHindi ? 'वर्मीकम्पोस्ट यूनिट' : 'Vermicompost Unit Setup',
      views: '28k',
      duration: '10:15',
      thumbnail: `https://img.youtube.com/vi/${YOUTUBE_VIDEOS.VERMICOMPOST_UNIT}/mqdefault.jpg`
    }
  ];

  const successStories = [
    {
      name: 'Ramesh Patel',
      hindiName: 'रमेश पटेल',
      story: isHindi ? '5 एकड़ में जैविक खेती शुरू की, मुनाफा दोगुना हुआ।' : 'Switched 5 acres to organic, doubled profit.',
      detail: isHindi 
        ? 'रमेश जी ने रासायनिक खेती छोड़ पूरी तरह से प्राकृतिक खेती अपनाई। आज वे न केवल स्वस्थ फसल उगा रहे हैं, बल्कि उनकी लागत भी 60% कम हो गई है।'
        : 'Ramesh switched from chemical to 100% natural farming. Today, he grows healthy crops and has reduced his input costs by 60%.',
      fullStory: isHindi
        ? 'रमेश जी ने 2018 में अपनी 5 एकड़ जमीन पर रासायनिक खेती छोड़ पूरी तरह से प्राकृतिक खेती अपनाई। शुरुआत में उन्हें काफी चुनौतियों का सामना करना पड़ा, लेकिन कृषि विज्ञान केंद्र जबलपुर के विशेषज्ञों के मार्गदर्शन में उन्होंने जीवामृत और घनजीवामृत का सही उपयोग सीखा। आज उनकी मिट्टी की उर्वरता वापस आ गई है और वे गेहूं और चने की रिकॉर्ड पैदावार ले रहे हैं। उनकी लागत 60% कम हो गई है और मुनाफा दोगुना हो गया है।'
        : 'Ramesh ji switched from chemical to 100% natural farming on his 5-acre land in 2018. Initially, he faced many challenges, but under the guidance of Krishi Vigyan Kendra Jabalpur experts, he learned the correct use of Jeevamrit and Ghanjeevamrit. Today, his soil fertility has returned, and he is achieving record yields of wheat and gram. His input costs have reduced by 60%, and his profit has doubled.',
      avatar: '👨‍🌾'
    },
    {
      name: 'Sita Devi',
      hindiName: 'सीता देवी',
      story: isHindi ? 'सिहोरा में महिला जैविक समूह का नेतृत्व।' : 'Leading a women organic cluster in Sihora.',
      detail: isHindi
        ? 'सीता देवी ने अपने गांव की 20 महिलाओं को जोड़कर एक जैविक समूह बनाया है। वे अब अपने उत्पादों को सीधे शहर के बाजारों में अच्छे दामों पर बेचती हैं।'
        : 'Sita Devi formed an organic cluster with 20 women from her village. They now sell their produce directly to urban markets at premium prices.',
      fullStory: isHindi
        ? 'सिहोरा की सीता देवी ने न केवल खुद जैविक खेती अपनाई, बल्कि अपने गांव की 20 अन्य महिलाओं को भी इसके लिए प्रेरित किया। उन्होंने एक \'महिला जैविक समूह\' बनाया है जहाँ वे मिलकर जैविक खाद और कीटनाशक तैयार करती हैं। अब वे अपने उत्पादों को सीधे शहर के बाजारों में \'शुद्ध आहार\' ब्रांड के तहत अच्छे दामों पर बेचती हैं। उनकी सफलता ने पूरे गांव की महिलाओं को आर्थिक रूप से स्वतंत्र बना दिया है।'
        : 'Sita Devi from Sihora not only adopted organic farming herself but also inspired 20 other women in her village to do the same. She has formed a \'Women Organic Group\' where they collectively prepare organic fertilizers and pesticides. Now, they sell their products directly in urban markets under the \'Shuddha Aahar\' brand at premium prices. Her success has made the women of the entire village economically independent.',
      avatar: '👩‍🌾'
    }
  ];

  return (
    <div className="p-4 pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-organic-green">{isHindi ? 'सीखें और बढ़ें' : 'Learning Hub'}</h2>
      
      <div className="space-y-8">
        {/* Training Videos Section */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-gray-600 text-xs uppercase tracking-widest">{isHindi ? 'प्रशिक्षण वीडियो' : 'Training Videos'}</h3>
            <button className="text-xs font-bold text-organic-green underline">{isHindi ? 'सभी देखें' : 'See All'}</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {trainingVideos.map((v) => (
              <div 
                key={v.id} 
                onClick={() => openVideo(v.youtubeId)}
                className="min-w-[260px] bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="aspect-video bg-gray-200 relative">
                  <img src={v.thumbnail} className="w-full h-full object-cover" alt={v.title} referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-white/90 p-3 rounded-full text-organic-green shadow-xl">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                    {v.duration}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm line-clamp-1">{v.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-1">{v.views} {isHindi ? 'व्यूज' : 'Views'} • {isHindi ? 'हिंदी' : 'Hindi'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Success Stories Section */}
        <section>
          <h3 className="font-bold text-gray-600 text-xs uppercase tracking-widest mb-4">{isHindi ? 'सफलता की कहानियां' : 'Success Stories'}</h3>
          <div className="space-y-4">
            {successStories.map((s, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedStory(s)}
                className="rural-card group cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-organic-green/10 flex items-center justify-center text-3xl shrink-0">
                    {s.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg text-organic-green">{isHindi ? s.hindiName : s.name}</h4>
                      <div className="bg-organic-green/10 p-1.5 rounded-full text-organic-green">
                        <BookOpen size={14} />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-800 mt-1">{s.story}</p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                      {s.detail}
                    </p>
                    <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-organic-green uppercase tracking-wider">
                      <span>{isHindi ? 'पूरी कहानी पढ़ें' : 'Read Full Story'}</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Motivation Quote */}
        <div className="bg-gradient-to-br from-organic-green to-green-800 rounded-3xl p-6 text-white text-center shadow-lg">
          <Quote size={32} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-serif italic leading-relaxed">
            {isHindi 
              ? '"मिट्टी की सेवा ही असली समृद्धि है। जैविक अपनाएं, भविष्य बचाएं।"' 
              : '"Serving the soil is true prosperity. Adopt organic, save the future."'}
          </p>
        </div>
      </div>

      {/* Story Modal */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-lg rounded-t-[32px] p-6 pb-12 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-organic-green/10 flex items-center justify-center text-2xl">
                    {selectedStory.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-organic-green">
                      {isHindi ? selectedStory.hindiName : selectedStory.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                      {isHindi ? 'सफलता की कहानी' : 'Success Story'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStory(null)}
                  className="bg-gray-100 p-2 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-harvest-yellow/10 p-4 rounded-2xl border border-harvest-yellow/20">
                  <Quote size={24} className="text-harvest-yellow mb-2" />
                  <p className="text-lg font-bold text-organic-green leading-tight">
                    {selectedStory.story}
                  </p>
                </div>

                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {selectedStory.fullStory}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => setSelectedStory(null)}
                    className="btn-primary w-full"
                  >
                    {isHindi ? 'ठीक है' : 'Got it'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NaturalFarming = ({ isHindi }: { isHindi: boolean }) => {
  const [activeTab, setActiveTab] = useState<'pillars' | 'remedies' | 'comparison'>('pillars');

  const pillars = [
    {
      id: 'bijamrit',
      title: isHindi ? 'बीजामृत (Bijamrit)' : 'Bijamrit',
      subtitle: isHindi ? 'बीज उपचार' : 'Seed Treatment',
      icon: <Sprout size={24} />,
      desc: isHindi 
        ? 'बीज को रोगों और कीटों से सुरक्षित करने और अंकुरण क्षमता बढ़ाने के लिए।' 
        : 'To protect seeds from diseases and pests and increase germination capacity.',
      recipe: isHindi 
        ? '5L गोमूत्र, 50g चूना, 50g गोबर, 50g मिट्टी, 20L पानी। 15-20 मिनट भिगोएं।' 
        : '5L cow urine, 50g lime, 50g cow dung, 50g soil, 20L water. Soak for 15-20 mins.'
    },
    {
      id: 'jeevamrit',
      title: isHindi ? 'जीवामृत (Jeevamrit)' : 'Jeevamrit',
      subtitle: isHindi ? 'मिट्टी की उर्वरता' : 'Soil Fertility',
      icon: <Droplets size={24} />,
      desc: isHindi 
        ? 'मिट्टी में सूक्ष्मजीवों की संख्या बढ़ाने और पौधों को पोषण देने के लिए।' 
        : 'To increase microbial count in soil and provide nutrition to plants.',
      recipe: isHindi 
        ? '10kg गोबर, 10L गोमूत्र, 2kg गुड़, 2kg बेसन, मिट्टी, 200L पानी। 2-3 दिन रखें।' 
        : '10kg cow dung, 10L cow urine, 2kg jaggery, 2kg gram flour, soil, 200L water. Keep for 2-3 days.'
    },
    {
      id: 'mulching',
      title: isHindi ? 'आच्छादन (Mulching)' : 'Mulching',
      subtitle: isHindi ? 'मिट्टी का संरक्षण' : 'Soil Protection',
      icon: <Leaf size={24} />,
      desc: isHindi 
        ? 'नमी बनाए रखने और खरपतवार कम करने के लिए मिट्टी को ढकना।' 
        : 'Covering the soil to maintain moisture and reduce weeds.',
      recipe: isHindi 
        ? 'मिट्टी आच्छादन, फसल अवशेष आच्छादन (सूखी घास), या सजीव आच्छादन (मूंग, उड़द)।' 
        : 'Soil mulch, organic mulch (dry grass), or live mulch (moong, urad).'
    },
    {
      id: 'whapasa',
      title: isHindi ? 'वप्सा (Whapasa)' : 'Whapasa',
      subtitle: isHindi ? 'नमी और हवा' : 'Moisture & Air',
      icon: <Wind size={24} />,
      desc: isHindi 
        ? 'मिट्टी में नमी और हवा का संतुलन बनाए रखना ताकि सूक्ष्मजीव सक्रिय रहें।' 
        : 'Maintaining balance of moisture and air in soil for microbial activity.',
      recipe: isHindi 
        ? 'अत्यधिक सिंचाई न करें, केवल आवश्यकतानुसार जल दें। ड्रिप सिंचाई बेहतर है।' 
        : 'Avoid over-irrigation, water only as needed. Drip irrigation is better.'
    }
  ];

  const remedies = [
    {
      name: isHindi ? 'अग्नास्त्र (Agniastra)' : 'Agniastra',
      target: isHindi ? 'पत्ता लपेटक, फली छेदक, इल्लियां' : 'Leaf roller, Pod borer, Caterpillars',
      ingredients: isHindi 
        ? '10L गोमूत्र, 1kg ताज़ी नीम पत्तियां (कुटी हुई), 500g तंबाकू चूर्ण, 500g कुटा हुआ लहसुन, 500g हरी मिर्च पेस्ट।' 
        : '10L Cow urine, 1kg Fresh Neem leaves (crushed), 500g Tobacco powder, 500g Crushed Garlic, 500g Green chili paste.',
      method: isHindi 
        ? 'सभी को मिलाएं। धीमी आंच पर तब तक उबालें जब तक आयतन 20-30% कम न हो जाए (लगभग 30-45 मिनट)। छाया में रखें और कपड़े से ढक दें (हवाबंद न करें)। 48 घंटे ठंडा होने दें। छान लें।' 
        : 'Mix all. Boil on low flame until volume reduces by 20-30% (approx 30-45 mins). Keep in shade and cover with cloth (not airtight). Let it cool for 48 hours. Filter.',
      usage: isHindi 
        ? 'छिड़काव हेतु: 2L अग्नास्त्र को 100L पानी में मिलाएं। पहले छोटे क्षेत्र पर परीक्षण करें। सुबह या शाम को ही छिड़काव करें। हर 7-10 दिनों में दोहराएं।' 
        : 'For Spraying: Mix 2L Agniastra in 100L water. Test on a small area first. Spray only in morning or evening. Repeat every 7-10 days.',
      warning: isHindi ? 'फूल आने की अवस्था के दौरान उपयोग से बचें।' : 'Avoid use during flowering stage.'
    },
    {
      name: isHindi ? 'नीमास्त्र (Neemastra)' : 'Neemastra',
      target: isHindi ? 'रस चूसने वाले कीट, सफेद मक्खी, छोटे कीट' : 'Sucking pests, Whitefly, Small insects',
      ingredients: isHindi 
        ? '100L पानी, 5L गोमूत्र, 1kg गोबर, 5kg नीम की पत्तियां और फल (कुटा हुआ)।' 
        : '100L Water, 5L Cow urine, 1kg Cow dung, 5kg Neem leaves & fruits (crushed).',
      method: isHindi 
        ? 'सभी को मिलाएं। छाया में 48 घंटे तक किण्वन होने दें। दिन में दो बार लकड़ी से हिलाएं। छान लें।' 
        : 'Mix all. Let it ferment for 48 hours in shade. Stir twice daily with a stick. Filter.',
      usage: isHindi 
        ? 'छिड़काव हेतु: 5-10L नीमास्त्र को 100L पानी में मिलाएं। किण्वन के 24-48 घंटों के भीतर उपयोग करें।' 
        : 'For Spraying: Mix 5-10L Neemastra in 100L water. Use within 24-48 hours after fermentation.'
    },
    {
      name: isHindi ? 'ब्रह्मास्त्र (Brahmastra)' : 'Brahmastra',
      target: isHindi ? 'बड़ी इल्लियां, फल छेदक' : 'Large caterpillars, Fruit borer',
      ingredients: isHindi 
        ? '10L गोमूत्र, 3kg नीम पत्तियां, 2kg धतूरा, 2kg सीताफल, 2kg पपीता, 2kg करंज के पत्ते (सभी कुटे हुए)।' 
        : '10L Cow urine, 3kg Neem leaves, 2kg Datura, 2kg Custard apple, 2kg Papaya, 2kg Karanj leaves (all crushed).',
      method: isHindi 
        ? 'पत्तों को पीसकर गोमूत्र में मिलाएं। आधा रहने तक उबालें। 24 घंटे ठंडा होने दें। छान लें।' 
        : 'Grind leaves and mix in cow urine. Boil until volume is halved. Cool for 24 hours. Filter.',
      usage: isHindi 
        ? 'छिड़काव हेतु: 2-3L ब्रह्मास्त्र को 100L पानी में मिलाएं।' 
        : 'For Spraying: Mix 2-3L Brahmastra in 100L water.'
    }
  ];

  const safetyWarnings = [
    {
      hi: 'तैयार करते समय दस्ताने पहनें।',
      en: 'Wear gloves while preparing.'
    },
    {
      hi: 'आंखों और त्वचा के संपर्क से बचें।',
      en: 'Avoid contact with eyes and skin.'
    },
    {
      hi: 'बच्चों की पहुंच से दूर रखें।',
      en: 'Keep away from children.'
    }
  ];

  const scientificContext = [
    {
      title: isHindi ? 'प्राकृतिक जैव-कीटनाशक' : 'Natural Bio-pesticides',
      desc: isHindi 
        ? 'ये कीटों को दूर भगाने (Repellent effect) और उनकी खाने की क्षमता को रोकने (Anti-feedant activity) का काम करते हैं।' 
        : 'These work via repellent effect and anti-feedant activity against pests.'
    },
    {
      title: isHindi ? 'फसल-विशिष्ट प्रभाव' : 'Crop-specific Effectiveness',
      desc: isHindi 
        ? 'कपास और सब्जियों के लिए अत्यधिक प्रभावी। नाजुक पत्तेदार साग पर सावधानी से उपयोग करें।' 
        : 'Highly effective for Cotton and Vegetables. Use with caution on delicate leafy greens.'
    }
  ];

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-emerald-700">{isHindi ? 'प्राकृतिक खेती (ZBNF)' : 'Natural Farming (ZBNF)'}</h2>
        <p className="text-sm text-gray-600 leading-relaxed italic">
          {isHindi 
            ? '"प्रकृति के साथ सामंजस्य स्थापित कर खेती करना ही असली समृद्धि है।"' 
            : '"Farming in harmony with nature is true prosperity."'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('pillars')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'pillars' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}
        >
          {isHindi ? '4 स्तंभ' : '4 Pillars'}
        </button>
        <button 
          onClick={() => setActiveTab('remedies')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'remedies' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}
        >
          {isHindi ? 'कीट उपचार' : 'Remedies'}
        </button>
        <button 
          onClick={() => setActiveTab('comparison')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'comparison' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}
        >
          {isHindi ? 'तुलना' : 'Comparison'}
        </button>
      </div>

      {activeTab === 'pillars' && (
        <div className="space-y-4">
          {pillars.map((p) => (
            <div key={p.id} className="rural-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                  {p.icon}
                </div>
                <div>
                  <h4 className="font-bold text-emerald-800">{p.title}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{p.desc}</p>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <p className="text-xs font-bold text-emerald-800 mb-1">{isHindi ? 'विधि/सामग्री:' : 'Method/Recipe:'}</p>
                <p className="text-xs text-emerald-700 leading-relaxed">{p.recipe}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'remedies' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3">
            <FlaskConical className="text-amber-600 shrink-0" size={24} />
            <p className="text-xs text-amber-800 leading-relaxed">
              {isHindi 
                ? 'प्राकृतिक कीटनाशक रासायनिक कीटनाशकों का सुरक्षित विकल्प हैं। ये पर्यावरण को नुकसान नहीं पहुँचाते।' 
                : 'Natural pesticides are safe alternatives to chemical ones. They do not harm the environment.'}
            </p>
          </div>
          <div className="space-y-4">
            {remedies.map((r, i) => (
              <div key={i} className="rural-card p-4 space-y-3">
                <h4 className="font-bold text-xl text-emerald-800 border-b pb-2">{r.name}</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">{isHindi ? 'लक्ष्य कीट:' : 'Target Pests:'}</span>
                    <span className="text-xs font-bold text-red-600 text-right">{r.target}</span>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-700 uppercase">{isHindi ? 'सामग्री:' : 'Ingredients:'}</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{r.ingredients}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-700 uppercase">{isHindi ? 'बनाने की विधि:' : 'How to Prepare:'}</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{r.method}</p>
                    </div>
                    <div className="pt-1 border-t border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase">{isHindi ? 'छिड़काव हेतु उपयोग:' : 'Usage for Spraying:'}</p>
                      <p className="text-xs text-emerald-800 font-medium">{r.usage}</p>
                    </div>
                    {r.warning && (
                      <div className="pt-1 flex gap-1 items-start text-red-600">
                        <Info size={12} className="shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold italic">{r.warning}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Safety Warnings */}
          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-red-700">
              <Info size={20} />
              <h4 className="font-bold text-sm">{isHindi ? 'सुरक्षा सावधानियां' : 'Safety Precautions'}</h4>
            </div>
            <ul className="space-y-1">
              {safetyWarnings.map((w, i) => (
                <li key={i} className="text-xs text-red-800 flex gap-2">
                  <span>•</span>
                  <span>{isHindi ? w.hi : w.en}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="space-y-4">
          {/* Scientific Context */}
          <div className="grid grid-cols-1 gap-3">
            {scientificContext.map((c, i) => (
              <div key={i} className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <h5 className="font-bold text-emerald-800 text-sm mb-1">{c.title}</h5>
                <p className="text-xs text-emerald-700 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="rural-card overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-emerald-700 text-white">
                <tr>
                  <th className="p-3">{isHindi ? 'पहलू' : 'Aspect'}</th>
                  <th className="p-3">{isHindi ? 'जैविक' : 'Organic'}</th>
                  <th className="p-3">{isHindi ? 'प्राकृतिक' : 'Natural'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3 font-bold bg-gray-50">{isHindi ? 'लागत' : 'Cost'}</td>
                  <td className="p-3">{isHindi ? 'मध्यम' : 'Medium'}</td>
                  <td className="p-3 font-bold text-emerald-700">{isHindi ? 'बहुत कम' : 'Very Low'}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold bg-gray-50">{isHindi ? 'इनपुट' : 'Inputs'}</td>
                  <td className="p-3">{isHindi ? 'बाहरी खाद' : 'External Manure'}</td>
                  <td className="p-3 font-bold text-emerald-700">{isHindi ? 'स्थानीय संसाधन' : 'Local Resources'}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold bg-gray-50">{isHindi ? 'जुताई' : 'Tillage'}</td>
                  <td className="p-3">{isHindi ? 'अनुमति है' : 'Allowed'}</td>
                  <td className="p-3 font-bold text-emerald-700">{isHindi ? 'नहीं' : 'No Tillage'}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold bg-gray-50">{isHindi ? 'आधार' : 'Basis'}</td>
                  <td className="p-3">{isHindi ? 'रसायन मुक्त' : 'Chemical Free'}</td>
                  <td className="p-3 font-bold text-emerald-700">{isHindi ? 'सह-अस्तित्व' : 'Co-existence'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <h5 className="font-bold text-blue-800 text-sm mb-2">{isHindi ? 'वैज्ञानिक तथ्य:' : 'Scientific Facts:'}</h5>
            <ul className="space-y-2 text-xs text-blue-700">
              <li className="flex gap-2">
                <span>•</span>
                <span>{isHindi ? 'जीवामृत से लाभदायक बैक्टीरिया (Azotobacter) बढ़ते हैं।' : 'Jeevamrit increases beneficial bacteria (Azotobacter).'}</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>{isHindi ? 'प्राकृतिक खेती से मिट्टी की जल धारण क्षमता 25-30% बढ़ती है।' : 'Natural farming increases soil water holding capacity by 25-30%.'}</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>{isHindi ? 'कार्बन संचयन (Carbon Sequestration) में सुधार होता है।' : 'Improves Carbon Sequestration.'}</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const SoilTracker = ({ isHindi, onExpertClick }: { isHindi: boolean, onExpertClick: () => void }) => {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('soil_logs');
    return saved ? JSON.parse(saved) : [
      { date: '2025-01', ph: 6.5, carbon: 0.4, nitrogen: 120 },
      { date: '2025-04', ph: 6.6, carbon: 0.5, nitrogen: 135 },
      { date: '2025-08', ph: 6.8, carbon: 0.7, nitrogen: 150 },
      { date: '2026-01', ph: 7.0, carbon: 0.9, nitrogen: 170 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('soil_logs', JSON.stringify(logs));
  }, [logs]);

  const [showAdd, setShowAdd] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    ph: '',
    carbon: '',
    nitrogen: ''
  });

  const handleAddLog = () => {
    if (!newLog.ph || !newLog.carbon || !newLog.nitrogen) return;
    setLogs([...logs, {
      date: newLog.date,
      ph: parseFloat(newLog.ph),
      carbon: parseFloat(newLog.carbon),
      nitrogen: parseFloat(newLog.nitrogen)
    }]);
    setShowAdd(false);
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      ph: '',
      carbon: '',
      nitrogen: ''
    });
  };

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const latest = logs[logs.length - 1];
      const history = logs.map(l => `Date: ${l.date}, pH: ${l.ph}, Carbon: ${l.carbon}%, Nitrogen: ${l.nitrogen}`).join('\n');
      
      const prompt = `You are an expert Organic Farming Soil Scientist. 
      Analyze this farmer's soil health data and provide a concise, practical organic prescription in ${isHindi ? 'Hindi' : 'English'}.
      
      Current Data:
      - pH: ${latest.ph}
      - Organic Carbon: ${latest.carbon}%
      - Nitrogen: ${latest.nitrogen} kg/ha
      
      Historical Trend:
      ${history}
      
      Provide:
      1. Overall Health Assessment
      2. Specific Organic Amendments needed (e.g. Jeevamrit, Ghan-Jeevamrit, Green Manure)
      3. Next steps for the next 3 months.
      Keep it very practical for a small-scale farmer. Use bullet points.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setAiAnalysis(response.text);
    } catch (error) {
      console.error('AI Analysis error:', error);
      setAiAnalysis(isHindi ? "क्षमा करें, विश्लेषण विफल रहा। कृपया पुनः प्रयास करें।" : "Sorry, analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const latest = logs[logs.length - 1];

  const getHealthStatus = (carbon: number) => {
    if (carbon < 0.5) return { label: isHindi ? 'कम' : 'Low', color: 'text-red-600', bg: 'bg-red-100' };
    if (carbon < 0.8) return { label: isHindi ? 'मध्यम' : 'Medium', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: isHindi ? 'उत्तम' : 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const status = getHealthStatus(latest.carbon);

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-organic-green">{isHindi ? 'मिट्टी स्वास्थ्य ट्रैकर' : 'Soil Health Tracker'}</h2>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-organic-green text-white p-2 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* User Guide */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
        <div className="bg-blue-500 p-1.5 rounded-lg text-white shrink-0">
          <Info size={16} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            {isHindi ? 'उपयोग मार्गदर्शिका' : 'User Guide'}
          </h4>
          <p className="text-[11px] text-blue-600 leading-relaxed">
            {isHindi 
              ? "1. 'नया डेटा जोड़ें' बटन पर क्लिक करें। 2. अपनी मिट्टी परीक्षण रिपोर्ट से मान दर्ज करें। 3. 'एआई विश्लेषण' बटन दबाएं। एआई आपको सर्वोत्तम जैविक उपचार बताएगा।" 
              : "1. Click 'Add New Data' button. 2. Enter values from your soil test report. 3. Press 'AI Analysis' button. AI will suggest the best organic remedies."}
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="rural-card bg-white p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{isHindi ? 'वर्तमान स्थिति' : 'Current Status'}</p>
            <h3 className="text-3xl font-black text-organic-green mt-1">{isHindi ? 'स्वस्थ मिट्टी' : 'Healthy Soil'}</h3>
          </div>
          <div className={`${status.bg} ${status.color} px-3 py-1 rounded-full text-xs font-bold`}>
            {isHindi ? 'जैविक कार्बन: ' : 'Organic Carbon: '}{status.label}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase">{isHindi ? 'पीएच' : 'pH'}</p>
            <p className="text-xl font-black text-organic-green">{latest.ph}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase">{isHindi ? 'कार्बन' : 'Carbon'}</p>
            <p className="text-xl font-black text-organic-green">{latest.carbon}%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase">{isHindi ? 'नाइट्रोजन' : 'Nitrogen'}</p>
            <p className="text-xl font-black text-organic-green">{latest.nitrogen}</p>
          </div>
        </div>
      </div>

      {/* AI Analysis Button */}
      <button 
        onClick={handleAiAnalysis}
        disabled={isAnalyzing}
        className="w-full bg-gradient-to-r from-organic-green to-emerald-700 text-white p-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {isAnalyzing ? (
          <RefreshCcw size={20} className="animate-spin" />
        ) : (
          <Sun size={20} className="text-harvest-yellow" />
        )}
        {isHindi ? 'AI मिट्टी डॉक्टर से पूछें' : 'Ask AI Soil Doctor'}
      </button>

      {/* AI Analysis Result */}
      <AnimatePresence>
        {aiAnalysis && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-2 border-organic-green/20 rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-organic-green/10 p-1.5 rounded-lg">
                  <Sun size={16} className="text-organic-green" />
                </div>
                <h4 className="font-bold text-organic-green text-sm uppercase tracking-wider">
                  {isHindi ? 'AI जैविक परामर्श' : 'AI Organic Prescription'}
                </h4>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Organic Soil Prescription',
                        text: aiAnalysis,
                      });
                    }
                  }}
                  className="p-1.5 bg-gray-100 rounded-lg text-gray-500"
                >
                  <Share2 size={14} />
                </button>
                <button onClick={() => setAiAnalysis(null)} className="p-1.5 bg-gray-100 rounded-lg text-gray-500">
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none">
              <div className="whitespace-pre-line">
                {aiAnalysis}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charts */}
      <div className="rural-card p-4 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-organic-green" />
          <h3 className="font-bold text-gray-700">{isHindi ? 'प्रगति चार्ट' : 'Progress Chart'}</h3>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={logs}>
              <defs>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D5A27" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2D5A27" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="carbon" 
                stroke="#2D5A27" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCarbon)" 
                name={isHindi ? 'जैविक कार्बन' : 'Organic Carbon'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-center text-gray-400 font-medium italic">
          {isHindi ? '* जैविक कार्बन का स्तर समय के साथ बढ़ रहा है' : '* Organic carbon levels are increasing over time'}
        </p>
      </div>

      {/* History List */}
      <div className="space-y-4">
        <h3 className="font-bold text-organic-green flex items-center gap-2">
          <History size={18} />
          {isHindi ? 'इतिहास' : 'History'}
        </h3>
        <div className="space-y-2">
          {[...logs].reverse().map((log, idx) => (
            <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center group">
              <div>
                <p className="text-xs font-bold text-gray-400">{log.date}</p>
                <p className="text-sm font-bold text-gray-700">
                  {isHindi ? `कार्बन: ${log.carbon}% | पीएच: ${log.ph}` : `Carbon: ${log.carbon}% | pH: ${log.ph}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{isHindi ? 'नाइट्रोजन' : 'Nitrogen'}</p>
                  <p className="text-sm font-bold text-organic-green">{log.nitrogen}</p>
                </div>
                <button 
                  onClick={() => {
                    const newLogs = logs.filter((_, i) => (logs.length - 1 - i) !== idx);
                    setLogs(newLogs);
                  }}
                  className="p-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Log Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-organic-green">{isHindi ? 'नया डेटा जोड़ें' : 'Add New Data'}</h3>
                <button onClick={() => setShowAdd(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{isHindi ? 'तारीख' : 'Date'}</label>
                  <input 
                    type="date" 
                    value={newLog.date}
                    onChange={(e) => setNewLog({...newLog, date: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-organic-green"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{isHindi ? 'पीएच' : 'pH'}</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 7.0"
                      value={newLog.ph}
                      onChange={(e) => setNewLog({...newLog, ph: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-organic-green"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{isHindi ? 'कार्बन (%)' : 'Carbon (%)'}</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 0.8"
                      value={newLog.carbon}
                      onChange={(e) => setNewLog({...newLog, carbon: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-organic-green"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{isHindi ? 'नाइट्रोजन (kg/ha)' : 'Nitrogen (kg/ha)'}</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 150"
                    value={newLog.nitrogen}
                    onChange={(e) => setNewLog({...newLog, nitrogen: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-organic-green"
                  />
                </div>
              </div>

              <button 
                onClick={handleAddLog}
                className="w-full bg-organic-green text-white py-4 rounded-2xl font-bold shadow-lg shadow-organic-green/20 active:scale-95 transition-transform"
              >
                {isHindi ? 'डेटा सहेजें' : 'Save Data'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>(Screen.DASHBOARD);
  const [isHindi, setIsHindi] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [selectedStep, setSelectedStep] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const globalUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleExpertAccess = () => {
    setScreen(Screen.EXPERT_CONNECT);
  };

 const handleGlobalSpeak = async () => {
  try {
    await TextToSpeech.stop();

    let text = "";

    if (screen === Screen.DASHBOARD) {
      const advisory = getDailyAdvisory();
      text = isHindi
        ? `ऑर्गेनिक मित्र में आपका स्वागत है। आज की सलाह है: ${advisory.hi}`
        : `Welcome to Organic Mitra. Today's advisory is: ${advisory.en}`;
    } else if (screen === Screen.CROP_SELECTION) {
      text = isHindi
        ? "कृपया नीचे दी गई सूची से अपनी फसल चुनें।"
        : "Please select your crop from the list below.";
    } else if (screen === Screen.FARMING_GUIDE && selectedCrop) {
      text = isHindi
        ? `${selectedCrop.hindiName} के लिए जैविक खेती गाइड। नीचे दिए गए चरणों का पालन करें।`
        : `Organic farming guide for ${selectedCrop.name}. Please follow the steps below.`;
    } else if (screen === Screen.STEP_DETAIL && selectedStep) {
      const proTip = isHindi
        ? 'महत्वपूर्ण सुझाव: हमेशा सुबह या शाम को ही छिड़काव करें।'
        : 'Pro Tip: Always spray in the early morning or late evening.';

      text = `${isHindi ? selectedStep.hindiContent : selectedStep.content}. ${proTip}`;
    } else if (screen === Screen.PEST_IDENTIFIER) {
      text = isHindi
        ? "कीट और रोग पहचान। फोटो लेने के लिए बटन दबाएं।"
        : "Pest and disease identification. Press the button to take a photo.";
    } else if (screen === Screen.CALCULATOR) {
      text = isHindi
        ? "जैविक इनपुट कैलकुलेटर। अपनी भूमि का क्षेत्र दर्ज करें।"
        : "Organic input calculator. Enter your land area.";
    } else if (screen === Screen.EXPERT_CONNECT) {
      text = isHindi
        ? "विशेषज्ञ से जुड़ें। आप डॉ ए के सिंह को कॉल या चैट कर सकते हैं।"
        : "Expert connect. You can call or chat with Dr. A.K. Singh.";
    } else if (screen === Screen.MARKET_CERT) {
      text = isHindi
        ? "बाजार और प्रमाणन। यहाँ आप जैविक प्रमाणन और बाजारों की जानकारी पा सकते हैं।"
        : "Market and certification. Here you can find info on organic certification and markets.";
    } else if (screen === Screen.LEARNING_HUB) {
      text = isHindi
        ? "सीखें और बढ़ें। यहाँ प्रशिक्षण वीडियो और सफलता की कहानियां हैं।"
        : "Learning hub. Here are training videos and success stories.";
    } else if (screen === Screen.NATURAL_FARMING) {
      text = isHindi
        ? "प्राकृतिक खेती। यहाँ आप बीजामृत, जीवामृत और प्राकृतिक कीट उपचार के बारे में जान सकते हैं।"
        : "Natural farming. Here you can learn about Bijamrit, Jeevamrit and natural pest remedies.";
    }

    if (!text) return;

    await TextToSpeech.speak({
      text: cleanTextForSpeech(text, isHindi),
      lang: isHindi ? 'hi-IN' : 'en-US',
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
    });

  } catch (error) {
    console.warn('Native global text-to-speech failed:', error);
  }
};

  const handleSelectCrop = (crop: Crop) => {
    setSelectedCrop(crop);
    setScreen(Screen.FARMING_GUIDE);
  };

  const handleSelectStep = (step: any) => {
    setSelectedStep(step);
    setScreen(Screen.STEP_DETAIL);
  };

  const handleBack = () => {
    if (screen === Screen.STEP_DETAIL) {
      setScreen(Screen.FARMING_GUIDE);
    } else if (screen === Screen.FARMING_GUIDE) {
      setScreen(Screen.CROP_SELECTION);
    } else {
      setScreen(Screen.DASHBOARD);
    }
  };

  useEffect(() => {
    // Pre-load voices for TTS
    const loadVoices = () => {
      safeGetVoices();
    };
    loadVoices();
    
    try {
      const speech = getSafeSpeechSynthesis();
      if (speech && 'onvoiceschanged' in speech) {
        speech.onvoiceschanged = loadVoices;
      }
    } catch (e) {
      console.warn("Could not set onvoiceschanged handler:", e);
    }

    // Show splash screen for 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Trigger a soft greeting ONLY on initial load
      setTimeout(() => {
        handleGlobalSpeak();
      }, 500);
    }, 2500);
    return () => clearTimeout(timer);
  }, []); // Removed screen/isHindi dependencies to prevent auto-speaking on every navigation

  return (
    <div className="max-w-md mx-auto min-h-screen bg-soil-white shadow-2xl relative flex flex-col font-sans">
      <AnimatePresence>
        {isLoading && <SplashScreen isHindi={isHindi} />}
      </AnimatePresence>

      <Header 
        isHindi={isHindi} 
        setIsHindi={setIsHindi} 
        currentScreen={screen} 
        onBack={handleBack} 
        onSpeak={handleGlobalSpeak}
      />
      
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {screen === Screen.DASHBOARD && <Dashboard setScreen={setScreen} isHindi={isHindi} onExpertClick={handleExpertAccess} />}
            {screen === Screen.CROP_SELECTION && <CropSelection setScreen={setScreen} isHindi={isHindi} onSelectCrop={handleSelectCrop} />}
            {screen === Screen.FARMING_GUIDE && selectedCrop && <FarmingGuide crop={selectedCrop} isHindi={isHindi} onSelectStep={handleSelectStep} setScreen={setScreen} />}
            {screen === Screen.STEP_DETAIL && selectedStep && <StepDetail step={selectedStep} isHindi={isHindi} setScreen={setScreen} />}
            {screen === Screen.PEST_IDENTIFIER && <PestIdentifier isHindi={isHindi} onExpertClick={handleExpertAccess} />}
            {screen === Screen.CALCULATOR && <InputCalculator isHindi={isHindi} />}
            {screen === Screen.EXPERT_CONNECT && <ExpertConnect isHindi={isHindi} />}
            {screen === Screen.MARKET_CERT && <MarketCert isHindi={isHindi} />}
            {screen === Screen.LEARNING_HUB && <LearningHub isHindi={isHindi} />}
            {screen === Screen.NATURAL_FARMING && <NaturalFarming isHindi={isHindi} />}
            {screen === Screen.SOIL_TRACKER && <SoilTracker isHindi={isHindi} onExpertClick={handleExpertAccess} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Navigation currentScreen={screen} setScreen={setScreen} isHindi={isHindi} onExpertClick={handleExpertAccess} />
    </div>
  );
}
