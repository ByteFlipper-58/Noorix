import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { popularCities } from '../data/cities';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Location, City } from '../types';

const LocationTab: React.FC = () => {
  const { location, setLocation, settings } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isRTL = settings.language === 'ar';
  
  const translations = {
    locationSettings: {
      en: 'Location Settings',
      ru: 'Настройки местоположения',
      ar: 'إعدادات الموقع'
    },
    detectMyLocation: {
      en: 'Detect My Location',
      ru: 'Определить моё местоположение',
      ar: 'تحديد موقعي'
    },
    currentLocation: {
      en: 'Current Location',
      ru: 'Текущее местоположение',
      ar: 'الموقع الحالي'
    },
    latitude: {
      en: 'Latitude',
      ru: 'Широта',
      ar: 'خط العرض'
    },
    longitude: {
      en: 'Longitude',
      ru: 'Долгота',
      ar: 'خط الطول'
    },
    orSelectCity: {
      en: 'Or Select a City',
      ru: 'Или выберите город',
      ar: 'أو اختر مدينة'
    },
    searchCities: {
      en: 'Search cities...',
      ru: 'Поиск городов...',
      ar: 'البحث عن المدن...'
    },
    notFoundInCityList: {
      en: (query: string) => `"${query}" not found in our city list. Please use "Detect My Location" instead.`,
      ru: (query: string) => `"${query}" не найден в нашем списке городов. Пожалуйста, используйте "Определить моё местоположение".`,
      ar: (query: string) => `"${query}" غير موجود في قائمة المدن لدينا. يرجى استخدام "تحديد موقعي" بدلاً من ذلك.`
    },
    geolocationNotSupported: {
      en: 'Geolocation is not supported by your browser',
      ru: 'Геолокация не поддерживается вашим браузером',
      ar: 'تحديد الموقع الجغرافي غير مدعوم من متصفحك'
    },
    errorGettingLocation: {
      en: (message: string) => `Error getting location: ${message}`,
      ru: (message: string) => `Ошибка получения местоположения: ${message}`,
      ar: (message: string) => `خطأ في الحصول على الموقع: ${message}`
    },
    unknown: {
      en: 'Unknown',
      ru: 'Неизвестно',
      ar: 'غير معروف'
    }
  };
  
  const detectLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError(translations.geolocationNotSupported[settings.language]);
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        // Try to get city name using reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.latitude}&lon=${newLocation.longitude}`)
          .then(response => response.json())
          .then(data => {
            if (data.address) {
              newLocation.city = data.address.city || data.address.town || data.address.village || 
                translations.unknown[settings.language];
              newLocation.country = data.address.country || 
                translations.unknown[settings.language];
            }
            setLocation(newLocation);
            setLoading(false);
          })
          .catch(() => {
            // If reverse geocoding fails, still set the location with coordinates only
            setLocation(newLocation);
            setLoading(false);
          });
      },
      (error) => {
        setError(translations.errorGettingLocation[settings.language](error.message));
        setLoading(false);
      }
    );
  };
  
  const selectCity = (city: City) => {
    setLocation({
      latitude: city.latitude,
      longitude: city.longitude,
      city: city.name,
      country: city.country
    });
  };
  
  const filteredCities = popularCities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const showNotFoundMessage = searchQuery.length > 0 && filteredCities.length === 0;
  
  return (
    <div className={`${isRTL ? 'text-right' : ''}`}>
      <h2 className="text-xl font-semibold mb-4">
        {translations.locationSettings[settings.language]}
      </h2>
      
      <div className="mb-6">
        <button
          onClick={detectLocation}
          disabled={loading}
          className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
          ) : (
            <Navigation className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={18} />
          )}
          {translations.detectMyLocation[settings.language]}
        </button>
        
        {error && (
          <p className="mt-2 text-red-400 text-sm">{error}</p>
        )}
        
        {location && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">
              {translations.currentLocation[settings.language]}
            </h3>
            <div className="flex items-start">
              <MapPin className={`text-green-400 mt-0.5 ${isRTL ? 'ml-2' : 'mr-2'} flex-shrink-0`} size={18} />
              <div>
                {location.city ? (
                  <p>{location.city}, {location.country}</p>
                ) : (
                  <p>
                    {translations.latitude[settings.language]}: {location.latitude.toFixed(4)}, 
                    {translations.longitude[settings.language]}: {location.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium mb-3">
          {translations.orSelectCity[settings.language]}
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder={translations.searchCities[settings.language]}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border dark:border-gray-700 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5 text-gray-400`} size={18} />
        </div>
      </div>
      
      {showNotFoundMessage && (
        <div className="mb-4 p-4 bg-amber-900/20 border border-amber-800 rounded-lg text-amber-300">
          <p className="flex items-center">
            <MapPin className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={18} />
            {translations.notFoundInCityList[settings.language](searchQuery)}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
        {filteredCities.map(city => (
          <button
            key={city.id}
            onClick={() => selectCity(city)}
            className={`
              text-left p-3 rounded-lg transition-colors
              ${location?.city === city.name 
                ? 'bg-green-900/20 dark:border-green-800 border' 
                : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'}
              ${isRTL ? 'text-right' : ''}
            `}
          >
            <p className="font-medium">{city.name}</p>
            <p className="text-sm text-gray-400">{city.country}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationTab;