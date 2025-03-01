import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Clock, Utensils, Sunrise } from 'lucide-react';

interface IftarTimerProps {
  className?: string;
}

const IftarTimer: React.FC<IftarTimerProps> = ({ className = '' }) => {
  const { prayerTimes, settings } = useAppContext();
  const [countdown, setCountdown] = useState<string>('');
  const [isIftarTime, setIsIftarTime] = useState<boolean>(false);
  
  const isRTL = settings.language === 'ar';
  
  const translations = {
    iftarTime: {
      en: 'Iftar Time',
      ru: 'Время Ифтара',
      ar: 'وقت الإفطار'
    },
    timeUntilIftar: {
      en: 'Time Until Iftar',
      ru: 'Время до Ифтара',
      ar: 'الوقت حتى الإفطار'
    },
    timeUntilSuhoorEnds: {
      en: 'Time until Suhoor ends:',
      ru: 'Время до окончания Сухура:',
      ar: 'الوقت حتى نهاية السحور:'
    },
    timeUntilBreakingFast: {
      en: 'Time until breaking fast:',
      ru: 'Время до разговения:',
      ar: 'الوقت حتى الإفطار:'
    }
  };
  
  useEffect(() => {
    if (!prayerTimes || !prayerTimes.timings) return;
    
    const updateTimer = () => {
      const now = new Date();
      const maghribTime = prayerTimes.timings.Maghrib;
      const fajrTime = prayerTimes.timings.Fajr;
      
      if (!maghribTime || !fajrTime) return;
      
      // Clean time strings (remove any timezone info)
      const cleanMaghribTime = maghribTime.split(' ')[0];
      const cleanFajrTime = fajrTime.split(' ')[0];
      
      // Parse Maghrib time
      const [maghribHours, maghribMinutes] = cleanMaghribTime.split(':').map(Number);
      if (isNaN(maghribHours) || isNaN(maghribMinutes)) return;
      
      // Create Maghrib date object
      const maghribDate = new Date();
      maghribDate.setHours(maghribHours, maghribMinutes, 0, 0);
      
      // Parse Fajr time
      const [fajrHours, fajrMinutes] = cleanFajrTime.split(':').map(Number);
      if (isNaN(fajrHours) || isNaN(fajrMinutes)) return;
      
      // Create Fajr date object
      const fajrDate = new Date();
      
      // Adjust dates for correct comparison
      // If current time is after Maghrib, Fajr is tomorrow
      if (now >= maghribDate) {
        fajrDate.setDate(fajrDate.getDate() + 1);
      }
      // If current time is before Fajr, it's today's Fajr
      else if (now.getHours() < fajrHours || (now.getHours() === fajrHours && now.getMinutes() < fajrMinutes)) {
        // Fajr is today
      }
      // If current time is after Fajr but before Maghrib, next Maghrib is today
      else {
        // Maghrib is today, already set correctly
      }
      
      fajrDate.setHours(fajrHours, fajrMinutes, 0, 0);
      
      // Check if it's currently Iftar time (between Maghrib and Fajr)
      if ((now >= maghribDate && fajrDate.getDate() > now.getDate()) || 
          (now < fajrDate && fajrDate.getDate() === now.getDate())) {
        setIsIftarTime(true);
        
        // Calculate time until Fajr (when eating ends)
        const timeUntilFajr = fajrDate.getTime() - now.getTime();
        const hoursUntilFajr = Math.floor(timeUntilFajr / (1000 * 60 * 60));
        const minutesUntilFajr = Math.floor((timeUntilFajr % (1000 * 60 * 60)) / (1000 * 60));
        const secondsUntilFajr = Math.floor((timeUntilFajr % (1000 * 60)) / 1000);
        
        setCountdown(`${hoursUntilFajr}:${minutesUntilFajr.toString().padStart(2, '0')}:${secondsUntilFajr.toString().padStart(2, '0')}`);
      } else {
        setIsIftarTime(false);
        
        // If Maghrib has already passed today, use tomorrow's Maghrib
        if (now > maghribDate) {
          maghribDate.setDate(maghribDate.getDate() + 1);
        }
        
        const timeUntilMaghrib = maghribDate.getTime() - now.getTime();
        const hoursUntilMaghrib = Math.floor(timeUntilMaghrib / (1000 * 60 * 60));
        const minutesUntilMaghrib = Math.floor((timeUntilMaghrib % (1000 * 60 * 60)) / (1000 * 60));
        const secondsUntilMaghrib = Math.floor((timeUntilMaghrib % (1000 * 60)) / 1000);
        
        setCountdown(`${hoursUntilMaghrib}:${minutesUntilMaghrib.toString().padStart(2, '0')}:${secondsUntilMaghrib.toString().padStart(2, '0')}`);
      }
    };
    
    // Update immediately and then every second
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timer);
  }, [prayerTimes]);
  
  if (!prayerTimes || !prayerTimes.timings) {
    return null;
  }
  
  return (
    <div className={`bg-amber-900/20 border border-amber-800 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium text-amber-400 mb-1">
        {isIftarTime 
          ? translations.iftarTime[settings.language]
          : translations.timeUntilIftar[settings.language]}
      </h3>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-amber-300">
            {isIftarTime 
              ? translations.timeUntilSuhoorEnds[settings.language]
              : translations.timeUntilBreakingFast[settings.language]}
          </p>
          <p className="text-2xl font-bold text-amber-300">{countdown}</p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg shadow-sm">
          <div className="text-amber-400">
            {isIftarTime ? <Utensils size={24} /> : <Clock size={24} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IftarTimer;