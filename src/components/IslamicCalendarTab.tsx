import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Star } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { ar, ru, tr, enUS } from 'date-fns/locale';
import { Language } from '../types';
import type { Locale } from 'date-fns';
import useHijriCalendarApi from '../hooks/useHijriCalendarApi';
import {
  getGregorianDateForHijriDate
} from '../services/hijriCalendarService';

interface ImportantDateEntry {
  day: string;
  date: Date;
  name: string;
  daysUntil: number;
}

interface ImportantDateMonth {
  month: string;
  dates: ImportantDateEntry[];
}

const IslamicCalendarTab: React.FC = () => {
  const { t, isRTL } = useLocalization();
  const { settings } = useAppContext();
  const { currentHijriDate, getGregorianDateForHijri } = useHijriCalendarApi();

  const localeMap: Record<Language, Locale> = {
    en: enUS,
    ru: ru,
    ar: ar,
    tr: tr,
    tt: ru
  };

  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const locale = localeMap[settings.language];

    if (settings.language === 'ar') {
      const formatted = format(date, 'dd MMMM yyyy', { locale });
      return formatted.replace(/[0-9]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);
    }

    if (settings.language === 'tt') {
      return format(date, 'dd MMMM yyyy', { locale: ru });
    }

    return format(date, 'dd MMMM yyyy', { locale });
  };

  const importantDates = useMemo<ImportantDateMonth[]>(() => {
    if (!currentHijriDate) return [];
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const monthSpecs = [
      {
        month: 'Muharram',
        dates: [
          { day: 1, month: 1, name: t('islamicCalendar.newYear') },
          { day: 10, month: 1, name: t('islamicCalendar.ashura') }
        ]
      },
      {
        month: "Rabi' al-Awwal",
        dates: [{ day: 12, month: 3, name: t('islamicCalendar.mawlid') }]
      },
      {
        month: 'Rajab',
        dates: [{ day: 27, month: 7, name: t('islamicCalendar.israMiraj') }]
      },
      {
        month: "Sha'ban",
        dates: [{ day: 15, month: 8, name: t('islamicCalendar.laylatBaraah') }]
      },
      {
        month: 'Ramadan',
        dates: [
          { day: 1, month: 9, name: t('islamicCalendar.ramadanStart') },
          { day: 27, month: 9, name: t('islamicCalendar.laylatQadr') }
        ]
      },
      {
        month: 'Shawwal',
        dates: [{ day: 1, month: 10, name: t('islamicCalendar.eidFitr') }]
      },
      {
        month: 'Dhu al-Hijjah',
        dates: [
          { day: 9, month: 12, name: t('islamicCalendar.arafah') },
          { day: 10, month: 12, name: t('islamicCalendar.eidAdha') }
        ]
      }
    ];

    return monthSpecs.map((monthData) => ({
      month: monthData.month,
      dates: monthData.dates.map((event) => {
        const occursThisHijriYear =
          event.month > currentHijriDate.month ||
          (event.month === currentHijriDate.month && event.day >= currentHijriDate.day);

        const targetHijriDate = {
          day: event.day,
          month: event.month,
          year: occursThisHijriYear ? currentHijriDate.year : currentHijriDate.year + 1
        };

        const gregorianDate =
          getGregorianDateForHijri(targetHijriDate) ??
          getGregorianDateForHijriDate(currentHijriDate, today, targetHijriDate);

        return {
          day: String(event.day),
          date: gregorianDate,
          name: event.name,
          daysUntil: differenceInCalendarDays(gregorianDate, today)
        };
      })
    }));
  }, [currentHijriDate, getGregorianDateForHijri, t]);

  const currentYearRange = useMemo(() => {
    if (!currentHijriDate) return null;
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const currentYearStart =
      getGregorianDateForHijri({ day: 1, month: 1, year: currentHijriDate.year }) ??
      getGregorianDateForHijriDate(currentHijriDate, today, {
        day: 1,
        month: 1,
        year: currentHijriDate.year
      });

    const nextYearStart =
      getGregorianDateForHijri({ day: 1, month: 1, year: currentHijriDate.year + 1 }) ??
      getGregorianDateForHijriDate(currentHijriDate, today, {
        day: 1,
        month: 1,
        year: currentHijriDate.year + 1
      });

    return {
      hijriYear: currentHijriDate.year,
      startDate: currentYearStart,
      endDate: addDays(nextYearStart, -1)
    };
  }, [currentHijriDate, getGregorianDateForHijri]);

  const nextHoliday = useMemo(() => {
    const allHolidays = importantDates.flatMap((month) => month.dates);
    if (allHolidays.length === 0) return null;

    return allHolidays.reduce((closest, holiday) => {
      if (!closest) return holiday;
      return holiday.daysUntil < closest.daysUntil ? holiday : closest;
    }, null as ImportantDateEntry | null);
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
          <p className="text-3xl font-bold text-green-400 mb-2">
            {currentYearRange ? `${currentYearRange.hijriYear} AH` : '--'}
          </p>
          <p className="text-gray-400">
            {currentYearRange
              ? `${formatDate(currentYearRange.startDate)} - ${formatDate(currentYearRange.endDate)}`
              : '--'}
          </p>
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
        {importantDates.map((monthData, index) => (
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
