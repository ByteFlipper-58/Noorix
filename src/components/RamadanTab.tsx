import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import RamadanTracker from './RamadanTracker';
import { Calendar, Book, Star, Sparkles, Droplets, UtensilsCrossed, Moon as MoonIcon } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';
import { addDays, format } from 'date-fns';
import { ar, ru, tr, enUS } from 'date-fns/locale';
import { Language } from '../types';
import type { Locale } from 'date-fns';
import useHijriCalendarApi from '../hooks/useHijriCalendarApi';
import {
  getGregorianDateForHijriDate
} from '../services/hijriCalendarService';

const RamadanTab: React.FC = () => {
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
      return formatted.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
    }

    if (settings.language === 'tt') {
      return format(date, 'dd MMMM yyyy', { locale: ru });
    }

    return format(date, 'dd MMMM yyyy', { locale });
  };

  const importantDates = useMemo(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    if (!currentHijriDate) {
      return null;
    }

    const ramadanHijriYear = currentHijriDate.month > 9 ? currentHijriDate.year + 1 : currentHijriDate.year;
    const ramadanStartHijriDate = {
      day: 1,
      month: 9,
      year: ramadanHijriYear
    };

    const ramadanStartDate =
      getGregorianDateForHijri(ramadanStartHijriDate) ??
      getGregorianDateForHijriDate(currentHijriDate, today, ramadanStartHijriDate);

    const laylatAlQadrDate =
      getGregorianDateForHijri({ day: 27, month: 9, year: ramadanHijriYear }) ??
      addDays(ramadanStartDate, 26);

    const eidAlFitrDate =
      getGregorianDateForHijri({ day: 1, month: 10, year: ramadanHijriYear }) ??
      getGregorianDateForHijriDate(currentHijriDate, today, {
        day: 1,
        month: 10,
        year: ramadanHijriYear
      });

    const lastDayOfRamadanDate = addDays(eidAlFitrDate, -1);

    return {
      ramadanStartDate,
      laylatAlQadrDate,
      lastDayOfRamadanDate,
      eidAlFitrDate
    };
  }, [currentHijriDate, getGregorianDateForHijri]);

  const dateItems = [
    { label: t('ramadan.firstDayRamadan'), date: importantDates?.ramadanStartDate, icon: '☪️' },
    { label: t('ramadan.laylatAlQadr'), date: importantDates?.laylatAlQadrDate, icon: '✨' },
    { label: t('ramadan.lastDayRamadan'), date: importantDates?.lastDayOfRamadanDate, icon: '🌙' },
    { label: t('ramadan.eidAlFitr'), date: importantDates?.eidAlFitrDate, icon: '🎉' },
  ];

  const tips = [
    { text: t('ramadan.stayHydrated'), icon: <Droplets size={14} className="text-blue-400" />, color: 'from-blue-500/20 to-blue-600/10' },
    { text: t('ramadan.eatBalancedSuhoor'), icon: <UtensilsCrossed size={14} className="text-amber-400" />, color: 'from-amber-500/20 to-amber-600/10' },
    { text: t('ramadan.breakFastWithDates'), icon: <Star size={14} className="text-orange-400" />, color: 'from-orange-500/20 to-orange-600/10' },
    { text: t('ramadan.planTaraweeh'), icon: <MoonIcon size={14} className="text-emerald-400" />, color: 'from-emerald-500/20 to-emerald-600/10' },
  ];

  return (
    <div className={`${isRTL ? 'text-right' : ''}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-100">
          {t('navigation.ramadan')} ☪️
        </h2>
      </div>

      {/* Ramadan Tracker */}
      <RamadanTracker className="mb-4" />

      {/* ═══════════ IMPORTANT DATES ═══════════ */}
      <div className="glass-card rounded-2xl overflow-hidden mb-4">
        <div className="px-4 py-3 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="text-emerald-400" size={16} />
          </div>
          <h3 className={`font-semibold text-sm text-gray-300 ${isRTL ? 'mr-2.5' : 'ml-2.5'}`}>
            {t('ramadan.importantDates')}
          </h3>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {dateItems.map((item, i) => (
            <div key={i} className="flex items-center px-4 py-3 hover:bg-white/[0.02] transition-colors duration-200">
              <span className="text-base mr-3 flex-shrink-0">{item.icon}</span>
              <p className="flex-1 text-sm text-gray-300">{item.label}</p>
              <p className="text-xs text-gray-500 tabular-nums flex-shrink-0">
                {item.date ? formatDate(item.date) : '--'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ DUAS ═══════════ */}
      <div className="glass-card rounded-2xl overflow-hidden mb-4">
        <div className="px-4 py-3 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center flex-shrink-0">
            <Book className="text-purple-400" size={16} />
          </div>
          <h3 className={`font-semibold text-sm text-gray-300 ${isRTL ? 'mr-2.5' : 'ml-2.5'}`}>
            {t('ramadan.dailyDuas')}
          </h3>
        </div>

        <div className="px-4 pb-4 space-y-3">
          {/* Dua for breaking fast */}
          <div className="relative glass-card rounded-xl p-4 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/[0.03] rounded-full -mr-8 -mt-8 blur-2xl" />
            <div className="relative">
              <div className="flex items-center mb-2">
                <Sparkles className="text-amber-400/60 mr-1.5" size={12} />
                <h4 className="text-[11px] text-amber-400/70 uppercase tracking-wider font-medium">
                  {t('ramadan.duaForBreakingFast')}
                </h4>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('ramadan.duaIftar')}
              </p>
            </div>
          </div>

          {/* Dua for Laylat al-Qadr */}
          <div className="relative glass-card rounded-xl p-4 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/[0.03] rounded-full -mr-8 -mt-8 blur-2xl" />
            <div className="relative">
              <div className="flex items-center mb-2">
                <Sparkles className="text-purple-400/60 mr-1.5" size={12} />
                <h4 className="text-[11px] text-purple-400/70 uppercase tracking-wider font-medium">
                  {t('ramadan.duaForLaylatAlQadr')}
                </h4>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('ramadan.duaLaylatAlQadr')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ TIPS ═══════════ */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-4 py-3 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center flex-shrink-0">
            <Star className="text-amber-400" size={16} fill="#f59e0b" />
          </div>
          <h3 className={`font-semibold text-sm text-gray-300 ${isRTL ? 'mr-2.5' : 'ml-2.5'}`}>
            {t('ramadan.ramadanTips')}
          </h3>
        </div>

        <div className="px-4 pb-4 space-y-2">
          {tips.map((tip, i) => (
            <div
              key={i}
              className={`flex items-start p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-200 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
            >
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${tip.color} flex items-center justify-center flex-shrink-0 ${isRTL ? 'ml-3' : 'mr-3'} mt-0.5`}>
                {tip.icon}
              </div>
              <span className="text-gray-300 text-sm leading-relaxed">{tip.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RamadanTab;
