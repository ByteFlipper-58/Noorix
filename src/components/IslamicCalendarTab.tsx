import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Star } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';
import { format, addDays, differenceInDays } from 'date-fns';
import { ar, ru, tr, enUS } from 'date-fns/locale';
import { Language } from '../types';

const IslamicCalendarTab: React.FC = () => {
  const { t, isRTL } = useLocalization();
  const { settings } = useAppContext();
  
  // Map language codes to date-fns locales
  const localeMap: Record<Language, Locale> = {
    en: enUS,
    ru: ru,
    ar: ar,
    tr: tr,
    tt: ru // Use Russian locale for Tatar as it's not available in date-fns
  };

  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
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
  
  // Important Islamic dates for current and next year
  const importantDates = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const dates = [
      {
        month: "Muharram",
        dates: [
          { day: "1", date: new Date(2024, 6, 29), name: t('islamicCalendar.newYear') },
          { day: "10", date: new Date(2024, 7, 7), name: t('islamicCalendar.ashura') }
        ]
      },
      {
        month: "Rabi' al-Awwal",
        dates: [
          { day: "12", date: new Date(2024, 9, 8), name: t('islamicCalendar.mawlid') }
        ]
      },
      {
        month: "Rajab",
        dates: [
          { day: "27", date: new Date(2025, 1, 15), name: t('islamicCalendar.israMiraj') }
        ]
      },
      {
        month: "Sha'ban",
        dates: [
          { day: "15", date: new Date(2025, 2, 5), name: t('islamicCalendar.laylatBaraah') }
        ]
      },
      {
        month: "Ramadan",
        dates: [
          { day: "1", date: new Date(2025, 2, 1), name: t('islamicCalendar.ramadanStart') },
          { day: "27", date: new Date(2025, 2, 27), name: t('islamicCalendar.laylatQadr') }
        ]
      },
      {
        month: "Shawwal",
        dates: [
          { day: "1", date: new Date(2025, 2, 31), name: t('islamicCalendar.eidFitr') }
        ]
      },
      {
        month: "Dhu al-Hijjah",
        dates: [
          { day: "9", date: new Date(2025, 5, 27), name: t('islamicCalendar.arafah') },
          { day: "10", date: new Date(2025, 5, 28), name: t('islamicCalendar.eidAdha') }
        ]
      }
    ];

    // Add next year's dates
    const nextYearDates = JSON.parse(JSON.stringify(dates));
    nextYearDates.forEach((month: any) => {
      month.dates.forEach((date: any) => {
        date.date = addDays(new Date(date.date), 354); // Approximate Islamic year
      });
    });

    return [...dates, ...nextYearDates];
  }, [t]);

  // Find the next holiday
  const nextHoliday = useMemo(() => {
    const today = new Date();
    let nextEvent = null;
    let minDiff = Infinity;

    importantDates.forEach(month => {
      month.dates.forEach(date => {
        const eventDate = new Date(date.date);
        const diff = differenceInDays(eventDate, today);
        if (diff >= 0 && diff < minDiff) {
          minDiff = diff;
          nextEvent = { ...date, daysUntil: diff };
        }
      });
    });

    return nextEvent;
  }, [importantDates]);

  return (
    <div className={`${isRTL ? 'text-right' : ''} max-w-4xl mx-auto`}>
      <h2 className="text-2xl font-semibold mb-6">
        {t('islamicCalendar.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className={`flex items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`bg-green-500/20 p-3 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <Calendar className="text-green-400" size={22} />
            </div>
            <h3 className="font-medium text-lg">
              {t('islamicCalendar.currentYear')}
            </h3>
          </div>
          <p className="text-3xl font-bold text-green-400 mb-2">1446 AH</p>
          <p className="text-gray-400">{formatDate(new Date(2024, 6, 29))} - {formatDate(new Date(2025, 6, 17))}</p>
        </div>

        {nextHoliday && (
          <div className="bg-gradient-to-br from-amber-900/30 to-gray-800 rounded-xl p-6">
            <div className={`flex items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`bg-amber-500/20 p-3 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
                <Star className="text-amber-400" size={22} fill="#f59e0b" />
              </div>
              <h3 className="font-medium text-lg">
                {t('islamicCalendar.nextHoliday')}
              </h3>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-medium text-amber-400">{nextHoliday.name}</p>
              <p className="text-gray-300">{formatDate(nextHoliday.date)}</p>
              <p className="text-sm text-amber-300/80">
                {nextHoliday.daysUntil === 0 
                  ? t('common.today')
                  : nextHoliday.daysUntil === 1
                    ? t('common.tomorrow')
                    : t('common.inDays', { days: nextHoliday.daysUntil })}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {importantDates.slice(0, 7).map((monthData, index) => (
          <div key={monthData.month} className={`p-6 ${index !== 0 ? 'border-t border-gray-700' : ''}`}>
            <h3 className="text-xl font-medium mb-4 text-green-400">{monthData.month}</h3>
            <div className="space-y-4">
              {monthData.dates.map((date) => (
                <div key={date.name} className="flex items-start">
                  <div className={`bg-green-500/10 text-green-400 rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center mt-1 ${isRTL ? 'ml-3' : 'mr-3'}`}>
                    {date.day}
                  </div>
                  <div>
                    <p className="font-medium text-lg">{date.name}</p>
                    <p className="text-gray-400">{formatDate(date.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IslamicCalendarTab;