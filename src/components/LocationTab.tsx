import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { popularCities } from '../data/cities';
import { MapPin, Navigation, Search, X, Check, Locate, Globe } from 'lucide-react';
import { Location, City } from '../types';
import useLocalization from '../hooks/useLocalization';
import { detectCurrentLocation } from '../services/locationService';

const LocationTab: React.FC = () => {
  const { location, setLocation } = useAppContext();
  const { t, isRTL } = useLocalization();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const detectLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const detectedLocation = await detectCurrentLocation();
      const newLocation: Location = {
        ...detectedLocation,
        city: detectedLocation.city || t('common.unknown'),
        country: detectedLocation.country || t('common.unknown')
      };
      setLocation(newLocation);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('common.unknown');
      setError(t('location.errorGettingLocation', { message }));
    } finally {
      setLoading(false);
    }
  };

  const selectCity = (city: City) => {
    setLocation({
      latitude: city.latitude,
      longitude: city.longitude,
      city: city.name,
      country: city.country
    });
  };

  const filteredCities = useMemo(() =>
    popularCities.filter(city =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]
  );

  // Group cities by country
  const groupedCities = useMemo(() => {
    const groups: Record<string, City[]> = {};
    filteredCities.forEach(city => {
      if (!groups[city.country]) groups[city.country] = [];
      groups[city.country].push(city);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredCities]);

  const showNotFoundMessage = searchQuery.length > 0 && filteredCities.length === 0;

  return (
    <div className={`${isRTL ? 'text-right' : ''}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-100">
          {t('location.locationSettings')}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {t('location.description')}
        </p>
      </div>

      {/* ═══════════ CURRENT LOCATION CARD ═══════════ */}
      {location && (
        <div className="glass-card rounded-2xl p-5 mb-4 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-12 -mt-12 blur-2xl" />

          <div className="relative flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/15">
              <MapPin className="text-emerald-400" size={22} />
            </div>
            <div className={`flex-1 min-w-0 ${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-xs text-emerald-400/70 font-medium uppercase tracking-wider mb-1">
                {t('location.currentLocation')}
              </p>
              {location.city ? (
                <>
                  <p className="text-lg font-semibold text-gray-100 truncate">{location.city}</p>
                  <p className="text-sm text-gray-500">{location.country}</p>
                </>
              ) : (
                <p className="text-sm text-gray-400 tabular-nums">
                  {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse-soft" />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ DETECT LOCATION ═══════════ */}
      <button
        onClick={detectLocation}
        disabled={loading}
        className="w-full glass-card rounded-2xl p-4 flex items-center transition-all duration-300 group hover:bg-white/[0.04] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${loading
          ? 'bg-gradient-to-br from-emerald-500/30 to-emerald-600/20'
          : 'bg-gradient-to-br from-blue-500/20 to-blue-600/10'
          }`}>
          {loading ? (
            <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
          ) : (
            <Locate className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300" size={20} />
          )}
        </div>
        <div className={`flex-1 ${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'}`}>
          <p className="font-medium text-gray-200 group-hover:text-gray-100 transition-colors duration-200">
            {t('location.detectMyLocation')}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {loading
              ? t('location.detecting')
              : t('location.detectDescription')}
          </p>
        </div>
        <Navigation size={16} className={`text-gray-600 group-hover:text-blue-400 transition-all duration-300 flex-shrink-0 ${loading ? 'animate-pulse' : ''}`} />
      </button>

      {error && (
        <div className="glass-card rounded-2xl p-4 mb-4 border-red-800/20 bg-red-900/10">
          <p className="flex items-center text-red-400 text-sm">
            <X className={`${isRTL ? 'ml-2' : 'mr-2'} flex-shrink-0`} size={16} />
            {error}
          </p>
        </div>
      )}

      {/* ═══════════ DIVIDER ═══════════ */}
      <div className="py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">
            {t('location.orSelectCity')}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
      </div>

      {/* ═══════════ SEARCH ═══════════ */}
      <div className="relative mb-5">
        <input
          type="text"
          placeholder={t('location.searchCities')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`
            w-full py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] 
            focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/20 
            transition-all duration-300 text-gray-100 placeholder-gray-600
            ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-10'}
          `}
        />
        <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-600`} size={18} />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors p-1 rounded-lg hover:bg-white/[0.06]`}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ═══════════ NOT FOUND ═══════════ */}
      {showNotFoundMessage && (
        <div className="text-center py-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <Globe className="text-amber-400" size={28} />
          </div>
          <p className="text-gray-400 text-sm">
            {t('location.notFoundInCityList', { query: searchQuery })}
          </p>
          <p className="text-gray-600 text-xs mt-2">
            {t('location.tryDetect')}
          </p>
        </div>
      )}

      {/* ═══════════ CITY LIST (grouped by country) ═══════════ */}
      <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
        {groupedCities.map(([country, cities]) => (
          <div key={country}>
            {/* Country header */}
            <div className="flex items-center mb-2 px-1">
              <p className="text-xs text-gray-600 uppercase tracking-wider font-medium">{country}</p>
              <div className={`flex-1 h-px bg-white/[0.04] ${isRTL ? 'mr-3' : 'ml-3'}`} />
            </div>

            {/* Cities grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cities.map(city => {
                const isSelected = location?.city === city.name;
                return (
                  <button
                    key={city.id}
                    onClick={() => selectCity(city)}
                    className={`
                      relative flex items-center p-3.5 rounded-xl transition-all duration-300
                      ${isSelected
                        ? 'bg-emerald-500/10 border border-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.06)]'
                        : 'glass-card hover:bg-white/[0.04]'}
                      ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300
                      ${isSelected
                        ? 'bg-emerald-500/20'
                        : 'bg-white/[0.04]'}
                    `}>
                      {isSelected ? (
                        <Check className="text-emerald-400" size={16} />
                      ) : (
                        <MapPin className="text-gray-600" size={14} />
                      )}
                    </div>
                    <div className={`min-w-0 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                      <p className={`font-medium text-sm truncate ${isSelected ? 'text-emerald-400' : 'text-gray-200'}`}>
                        {city.name}
                      </p>
                    </div>
                    {isSelected && (
                      <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] flex-shrink-0`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationTab;
