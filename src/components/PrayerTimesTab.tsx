import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatTime, getNextPrayer, scheduleNotification } from '../services/prayerTimeService';
import { Clock, AlertCircle, MapPin, MoveRight } from 'lucide-react';
import { NextPrayer } from '../types';
import { getMoonPhaseEmoji, getMoonPhaseName } from '../data/cities';
import IftarTimer from './IftarTimer';
import { getPrayerNameTranslation } from '../services/languageService';

const PrayerTimesTab: React.FC = () => {
  const { prayerTimes, loading, error, settings, location, setActiveTab } = useAppContext();
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [moonPhase, setMoonPhase] = useState<number>(0);
  
  const isRTL = settings.language === 'ar';
  
  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    // Calculate moon phase
    const calculateMoonPhase = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      // Calculate approximate moon phase using a simple algorithm
      // 29.53 days is the average length of a lunar month
      const lp = 2551443; // Moon phase cycle in seconds
      const now = new Date(year, month - 1, day, 20, 35, 0).getTime() / 1000;
      const newMoon = new Date(2000, 0, 6, 18, 14, 0).getTime() / 1000;
      const phase = ((now - newMoon) % lp) / lp;
      
      setMoonPhase(phase);
    };
    
    calculateMoonPhase();
  }, []);
  
  useEffect(() => {
    if (prayerTimes && prayerTimes.timings) {
      try {
        const next = getNextPrayer(prayerTimes);
        setNextPrayer(next);
        
        // Schedule notification for next prayer if enabled
        if (settings.notifications) {
          scheduleNotification(next.name, next.time);
        }
      } catch (err) {
        console.error('Error calculating next prayer:', err);
      }
    }
  }, [prayerTimes, currentTime, settings.notifications]);
  
  const translations = {
    noLocationSelected: {
      en: 'No Location Selected',
      ru: 'Местоположение не выбрано',
      ar: 'لم يتم تحديد الموقع'
    },
    pleaseSetLocation: {
      en: 'Please set your location to see prayer times',
      ru: 'Пожалуйста, укажите ваше местоположение, чтобы увидеть время молитв',
      ar: 'يرجى تحديد موقعك لرؤية أوقات الصلاة'
    },
    goToLocationSettings: {
      en: 'Go to Location Settings',
      ru: 'Перейти к настройкам местоположения',
      ar: 'الذهاب إلى إعدادات الموقع'
    },
    nextPrayer: {
      en: 'Next Prayer',
      ru: 'Следующая молитва',
      ar: 'الصلاة القادمة'
    },
    currentLocation: {
      en: 'Current Location',
      ru: 'Текущее местоположение',
      ar: 'الموقع الحالي'
    },
    currentMoonPhase: {
      en: 'Current Moon Phase',
      ru: 'Текущая фаза Луны',
      ar: 'طور القمر الحالي'
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
        <div className="flex items-center">
          <AlertCircle className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={20} />
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!prayerTimes || !location) {
    return (
      <div className="text-center py-10">
        <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
        <h2 className="text-xl font-semibold mb-2">
          {translations.noLocationSelected[settings.language]}
        </h2>
        <p className="text-gray-400 mb-6">
          {translations.pleaseSetLocation[settings.language]}
        </p>
        <button 
          onClick={() => setActiveTab('location')}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center mx-auto"
        >
          <MapPin size={18} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
          {translations.goToLocationSettings[settings.language]}
          <MoveRight size={18} className={`${isRTL ? 'mr-2' : 'ml-2'}`} />
        </button>
      </div>
    );
  }
  
  const formatPrayerTime = (time: string) => {
    return formatTime(time, settings.timeFormat);
  };
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString(
    settings.language === 'en' ? 'en-US' : 
    settings.language === 'ru' ? 'ru-RU' : 'ar-SA', 
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );
  
  // Safely access Hijri date
  const hijriDate = prayerTimes.date?.hijri;
  const formattedHijriDate = hijriDate 
    ? `${hijriDate.day} ${settings.language === 'ar' ? hijriDate.month.ar : hijriDate.month.en} ${hijriDate.year} ${
        settings.language === 'en' ? 'AH' : 
        settings.language === 'ru' ? 'г.х.' : 'هـ'
      }`
    : '';
  
  const moonEmoji = getMoonPhaseEmoji(moonPhase);
  const phaseName = getMoonPhaseName(moonPhase, settings.language);
  
  return (
    <div className={`${isRTL ? 'text-right' : ''}`}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">{formattedDate}</h2>
        {formattedHijriDate && <p className="text-gray-400">{formattedHijriDate}</p>}
        <p className="text-sm mt-1">
          {location.city ? `${location.city}, ${location.country}` : translations.currentLocation[settings.language]}
        </p>
      </div>
      
      {nextPrayer && nextPrayer.name !== 'Unknown' && (
        <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-green-400 mb-1">
            {translations.nextPrayer[settings.language]}
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-green-300">{getPrayerNameTranslation(nextPrayer.name, settings.language)}</p>
              <p className="text-green-400">{formatPrayerTime(nextPrayer.time)}</p>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded-lg shadow-sm">
              <div className="flex items-center text-green-400">
                <Clock size={16} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
                <span className="font-medium">{nextPrayer.countdown}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Iftar Timer */}
      <IftarTimer className="mb-6" />
      
      <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="divide-y divide-gray-700">
          {prayerTimes.timings && (
            <>
              <PrayerTimeRow 
                name={getPrayerNameTranslation('Fajr', settings.language)} 
                time={formatPrayerTime(prayerTimes.timings.Fajr)} 
                isNext={nextPrayer?.name === 'Fajr'} 
                isRTL={isRTL}
              />
              <PrayerTimeRow 
                name={getPrayerNameTranslation('Sunrise', settings.language)} 
                time={formatPrayerTime(prayerTimes.timings.Sunrise)} 
                isInfo 
                isRTL={isRTL}
              />
              <PrayerTimeRow 
                name={getPrayerNameTranslation('Dhuhr', settings.language)} 
                time={formatPrayerTime(prayerTimes.timings.Dhuhr)} 
                isNext={nextPrayer?.name === 'Dhuhr'} 
                isRTL={isRTL}
              />
              <PrayerTimeRow 
                name={getPrayerNameTranslation('Asr', settings.language)} 
                time={formatPrayerTime(prayerTimes.timings.Asr)} 
                isNext={nextPrayer?.name === 'Asr'} 
                isRTL={isRTL}
              />
              <PrayerTimeRow 
                name={getPrayerNameTranslation('Maghrib', settings.language)} 
                time={formatPrayerTime(prayerTimes.timings.Maghrib)} 
                isNext={nextPrayer?.name === 'Maghrib'} 
                isIftar 
                iftarLabel={
                  settings.language === 'en' ? 'Iftar' : 
                  settings.language === 'ru' ? 'Ифтар' : 'إفطار'
                } 
                isRTL={isRTL}
              />
              <PrayerTimeRow 
                name={getPrayerNameTranslation('Isha', settings.language)} 
                time={formatPrayerTime(prayerTimes.timings.Isha)} 
                isNext={nextPrayer?.name === 'Isha'} 
                isRTL={isRTL}
              />
            </>
          )}
        </div>
      </div>
      
      {/* Moon Phase */}
      <div className="bg-gray-800/50 rounded-lg p-4 flex items-center">
        <div className="text-4xl mr-3">{moonEmoji}</div>
        <div>
          <h3 className="font-medium text-gray-300">
            {translations.currentMoonPhase[settings.language]}
          </h3>
          <p className="text-gray-400">{phaseName}</p>
        </div>
      </div>
    </div>
  );
};

interface PrayerTimeRowProps {
  name: string;
  time: string;
  isNext?: boolean;
  isInfo?: boolean;
  isIftar?: boolean;
  iftarLabel?: string;
  isRTL?: boolean;
}

const PrayerTimeRow: React.FC<PrayerTimeRowProps> = ({ 
  name, 
  time, 
  isNext, 
  isInfo, 
  isIftar, 
  iftarLabel = 'Iftar',
  isRTL = false
}) => {
  return (
    <div className={`
      flex justify-between items-center p-4
      ${isNext ? 'bg-green-900/20' : ''}
      ${isInfo ? 'bg-gray-700/30 text-gray-400' : ''}
    `}>
      <div className="flex items-center">
        <span className={`
          font-medium
          ${isNext ? 'text-green-400' : ''}
        `}>
          {name}
        </span>
        {isIftar && (
          <span className={`${isRTL ? 'mr-2' : 'ml-2'} px-2 py-0.5 bg-amber-900/30 text-amber-400 text-xs rounded-full`}>
            {iftarLabel}
          </span>
        )}
      </div>
      <span className={`
        ${isNext ? 'text-green-400 font-medium' : ''}
      `}>
        {time}
      </span>
    </div>
  );
};

export default PrayerTimesTab;