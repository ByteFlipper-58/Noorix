import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSettings, Location, PrayerTimesData, CalculationMethod, MadhabType, Language } from '../types';
import { fetchPrayerTimes } from '../services/prayerTimeService';
import { detectUserLanguage } from '../services/languageService';

interface AppContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  location: Location | null;
  setLocation: (location: Location) => void;
  prayerTimes: PrayerTimesData | null;
  loading: boolean;
  error: string | null;
  refreshPrayerTimes: () => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const defaultSettings: UserSettings = {
  calculationMethod: 3, // Muslim World League
  madhab: 0, // Shafi'i
  timeFormat: '24h',
  language: detectUserLanguage(),
  notifications: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem('prayerTimeSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  const [location, setLocationState] = useState<Location | null>(() => {
    const savedLocation = localStorage.getItem('prayerTimeLocation');
    return savedLocation ? JSON.parse(savedLocation) : null;
  });

  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('prayer');

  useEffect(() => {
    localStorage.setItem('prayerTimeSettings', JSON.stringify(settings));
    
    // Always apply dark mode
    document.documentElement.classList.add('dark');
    
    // Apply RTL direction for Arabic
    if (settings.language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = settings.language;
    }
  }, [settings]);

  useEffect(() => {
    if (location) {
      localStorage.setItem('prayerTimeLocation', JSON.stringify(location));
      refreshPrayerTimes();
    }
  }, [location, settings.calculationMethod, settings.madhab]);

  const setLocation = (newLocation: Location) => {
    setLocationState(newLocation);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const refreshPrayerTimes = async () => {
    if (!location) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchPrayerTimes(
        location.latitude,
        location.longitude,
        settings.calculationMethod,
        settings.madhab
      );
      setPrayerTimes(data);
    } catch (err) {
      const errorMessage = {
        'en': 'Failed to fetch prayer times. Please try again later.',
        'ru': 'Не удалось получить время молитв. Пожалуйста, попробуйте позже.',
        'ar': 'فشل في جلب أوقات الصلاة. يرجى المحاولة مرة أخرى لاحقًا.'
      };
      setError(errorMessage[settings.language]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        location,
        setLocation,
        prayerTimes,
        loading,
        error,
        refreshPrayerTimes,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};