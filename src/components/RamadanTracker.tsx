import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { format, differenceInDays, addDays } from 'date-fns';
import { Calendar, Sunrise, Sunset, Moon, Star } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';

interface RamadanTrackerProps {
  className?: string;
}

const RamadanTracker: React.FC<RamadanTrackerProps> = ({ className = '' }) => {
  const { settings, prayerTimes } = useAppContext();
  const { t, isRTL } = useLocalization();
  const [ramadanInfo, setRamadanInfo] = useState({
    isRamadan: false,
    startDate: new Date(),
    endDate: new Date(),
    currentDay: 0,
    daysLeft: 0,
    totalDays: 30,
  });
  
  useEffect(() => {
    // Ramadan 2025 is approximately from March 1 to March 30
    // This is an approximation - for accurate dates, we would need a proper Hijri calendar calculation
    const ramadanStart2025 = new Date(2025, 2, 1); // March 1, 2025
    const ramadanEnd2025 = new Date(2025, 2, 30); // March 30, 2025
    
    const today = new Date();
    
    // For demonstration purposes, we'll simulate that Ramadan is happening now
    // In a real app, you would use proper Hijri calendar calculations
    
    // Create a simulated "today" date that falls within Ramadan period for demo purposes
    // This simulates as if today is within the Ramadan period
    const simulatedToday = new Date(2025, 2, today.getDate() > 30 ? 30 : today.getDate());
    
    // Check if we're in Ramadan period
    const isRamadan = simulatedToday >= ramadanStart2025 && simulatedToday <= ramadanEnd2025;
    
    // Calculate which day of Ramadan it is
    const daysSinceStart = isRamadan ? differenceInDays(simulatedToday, ramadanStart2025) + 1 : 0;
    
    // Calculate days left in Ramadan
    const daysLeft = isRamadan ? differenceInDays(ramadanEnd2025, simulatedToday) : 
                     (simulatedToday < ramadanStart2025 ? differenceInDays(ramadanStart2025, simulatedToday) : 0);
    
    const totalDays = 30;
    
    setRamadanInfo({
      isRamadan,
      startDate: ramadanStart2025,
      endDate: ramadanEnd2025,
      currentDay: daysSinceStart,
      daysLeft: isRamadan ? daysLeft : daysLeft,
      totalDays,
    });
  }, []);
  
  // Get Suhoor and Iftar times from prayer times
  const suhoorTime = prayerTimes?.timings?.Fajr || '--:--';
  const iftarTime = prayerTimes?.timings?.Maghrib || '--:--';
  
  const formatDate = (date: Date) => {
    if (settings.language === 'ar') {
      // For Arabic, manually format the date
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    }
    return format(date, settings.language === 'en' ? 'MMMM d, yyyy' : 'dd MMMM yyyy');
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
          {ramadanInfo.isRamadan ? (
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
          ) : (
            <div className="py-4">
              {ramadanInfo.daysLeft > 0 ? (
                <>
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
                        {t('ramadanTracker.beginsOn', { date: formatDate(ramadanInfo.startDate) })}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <Moon className="mx-auto text-gray-400 mb-4" size={36} />
                  <p className="text-xl font-medium">
                    {t('ramadanTracker.ramadanHasEnded')}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {t('ramadanTracker.seeYouNextYear')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RamadanTracker;