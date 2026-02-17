import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { UserSettings, Location, PrayerTimesData, Language } from '../types';
import { fetchPrayerTimes } from '../services/prayerTimeService';
import { detectUserLanguage } from '../services/languageService';
import { logAnalyticsEvent, setAnalyticsUserProperties } from '../firebase/firebase';
import { detectCurrentLocation } from '../services/locationService';

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
const AUTO_REFRESH_INTERVAL_MS = 30 * 60 * 1000;

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
  const autoLocationCheckedRef = useRef(false);

  const refreshPrayerTimes = useCallback(async () => {
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

      logAnalyticsEvent('prayer_times_fetched', {
        calculationMethod: settings.calculationMethod,
        madhab: settings.madhab
      });
    } catch (err) {
      const errorMessage: Record<Language, string> = {
        en: 'Failed to fetch prayer times. Please try again later.',
        ru: 'Не удалось получить время молитв. Пожалуйста, попробуйте позже.',
        ar: 'فشل في جلب أوقات الصلاة. يرجى المحاولة مرة أخرى لاحقًا.',
        tr: 'Namaz vakitleri alınamadı. Lütfen daha sonra tekrar deneyin.',
        tt: 'Намаз вакытларын алып булмады. Зинһар, соңрак яңадан карагыз.'
      };
      setError(errorMessage[settings.language]);
      console.error(err);

      logAnalyticsEvent('prayer_times_error', {
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
        calculationMethod: settings.calculationMethod,
        madhab: settings.madhab
      });
    } finally {
      setLoading(false);
    }
  }, [location, settings.calculationMethod, settings.language, settings.madhab]);

  // Log first visit to analytics
  useEffect(() => {
    if (isFirstVisit) {
      logAnalyticsEvent('first_visit');
    }
  }, [isFirstVisit]);

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

      logAnalyticsEvent('location_updated', {
        hasCity: !!location.city,
        country: location.country || 'unknown'
      });
    }
  }, [location]);

  useEffect(() => {
    if (!location) return;
    void refreshPrayerTimes();
  }, [location, refreshPrayerTimes]);

  useEffect(() => {
    if (!location) return;

    const refreshTimer = window.setInterval(() => {
      void refreshPrayerTimes();
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(refreshTimer);
    };
  }, [location, refreshPrayerTimes]);

  useEffect(() => {
    if (!location) return;

    let midnightTimer: number | null = null;
    let isCancelled = false;

    const scheduleNextMidnightRefresh = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 5, 0);

      const delay = Math.max(nextMidnight.getTime() - now.getTime(), 0);
      midnightTimer = window.setTimeout(async () => {
        if (isCancelled) return;
        await refreshPrayerTimes();
        if (!isCancelled) {
          scheduleNextMidnightRefresh();
        }
      }, delay);
    };

    scheduleNextMidnightRefresh();

    return () => {
      isCancelled = true;
      if (midnightTimer !== null) {
        window.clearTimeout(midnightTimer);
      }
    };
  }, [location, refreshPrayerTimes]);

  useEffect(() => {
    if (autoLocationCheckedRef.current) {
      return;
    }
    autoLocationCheckedRef.current = true;

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }

    let isCancelled = false;

    const shouldAutoDetect = async (): Promise<boolean> => {
      if (!location) {
        return true;
      }

      if (!navigator.permissions?.query) {
        return false;
      }

      try {
        const permissionStatus = await navigator.permissions.query({
          name: 'geolocation' as PermissionName
        });
        return permissionStatus.state === 'granted';
      } catch {
        return false;
      }
    };

    const detectAndUpdateLocation = async () => {
      const shouldDetect = await shouldAutoDetect();
      if (!shouldDetect) {
        return;
      }

      try {
        const detectedLocation = await detectCurrentLocation({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000
        });

        if (isCancelled) return;

        setLocationState((previousLocation) => {
          const nextCity = detectedLocation.city ?? previousLocation?.city;
          const nextCountry = detectedLocation.country ?? previousLocation?.country;

          if (
            previousLocation &&
            Math.abs(previousLocation.latitude - detectedLocation.latitude) < 0.0001 &&
            Math.abs(previousLocation.longitude - detectedLocation.longitude) < 0.0001 &&
            previousLocation.city === nextCity &&
            previousLocation.country === nextCountry
          ) {
            return previousLocation;
          }

          return {
            latitude: detectedLocation.latitude,
            longitude: detectedLocation.longitude,
            city: nextCity,
            country: nextCountry
          };
        });
      } catch (autoLocationError) {
        console.warn('Automatic geolocation detection failed:', autoLocationError);
      }
    };

    void detectAndUpdateLocation();

    return () => {
      isCancelled = true;
    };
  }, [location]);

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
