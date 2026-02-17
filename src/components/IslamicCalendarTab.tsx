import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Star, Clock, Moon } from 'lucide-react';
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
  hijriMonth: number;
}

interface ImportantDateMonth {
  month: string;
  hijriMonth: number;
  dates: ImportantDateEntry[];
}

// Month emoji mapping for visual distinction
const monthEmojis: Record<string, string> = {
  'Muharram': '🌙',
  "Rabi' al-Awwal": '🕌',
  'Rajab': '✨',
  "Sha'ban": '🌟',
  'Ramadan': '☪️',
  'Shawwal': '🎉',
  'Dhu al-Hijjah': '🕋',
};

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




  const formatShortDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const locale = localeMap[settings.language];

    if (settings.language === 'ar') {
      const formatted = format(date, 'dd MMM', { locale });
      return formatted.replace(/[0-9]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);
    }

    return format(date, 'dd MMM yyyy', { locale: settings.language === 'tt' ? ru : locale });
  };

  const importantDates = useMemo<ImportantDateMonth[]>(() => {
    if (!currentHijriDate) return [];
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const monthSpecs = [
      {
        month: 'Muharram',
        hijriMonth: 1,
        dates: [
          { day: 1, month: 1, name: t('islamicCalendar.newYear') },
          { day: 10, month: 1, name: t('islamicCalendar.ashura') }
        ]
      },
      {
        month: "Rabi' al-Awwal",
        hijriMonth: 3,
        dates: [{ day: 12, month: 3, name: t('islamicCalendar.mawlid') }]
      },
      {
        month: 'Rajab',
        hijriMonth: 7,
        dates: [{ day: 27, month: 7, name: t('islamicCalendar.israMiraj') }]
      },
      {
        month: "Sha'ban",
        hijriMonth: 8,
        dates: [{ day: 15, month: 8, name: t('islamicCalendar.laylatBaraah') }]
      },
      {
        month: 'Ramadan',
        hijriMonth: 9,
        dates: [
          { day: 1, month: 9, name: t('islamicCalendar.ramadanStart') },
          { day: 27, month: 9, name: t('islamicCalendar.laylatQadr') }
        ]
      },
      {
        month: 'Shawwal',
        hijriMonth: 10,
        dates: [{ day: 1, month: 10, name: t('islamicCalendar.eidFitr') }]
      },
      {
        month: 'Dhu al-Hijjah',
        hijriMonth: 12,
        dates: [
          { day: 9, month: 12, name: t('islamicCalendar.arafah') },
          { day: 10, month: 12, name: t('islamicCalendar.eidAdha') }
        ]
      }
    ];

    return monthSpecs.map((monthData) => ({
      month: monthData.month,
      hijriMonth: monthData.hijriMonth,
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
          daysUntil: differenceInCalendarDays(gregorianDate, today),
          hijriMonth: event.month
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

    const upcoming = allHolidays.filter(h => h.daysUntil >= 0);
    if (upcoming.length === 0) return null;

    return upcoming.reduce((closest, holiday) => {
      if (!closest) return holiday;
      return holiday.daysUntil < closest.daysUntil ? holiday : closest;
    }, null as ImportantDateEntry | null);
  }, [importantDates]);

  const getDaysUntilBadge = (daysUntil: number) => {
    if (daysUntil === 0) return { text: t('common.today'), color: 'bg-emerald-500/20 text-emerald-400', glow: true };
    if (daysUntil === 1) return { text: t('common.tomorrow'), color: 'bg-amber-500/20 text-amber-400', glow: false };
    if (daysUntil <= 7) return { text: t('common.inDays', { days: daysUntil }), color: 'bg-blue-500/15 text-blue-400', glow: false };
    if (daysUntil <= 30) return { text: t('common.inDays', { days: daysUntil }), color: 'bg-purple-500/15 text-purple-400', glow: false };
    return { text: t('common.inDays', { days: daysUntil }), color: 'bg-white/[0.06] text-gray-400', glow: false };
  };

  // Determine if a month is current
  const isCurrentMonth = (hijriMonth: number) => {
    return currentHijriDate?.month === hijriMonth;
  };

  return (
    <div className={`${isRTL ? 'text-right' : ''}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-100">
          {t('islamicCalendar.title')}
        </h2>
        {currentHijriDate && (
          <p className="text-gray-500 text-sm mt-1">
            {currentHijriDate.day} / {currentHijriDate.month} / {currentHijriDate.year} AH
          </p>
        )}
      </div>

      {/* ═══════════ HERO: CURRENT YEAR + NEXT HOLIDAY ═══════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {/* Current Hijri Year */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full -mr-10 -mt-10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center flex-shrink-0">
                <Moon className="text-emerald-400" size={20} />
              </div>
              <p className={`text-sm text-gray-500 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                {t('islamicCalendar.currentYear')}
              </p>
            </div>
            <p className="text-3xl font-bold text-emerald-400 tabular-nums">
              {currentYearRange ? currentYearRange.hijriYear : '--'}
              <span className="text-lg font-normal text-emerald-400/50 ml-1.5">AH</span>
            </p>
            <p className="text-gray-600 text-xs mt-2">
              {currentYearRange
                ? `${formatShortDate(currentYearRange.startDate)} — ${formatShortDate(currentYearRange.endDate)}`
                : '--'}
            </p>
          </div>
        </div>

        {/* Next Holiday */}
        {nextHoliday && (
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden bg-gradient-to-br from-amber-900/10 to-transparent">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full -ml-8 -mb-8 blur-2xl" />
            <div className="relative">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center flex-shrink-0">
                  <Star className="text-amber-400" size={20} fill="#f59e0b" />
                </div>
                <p className={`text-sm text-gray-500 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                  {t('islamicCalendar.nextHoliday')}
                </p>
              </div>
              <p className="text-lg font-semibold text-amber-300 mb-1 leading-tight">{nextHoliday.name}</p>
              <p className="text-gray-500 text-xs">{formatShortDate(nextHoliday.date)}</p>
              <div className="mt-2.5">
                <span className={`
                  inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full
                  ${getDaysUntilBadge(nextHoliday.daysUntil).color}
                  ${getDaysUntilBadge(nextHoliday.daysUntil).glow ? 'shadow-[0_0_10px_rgba(16,185,129,0.3)]' : ''}
                `}>
                  <Clock size={11} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {getDaysUntilBadge(nextHoliday.daysUntil).text}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════ EVENTS TIMELINE ═══════════ */}
      <div className="space-y-2.5">
        {importantDates.map((monthData) => {
          const isCurrent = isCurrentMonth(monthData.hijriMonth);
          const emoji = monthEmojis[monthData.month] || '📅';

          return (
            <div
              key={monthData.month}
              className={`
                glass-card rounded-2xl overflow-hidden transition-all duration-300
                ${isCurrent ? 'ring-1 ring-emerald-500/20' : ''}
              `}
            >
              {/* Month header */}
              <div className={`px-4 py-3 flex items-center ${isCurrent ? 'bg-emerald-500/[0.04]' : ''}`}>
                <span className="text-lg mr-2.5">{emoji}</span>
                <h3 className={`font-semibold text-sm ${isCurrent ? 'text-emerald-400' : 'text-gray-300'}`}>
                  {monthData.month}
                </h3>
                {isCurrent && (
                  <span className="ml-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-400">
                    {t('common.now')}
                  </span>
                )}
                <div className={`flex-1 h-px bg-white/[0.04] ${isRTL ? 'mr-3' : 'ml-3'}`} />
              </div>

              {/* Events */}
              <div className="divide-y divide-white/[0.04]">
                {monthData.dates.map((dateEntry) => {
                  const badge = getDaysUntilBadge(dateEntry.daysUntil);
                  const isPast = dateEntry.daysUntil < 0;
                  const isToday = dateEntry.daysUntil === 0;

                  return (
                    <div
                      key={dateEntry.name}
                      className={`
                        flex items-center px-4 py-3.5 transition-colors duration-200
                        ${isToday ? 'bg-emerald-500/[0.05]' : 'hover:bg-white/[0.02]'}
                        ${isPast ? 'opacity-50' : ''}
                      `}
                    >
                      {/* Day badge */}
                      <div className={`
                        w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold
                        ${isToday
                          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : isPast
                            ? 'bg-white/[0.04] text-gray-600'
                            : 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-400'}
                      `}>
                        {dateEntry.day}
                      </div>

                      {/* Info */}
                      <div className={`flex-1 min-w-0 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                        <p className={`font-medium text-sm truncate ${isToday ? 'text-emerald-300' : isPast ? 'text-gray-500' : 'text-gray-200'}`}>
                          {dateEntry.name}
                        </p>
                        <p className="text-gray-600 text-xs mt-0.5">{formatShortDate(dateEntry.date)}</p>
                      </div>

                      {/* Days until badge */}
                      {!isPast && (
                        <span className={`
                          text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0
                          ${badge.color}
                          ${badge.glow ? 'shadow-[0_0_8px_rgba(16,185,129,0.25)]' : ''}
                        `}>
                          {badge.text}
                        </span>
                      )}
                      {isPast && (
                        <span className="text-[11px] text-gray-700 flex-shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IslamicCalendarTab;
