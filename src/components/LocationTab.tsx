import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { popularCities } from '../data/cities';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Location, City } from '../types';
import useLocalization from '../hooks/useLocalization';

const LocationTab: React.FC = () => {
  const { location, setLocation, settings } = useAppContext();
  const { t, isRTL } = useLocalization();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const detectLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError(t('location.geolocationNotSupported'));
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
                t('common.unknown');
              newLocation.country = data.address.country || 
                t('common.unknown');
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
        setError(t('location.errorGettingLocation', { message: error.message }));
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
    <div className={`${isRTL ? 'text-right' : ''} max-w-4xl mx-auto`}>
      <h2 className="text-2xl font-semibold mb-4">
        {t('location.locationSettings')}
      </h2>
      
      <div className="mb-6">
        <button
          onClick={detectLocation}
          disabled={loading}
          className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></span>
          ) : (
            <Navigation className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={20} />
          )}
          {t('location.detectMyLocation')}
        </button>
        
        {error && (
          <p className="mt-3 text-red-400 text-sm">{error}</p>
        )}
        
        {location && (
          <div className="mt-4 p-4 bg-gray-800 rounded-xl shadow-sm">
            <h3 className="font-medium mb-3 text-lg">
              {t('location.currentLocation')}
            </h3>
            <div className="flex items-start">
              <MapPin className={`text-green-400 mt-0.5 ${isRTL ? 'ml-2' : 'mr-2'} flex-shrink-0`} size={20} />
              <div>
                {location.city ? (
                  <p className="text-lg">{location.city}, {location.country}</p>
                ) : (
                  <p>
                    {t('location.latitude')}: {location.latitude.toFixed(4)}, 
                    {t('location.longitude')}: {location.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-5">
        <h3 className="font-medium mb-3 text-xl">
          {t('location.orSelectCity')}
        </h3>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={t('location.searchCities')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border dark:border-gray-700 rounded-xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg`}
          />
          <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-3.5 text-gray-400`} size={20} />
        </div>
      </div>
      
      {showNotFoundMessage && (
        <div className="mb-5 p-4 bg-amber-900/20 border border-amber-800 rounded-xl text-amber-300">
          <p className="flex items-center">
            <MapPin className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={20} />
            {t('location.notFoundInCityList', { query: searchQuery })}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
        {filteredCities.map(city => (
          <button
            key={city.id}
            onClick={() => selectCity(city)}
            className={`
              text-left p-3 rounded-xl transition-colors
              ${location?.city === city.name 
                ? 'bg-green-900/20 dark:border-green-800 border' 
                : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'}
              ${isRTL ? 'text-right' : ''}
            `}
          >
            <p className="font-medium text-lg">{city.name}</p>
            <p className="text-sm text-gray-400">{city.country}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationTab;