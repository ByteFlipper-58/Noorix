import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSettings, Location, PrayerTimesData, CalculationMethod, MadhabType, Language } from '../types';
import { fetchPrayerTimes } from '../services/prayerTimeService';
import { detectUserLanguage } from '../services/languageService';
import { logAnalyticsEvent, setAnalyticsUserProperties } from '../firebase/firebase';

interface AppContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  location: Location | null;
  setLocation: (location: Location) => void;
  prayerTimes: PrayerTimesData | null;
  loading: boolean;
  error: string | null;
  refreshPrayerTimes: () => Promise<void>;
  isFirstVisit: boolean;
  setIsFirstVisit: (value: boolean) => void;
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
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
    return localStorage.getItem('noorixFirstVisit') !== 'false';
  });

  // Log first visit to analytics
  useEffect(() => {
    if (isFirstVisit) {
      logAnalyticsEvent('first_visit');
    }
  }, []);

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

    // Log settings changes to analytics
    setAnalyticsUserProperties({
      language: settings.language,
      calculationMethod: settings.calculationMethod,
      madhab: settings.madhab,
      timeFormat: settings.timeFormat,
      notificationsEnabled: settings.notifications
    });
    
    logAnalyticsEvent('settings_updated', {
      language: settings.language,
      calculationMethod: settings.calculationMethod,
      madhab: settings.madhab,
      timeFormat: settings.timeFormat,
      notificationsEnabled: settings.notifications
    });
  }, [settings]);

  useEffect(() => {
    if (location) {
      localStorage.setItem('prayerTimeLocation', JSON.stringify(location));
      refreshPrayerTimes();
      
      // Log location changes to analytics
      logAnalyticsEvent('location_updated', {
        hasCity: !!location.city,
        country: location.country || 'unknown'
      });
    }
  }, [location, settings.calculationMethod, settings.madhab]);

  useEffect(() => {
    if (!isFirstVisit) {
      localStorage.setItem('noorixFirstVisit', 'false');
    }
  }, [isFirstVisit]);

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
      
      // Log successful prayer times fetch
      logAnalyticsEvent('prayer_times_fetched', {
        calculationMethod: settings.calculationMethod,
        madhab: settings.madhab
      });
    } catch (err) {
      const errorMessage: Record<Language, string> = {
        'en': 'Failed to fetch prayer times. Please try again later.',
        'ru': 'Не удалось получить время молитв. Пожалуйста, попробуйте позже.',
        'ar': 'فشل في جلب أوقات الصلاة. يرجى المحاولة مرة أخرى لاحقًا.',
        'tr': 'Namaz vakitleri alınamadı. Lütfen daha sonra tekrar deneyin.',
        'tt': 'Намаз вакытларын алып булмады. Зинһар, соңрак яңадан карагыз.'
      };
      setError(errorMessage[settings.language]);
      console.error(err);
      
      // Log error to analytics
      logAnalyticsEvent('prayer_times_error', {
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
        calculationMethod: settings.calculationMethod,
        madhab: settings.madhab
      });
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
        isFirstVisit,
        setIsFirstVisit
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