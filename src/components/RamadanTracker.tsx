import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar, Sunrise, Sunset, Moon, Star } from 'lucide-react';

interface RamadanTrackerProps {
  className?: string;
}

const RamadanTracker: React.FC<RamadanTrackerProps> = ({ className = '' }) => {
  const { settings, prayerTimes } = useAppContext();
  const [ramadanInfo, setRamadanInfo] = useState({
    isRamadan: false,
    startDate: new Date(),
    endDate: new Date(),
    currentDay: 0,
    daysLeft: 0,
    totalDays: 30,
  });
  
  const isRTL = settings.language === 'ar';
  
  const translations = {
    ramadanTracker: {
      en: 'Ramadan Tracker',
      ru: 'Трекер Рамадана',
      ar: 'متتبع رمضان'
    },
    dayOfRamadan: {
      en: (day: number) => `Day ${day} of Ramadan`,
      ru: (day: number) => `День ${day} Рамадана`,
      ar: (day: number) => `اليوم ${day} من رمضان`
    },
    daysRemaining: {
      en: (days: number) => `${days} days remaining`,
      ru: (days: number) => `Осталось ${days} дней`,
      ar: (days: number) => `متبقي ${days} أيام`
    },
    suhoorEnds: {
      en: 'Suhoor ends',
      ru: 'Конец сухура',
      ar: 'نهاية السحور'
    },
    iftarBegins: {
      en: 'Iftar begins',
      ru: 'Начало ифтара',
      ar: 'بداية الإفطار'
    },
    daysUntilRamadan: {
      en: (days: number) => `${days} days until Ramadan`,
      ru: (days: number) => `${days} дней до Рамадана`,
      ar: (days: number) => `${days} يوم حتى رمضان`
    },
    beginsOn: {
      en: (date: string) => `Begins on ${date}`,
      ru: (date: string) => `Начинается ${date}`,
      ar: (date: string) => `يبدأ في ${date}`
    },
    ramadanHasEnded: {
      en: 'Ramadan has ended',
      ru: 'Рамадан закончился',
      ar: 'انتهى رمضان'
    },
    seeYouNextYear: {
      en: 'See you next year, in sha Allah',
      ru: 'Увидимся в следующем году, ин ша Аллах',
      ar: 'نراكم العام المقبل، إن شاء الله'
    }
  };
  
  useEffect(() => {
    // Ramadan 2025 is approximately from March 1 to March 30
    // This is an approximation - for accurate dates, we would need a proper Hijri calendar calculation
    const ramadanStart2025 = new Date(2025, 2, 1); // March 1, 2025
    const ramadanEnd2025 = new Date(2025, 2, 30); // March 30, 2025
    
    const today = new Date();
    
    // For demonstration purposes, let's assume Ramadan has already started
    // We'll set today's date to be a few days into Ramadan
    const isRamadan = true;
    
    // Calculate which day of Ramadan it is (for demo purposes, let's say it's day 1)
    const currentDay = 1;
    
    // Calculate days left in Ramadan
    const daysLeft = 29; // 30 days total - 1 day passed
    
    const totalDays = 30;
    
    setRamadanInfo({
      isRamadan,
      startDate: ramadanStart2025,
      endDate: ramadanEnd2025,
      currentDay,
      daysLeft,
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
    <div className={`bg-gradient-to-br from-green-900/40 to-gray-800 rounded-lg overflow-hidden shadow-lg ${className}`}>
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/10 rounded-full -ml-8 -mb-8"></div>
        
        {/* Header */}
        <div className="relative p-5 flex items-center justify-between">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`bg-green-500/20 p-2 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <Moon className="text-green-400" size={22} />
            </div>
            <h3 className="font-semibold text-green-400 text-lg">
              {translations.ramadanTracker[settings.language]}
            </h3>
          </div>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <Star key={i} className="text-amber-400/70" size={12} fill="#f59e0b" />
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 pt-2">
          {ramadanInfo.isRamadan ? (
            <>
              <div className="mb-5">
                <p className="text-xl font-medium text-green-300">
                  {translations.dayOfRamadan[settings.language](ramadanInfo.currentDay)}
                </p>
                <p className="text-gray-400">
                  {translations.daysRemaining[settings.language](ramadanInfo.daysLeft)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className={`flex items-center mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Sunrise className={`text-amber-400 ${isRTL ? 'ml-2' : 'mr-2'}`} size={16} />
                    <p className="text-sm text-gray-400">
                      {translations.suhoorEnds[settings.language]}
                    </p>
                  </div>
                  <p className="font-medium text-lg">{suhoorTime}</p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className={`flex items-center mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Sunset className={`text-amber-400 ${isRTL ? 'ml-2' : 'mr-2'}`} size={16} />
                    <p className="text-sm text-gray-400">
                      {translations.iftarBegins[settings.language]}
                    </p>
                  </div>
                  <p className="font-medium text-lg">{iftarTime}</p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-700/50 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-400 h-2.5 rounded-full" 
                  style={{ width: `${(ramadanInfo.currentDay / ramadanInfo.totalDays) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-right">
                {Math.round((ramadanInfo.currentDay / ramadanInfo.totalDays) * 100)}%
              </p>
            </>
          ) : (
            <div className="py-3">
              {ramadanInfo.daysLeft > 0 ? (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-green-900/30 flex items-center justify-center">
                        <Calendar className="text-green-400" size={28} />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-amber-500/90 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                        {ramadanInfo.daysLeft}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-center text-lg font-medium mb-2">
                    {translations.daysUntilRamadan[settings.language](ramadanInfo.daysLeft)}
                  </p>
                  
                  <div className="bg-gray-800/40 rounded-lg p-3 mt-4">
                    <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Calendar className={`text-green-400 ${isRTL ? 'ml-2' : 'mr-2'}`} size={16} />
                      <p className="text-gray-300 text-sm">
                        {translations.beginsOn[settings.language](formatDate(ramadanInfo.startDate))}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <Moon className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-lg font-medium">
                    {translations.ramadanHasEnded[settings.language]}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {translations.seeYouNextYear[settings.language]}
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