import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { format, differenceInDays, addDays, isWithinInterval } from 'date-fns';
import { ar, ru, tr, enUS } from 'date-fns/locale';
import { Calendar, Sunrise, Sunset, Moon, Star, Gift } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';
import { Language } from '../types';

interface RamadanTrackerProps {
  className?: string;
}

const RamadanTracker: React.FC<RamadanTrackerProps> = ({ className = '' }) => {
  const { settings, prayerTimes } = useAppContext();
  const { t, isRTL } = useLocalization();
  const [ramadanInfo, setRamadanInfo] = useState({
    isRamadan: false,
    isEidPeriod: true,
    startDate: new Date(2026, 2, 16), // March 1, 2025
    endDate: new Date(2025, 3, 19), // March 30, 2025
    currentDay: 0,
    daysLeft: 0,
    totalDays: 30,
  });

  // Map language codes to date-fns locales
  const localeMap: Record<Language, Locale> = {
    en: enUS,
    ru: ru,
    ar: ar,
    tr: tr,
    tt: ru // Use Russian locale for Tatar as it's not available in date-fns
  };
  
  useEffect(() => {
    const today = new Date();
    
    // For demonstration purposes, we'll simulate that Ramadan is happening now
    const simulatedToday = new Date(2025, 2, today.getDate() > 30 ? 30 : today.getDate());
    
    // Calculate Eid period (3 days after Ramadan)
    const eidStartDate = addDays(ramadanInfo.endDate, 1);
    const eidEndDate = addDays(ramadanInfo.endDate, 3);
    
    // Check if we're in Ramadan period
    const isRamadan = simulatedToday >= ramadanInfo.startDate && simulatedToday <= ramadanInfo.endDate;
    
    // Check if we're in Eid period (3 days after Ramadan)
    const isEidPeriod = isWithinInterval(simulatedToday, { start: eidStartDate, end: eidEndDate });
    
    // Calculate which day of Ramadan it is and days left
    let daysSinceStart = 0;
    let daysLeft = 0;

    if (isRamadan) {
      // During Ramadan, calculate current day and days remaining
      daysSinceStart = differenceInDays(simulatedToday, ramadanInfo.startDate) + 1;
      daysLeft = differenceInDays(ramadanInfo.endDate, simulatedToday);
    } else if (!isEidPeriod) {
      // After Eid period, calculate days until next Ramadan
      const nextRamadanStart = new Date(2026, 1, 19); // February 19, 2026
      daysLeft = differenceInDays(nextRamadanStart, simulatedToday);
    }
    
    setRamadanInfo(prev => ({
      ...prev,
      isRamadan,
      isEidPeriod,
      currentDay: daysSinceStart,
      daysLeft: daysLeft,
    }));
  }, []);
  
  // Get Suhoor and Iftar times from prayer times
  const suhoorTime = prayerTimes?.timings?.Fajr || '--:--';
  const iftarTime = prayerTimes?.timings?.Maghrib || '--:--';
  
  const formatDate = (date: Date) => {
    const locale = localeMap[settings.language];
    
    if (settings.language === 'ar') {
      // For Arabic, use a custom format
      const formatted = format(date, 'dd MMMM yyyy', { locale });
      // Convert numbers to Arabic numerals
      return formatted.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    }
    
    if (settings.language === 'tt') {
      // For Tatar, use Russian locale with custom month names
      const formatted = format(date, 'dd MMMM yyyy', { locale: ru });
      // You could add custom Tatar month name replacements here if needed
      return formatted;
    }
    
    return format(date, 'dd MMMM yyyy', { locale });
  };

  const renderContent = () => {
    if (ramadanInfo.isRamadan) {
      return (
        <>
          <div className="mb-5">
            <p className="text-2xl font-medium text-green-300">
              {t('ramadanTracker.dayOfRamadan', { day: ramadanInfo.currentDay })}
            </p>
            <p className="text-gray-400">
              {t('ramadanTracker.daysRemaining', { days: ramadanInfo.daysLeft })}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-800/50 rounded-lg p-3 md:p-4">
              <div className={`flex items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Sunrise className={`text-amber-400 ${isRTL ? 'ml-2' : 'mr-2'}`} size={18} />
                <p className="text-sm text-gray-400">
                  {t('ramadanTracker.suhoorEnds')}
                </p>
              </div>
              <p className="font-medium text-lg">{suhoorTime}</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3 md:p-4">
              <div className={`flex items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Sunset className={`text-amber-400 ${isRTL ? 'ml-2' : 'mr-2'}`} size={18} />
                <p className="text-sm text-gray-400">
                  {t('ramadanTracker.iftarBegins')}
                </p>
              </div>
              <p className="font-medium text-lg">{iftarTime}</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full" 
              style={{ width: `${(ramadanInfo.currentDay / ramadanInfo.totalDays) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 text-right">
            {Math.round((ramadanInfo.currentDay / ramadanInfo.totalDays) * 100)}%
          </p>
        </>
      );
    }
    
    if (ramadanInfo.isEidPeriod) {
      return (
        <div className="py-4">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Gift className="text-amber-400" size={32} />
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-medium text-center text-amber-400 mb-3">
            {t('ramadan.eidMubarak')}
          </h3>
          
          <p className="text-center text-gray-300 mb-4">
            {t('ramadan.eidCongratulations')}
          </p>
          
          <div className="bg-gray-800/40 rounded-lg p-4">
            <div className="text-center text-gray-400">
              {t('ramadan.acceptedFasting')}
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="py-4">
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-green-900/30 flex items-center justify-center">
              <Calendar className="text-green-400" size={32} />
            </div>
            <div className="absolute -top-2 -right-2 bg-amber-500/90 text-white text-sm font-bold rounded-full w-10 h-10 flex items-center justify-center">
              {ramadanInfo.daysLeft}
            </div>
          </div>
        </div>
        
        <p className="text-center text-xl font-medium mb-3">
          {t('ramadanTracker.daysUntilRamadan', { days: ramadanInfo.daysLeft })}
        </p>
        
        <div className="bg-gray-800/40 rounded-lg p-4 mt-4">
          <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className={`text-green-400 ${isRTL ? 'ml-2' : 'mr-2'}`} size={18} />
            <p className="text-gray-300 text-sm">
              {t('ramadanTracker.beginsOn', { date: formatDate(new Date(2026, 1, 19)) })}
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`bg-gradient-to-br from-green-900/40 to-gray-800 rounded-xl overflow-hidden shadow-lg ${className}`}>
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/10 rounded-full -ml-8 -mb-8"></div>
        
        {/* Header */}
        <div className="relative p-4 md:p-6 flex items-center justify-between">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`bg-green-500/20 p-3 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <Moon className="text-green-400" size={24} />
            </div>
            <h3 className="font-semibold text-green-400 text-xl">
              {t('ramadanTracker.ramadanTracker')}
            </h3>
          </div>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <Star key={i} className="text-amber-400/70" size={14} fill="#f59e0b" />
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 md:p-6 pt-2">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RamadanTracker;