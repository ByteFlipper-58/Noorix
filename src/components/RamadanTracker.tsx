import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { ar, ru, tr, enUS } from 'date-fns/locale';
import { Sunrise, Sunset, Moon, Star, Gift, Sparkles } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';
import { Language } from '../types';
import type { Locale } from 'date-fns';
import useHijriCalendarApi from '../hooks/useHijriCalendarApi';
import {
  getGregorianDateForHijriDate,
  getHijriMonthLength
} from '../services/hijriCalendarService';

interface RamadanTrackerProps {
  className?: string;
}

const RamadanTracker: React.FC<RamadanTrackerProps> = ({ className = '' }) => {
  const { settings, prayerTimes } = useAppContext();
  const { t, isRTL } = useLocalization();
  const { currentHijriDate, getGregorianDateForHijri } = useHijriCalendarApi();

  const localeMap: Record<Language, Locale> = {
    en: enUS,
    ru: ru,
    ar: ar,
    tr: tr,
    tt: ru
  };

  const ramadanInfo = useMemo(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    if (!currentHijriDate) {
      const fallbackStart = addDays(today, 1);
      return {
        isRamadan: false,
        isEidPeriod: false,
        startDate: fallbackStart,
        endDate: addDays(fallbackStart, 29),
        currentDay: 0,
        daysLeft: 1,
        totalDays: 30
      };
    }

    const currentRamadanStartDate =
      getGregorianDateForHijri({ day: 1, month: 9, year: currentHijriDate.year }) ??
      getGregorianDateForHijriDate(currentHijriDate, today, {
        day: 1,
        month: 9,
        year: currentHijriDate.year
      });

    const currentEidDate =
      getGregorianDateForHijri({ day: 1, month: 10, year: currentHijriDate.year }) ??
      getGregorianDateForHijriDate(currentHijriDate, today, {
        day: 1,
        month: 10,
        year: currentHijriDate.year
      });

    const currentRamadanTotalDays = Math.max(
      differenceInCalendarDays(currentEidDate, currentRamadanStartDate),
      getHijriMonthLength(currentHijriDate.year, 9)
    );

    const currentRamadanEndDate = addDays(currentEidDate, -1);

    const isRamadan = currentHijriDate.month === 9;
    const isEidPeriod = currentHijriDate.month === 10 && currentHijriDate.day <= 3;

    if (isRamadan) {
      return {
        isRamadan: true,
        isEidPeriod: false,
        startDate: currentRamadanStartDate,
        endDate: currentRamadanEndDate,
        currentDay: currentHijriDate.day,
        daysLeft: Math.max(differenceInCalendarDays(currentEidDate, today), 0),
        totalDays: currentRamadanTotalDays
      };
    }

    if (isEidPeriod) {
      return {
        isRamadan: false,
        isEidPeriod: true,
        startDate: currentRamadanStartDate,
        endDate: currentRamadanEndDate,
        currentDay: 0,
        daysLeft: 0,
        totalDays: currentRamadanTotalDays
      };
    }

    const upcomingRamadanYear = currentHijriDate.month < 9 ? currentHijriDate.year : currentHijriDate.year + 1;
    const upcomingRamadanHijriDate = {
      day: 1,
      month: 9,
      year: upcomingRamadanYear
    };
    const upcomingEidHijriDate = {
      day: 1,
      month: 10,
      year: upcomingRamadanYear
    };

    const upcomingRamadanStartDate =
      getGregorianDateForHijri(upcomingRamadanHijriDate) ??
      getGregorianDateForHijriDate(currentHijriDate, today, upcomingRamadanHijriDate);

    const upcomingEidDate =
      getGregorianDateForHijri(upcomingEidHijriDate) ??
      getGregorianDateForHijriDate(currentHijriDate, today, upcomingEidHijriDate);

    const totalDays = Math.max(
      differenceInCalendarDays(upcomingEidDate, upcomingRamadanStartDate),
      getHijriMonthLength(upcomingRamadanYear, 9)
    );

    return {
      isRamadan: false,
      isEidPeriod: false,
      startDate: upcomingRamadanStartDate,
      endDate: addDays(upcomingEidDate, -1),
      currentDay: 0,
      daysLeft: Math.max(differenceInCalendarDays(upcomingRamadanStartDate, today), 0),
      totalDays
    };
  }, [currentHijriDate, getGregorianDateForHijri]);

  const suhoorTime = prayerTimes?.timings?.Fajr || '--:--';
  const iftarTime = prayerTimes?.timings?.Maghrib || '--:--';

  const formatDate = (date: Date) => {
    const locale = localeMap[settings.language];

    if (settings.language === 'ar') {
      const formatted = format(date, 'dd MMMM yyyy', { locale });
      return formatted.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
    }

    if (settings.language === 'tt') {
      return format(date, 'dd MMMM yyyy', { locale: ru });
    }

    return format(date, 'dd MMMM yyyy', { locale });
  };

  const renderContent = () => {
    // ═══════════ DURING RAMADAN ═══════════
    if (ramadanInfo.isRamadan) {
      const progress = (ramadanInfo.currentDay / ramadanInfo.totalDays) * 100;
      return (
        <>
          {/* Day counter */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 mb-3 border border-emerald-500/15">
              <span className="text-3xl font-bold text-emerald-400 tabular-nums">{ramadanInfo.currentDay}</span>
            </div>
            <p className="text-lg font-semibold text-gray-200">
              {t('ramadanTracker.dayOfRamadan', { day: ramadanInfo.currentDay })}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              {t('ramadanTracker.daysRemaining', { days: ramadanInfo.daysLeft })}
            </p>
          </div>

          {/* Suhoor / Iftar cards */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="glass-card rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full -mr-6 -mt-6 blur-xl" />
              <div className="relative">
                <div className={`flex items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Sunrise className={`text-amber-400 ${isRTL ? 'ml-2' : 'mr-2'}`} size={16} />
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    {t('ramadanTracker.suhoorEnds')}
                  </p>
                </div>
                <p className="text-2xl font-bold tabular-nums text-gray-100">{suhoorTime}</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-full -mr-6 -mt-6 blur-xl" />
              <div className="relative">
                <div className={`flex items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Sunset className={`text-orange-400 ${isRTL ? 'ml-2' : 'mr-2'}`} size={16} />
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    {t('ramadanTracker.iftarBegins')}
                  </p>
                </div>
                <p className="text-2xl font-bold tabular-nums text-gray-100">{iftarTime}</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{t('ramadanTracker.progress')}</span>
              <span className="tabular-nums font-medium text-emerald-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-600 tabular-nums">
              <span>1</span>
              <span>{ramadanInfo.totalDays}</span>
            </div>
          </div>
        </>
      );
    }

    // ═══════════ EID PERIOD ═══════════
    if (ramadanInfo.isEidPeriod) {
      return (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 mb-4 border border-amber-500/15 animate-float">
            <Gift className="text-amber-400" size={32} />
          </div>

          <h3 className="text-2xl font-bold text-amber-400 mb-2">
            {t('ramadan.eidMubarak')}
          </h3>
          <p className="text-gray-400 text-sm mb-5 max-w-xs mx-auto">
            {t('ramadan.eidCongratulations')}
          </p>

          <div className="glass-card rounded-2xl p-4 max-w-xs mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="text-amber-400/60" size={14} />
              <p className="text-gray-500 text-sm">{t('ramadan.acceptedFasting')}</p>
              <Sparkles className="text-amber-400/60" size={14} />
            </div>
          </div>
        </div>
      );
    }

    // ═══════════ COUNTDOWN TO RAMADAN ═══════════
    return (
      <div className="text-center py-4">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 flex items-center justify-center border border-emerald-500/10">
            <Moon className="text-emerald-400" size={36} />
          </div>
          <div className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-500 to-amber-600 text-white text-sm font-bold rounded-xl w-10 h-10 flex items-center justify-center shadow-[0_4px_12px_rgba(245,158,11,0.3)] tabular-nums">
            {ramadanInfo.daysLeft}
          </div>
        </div>

        <p className="text-xl font-semibold text-gray-100 mb-1">
          {t('ramadanTracker.daysUntilRamadan', { days: ramadanInfo.daysLeft })}
        </p>

        <div className="glass-card rounded-2xl p-3.5 mt-4 max-w-xs mx-auto">
          <p className="text-gray-500 text-sm">
            {t('ramadanTracker.beginsOn', { date: formatDate(ramadanInfo.startDate) })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`glass-card rounded-2xl overflow-hidden ${className}`}>
      <div className="relative overflow-hidden">
        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/[0.04] rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-emerald-500/[0.04] rounded-full -ml-14 -mb-14 blur-3xl" />

        {/* Header */}
        <div className="relative px-5 pt-5 pb-3 flex items-center justify-between">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <Moon className="text-emerald-400" size={20} />
            </div>
            <h3 className="font-semibold text-gray-200">
              {t('ramadanTracker.ramadanTracker')}
            </h3>
          </div>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Star key={i} className="text-amber-500/40" size={10} fill="currentColor" />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-5">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RamadanTracker;
