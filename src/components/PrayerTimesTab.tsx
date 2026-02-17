import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { formatTime, getNextPrayer, scheduleNotification } from '../services/prayerTimeService';
import { Clock, AlertCircle, MapPin, MoveRight, Sun, Sunrise, Sunset, Moon, CloudSun } from 'lucide-react';
import { NextPrayer } from '../types';
import { getMoonPhaseEmoji, getMoonPhaseName } from '../data/cities';
import IftarTimer from './IftarTimer';
import { getPrayerNameTranslation } from '../services/languageService';
import useLocalization from '../hooks/useLocalization';
import { logAnalyticsEvent } from '../firebase/firebase';

// Prayer icon map
const prayerIcons: Record<string, React.ReactNode> = {
  Fajr: <Sunrise size={18} className="text-indigo-400" />,
  Sunrise: <Sun size={18} className="text-amber-400" />,
  Dhuhr: <Sun size={18} className="text-yellow-400" />,
  Asr: <CloudSun size={18} className="text-orange-400" />,
  Maghrib: <Sunset size={18} className="text-rose-400" />,
  Isha: <Moon size={18} className="text-blue-400" />,
};

const prayerIconColors: Record<string, string> = {
  Fajr: 'from-indigo-500/20 to-indigo-600/10',
  Sunrise: 'from-amber-500/20 to-amber-600/10',
  Dhuhr: 'from-yellow-500/20 to-yellow-600/10',
  Asr: 'from-orange-500/20 to-orange-600/10',
  Maghrib: 'from-rose-500/20 to-rose-600/10',
  Isha: 'from-blue-500/20 to-blue-600/10',
};

const PrayerTimesTab: React.FC = () => {
  const { prayerTimes, loading, error, settings, location } = useAppContext();
  const { t, isRTL } = useLocalization();
  const navigate = useNavigate();
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [moonPhase, setMoonPhase] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const calculateMoonPhase = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const lp = 2551443;
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

        if (settings.notifications) {
          void scheduleNotification(next.name, next.time);
        }

        logAnalyticsEvent('next_prayer_calculated', {
          prayerName: next.name,
          countdown: next.countdown
        });
      } catch (err) {
        console.error('Error calculating next prayer:', err);
        logAnalyticsEvent('next_prayer_calculation_error', {
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }
  }, [prayerTimes, currentTime, settings.notifications]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center animate-pulse">
          <Moon className="text-emerald-400" size={24} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-5 border-red-800/20 bg-red-900/10">
        <div className="flex items-center text-red-400">
          <AlertCircle className={`${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0`} size={20} />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!prayerTimes || !location) {
    return (
      <div className="text-center py-12 max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 flex items-center justify-center border border-emerald-500/10">
          <MapPin className="text-emerald-400" size={32} />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-gray-100">
          {t('prayerTimes.noLocationSelected')}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {t('prayerTimes.pleaseSetLocation')}
        </p>
        <button
          onClick={() => {
            navigate('/location');
            logAnalyticsEvent('navigation', { from: 'prayer_times', to: 'location', reason: 'no_location' });
          }}
          className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-3 px-6 rounded-2xl transition-all duration-300 shadow-glow-sm hover:shadow-glow-md font-medium text-sm"
        >
          <MapPin size={16} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('prayerTimes.goToLocationSettings')}
          <MoveRight size={16} className={`${isRTL ? 'mr-2' : 'ml-2'}`} />
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

  const hijriDate = prayerTimes.date?.hijri;
  const formattedHijriDate = hijriDate
    ? `${hijriDate.day} ${settings.language === 'ar' ? hijriDate.month.ar : hijriDate.month.en} ${hijriDate.year} ${settings.language === 'en' ? 'AH' :
      settings.language === 'ru' ? 'г.х.' : 'هـ'
    }`
    : '';

  const moonEmoji = getMoonPhaseEmoji(moonPhase);
  const phaseName = getMoonPhaseName(moonPhase, settings.language);

  const prayerRakats: Record<string, number> = {
    Fajr: 2,
    Dhuhr: 4,
    Asr: 4,
    Maghrib: 3,
    Isha: 4
  };

  const prayers = [
    { key: 'Fajr', time: prayerTimes.timings?.Fajr },
    { key: 'Sunrise', time: prayerTimes.timings?.Sunrise, isInfo: true },
    { key: 'Dhuhr', time: prayerTimes.timings?.Dhuhr },
    { key: 'Asr', time: prayerTimes.timings?.Asr },
    { key: 'Maghrib', time: prayerTimes.timings?.Maghrib, isIftar: true },
    { key: 'Isha', time: prayerTimes.timings?.Isha },
  ];

  return (
    <div className={`${isRTL ? 'text-right' : ''}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-100">{formattedDate}</h2>
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
          {formattedHijriDate && <p className="text-gray-400 text-sm">{formattedHijriDate}</p>}
          {location.city && (
            <>
              <span className="text-gray-700 hidden sm:inline">·</span>
              <p className="text-sm text-gray-500 flex items-center">
                <MapPin size={12} className={`${isRTL ? 'ml-1' : 'mr-1'} text-emerald-500/50`} />
                {location.city}, {location.country}
              </p>
            </>
          )}
        </div>
      </div>

      {/* ═══════════ NEXT PRAYER + IFTAR ═══════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {nextPrayer && nextPrayer.name !== 'Unknown' && (
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/15 to-transparent" />
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/[0.04] rounded-full -mr-12 -mt-12 blur-2xl" />

            <div className="relative">
              <div className="flex items-center mb-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${prayerIconColors[nextPrayer.name] || 'from-emerald-500/20 to-emerald-600/10'} flex items-center justify-center flex-shrink-0`}>
                  {prayerIcons[nextPrayer.name] || <Clock size={16} className="text-emerald-400" />}
                </div>
                <p className={`text-xs uppercase tracking-wider font-medium text-emerald-400/70 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                  {t('prayerTimes.nextPrayer')}
                </p>
              </div>

              <p className="text-2xl font-bold text-emerald-300 mb-0.5">
                {getPrayerNameTranslation(nextPrayer.name, settings.language)}
              </p>
              <p className="text-sm text-emerald-400/60 tabular-nums">{formatPrayerTime(nextPrayer.time)}</p>

              {/* Countdown chip */}
              <div className="mt-3">
                <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  <Clock size={11} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
                  <span className="tabular-nums">{nextPrayer.countdown}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Iftar Timer */}
        <IftarTimer className="h-full" />
      </div>

      {/* ═══════════ PRAYER LIST ═══════════ */}
      <div className="glass-card rounded-2xl overflow-hidden mb-4">
        <div className="divide-y divide-white/[0.04]">
          {prayers.map((prayer) => {
            if (!prayer.time) return null;
            const isNext = nextPrayer?.name === prayer.key;
            const rakats = prayerRakats[prayer.key];

            return (
              <div
                key={prayer.key}
                className={`
                  flex items-center px-4 py-3.5 transition-all duration-200
                  ${isNext ? 'bg-emerald-500/[0.06]' : 'hover:bg-white/[0.02]'}
                  ${prayer.isInfo ? 'opacity-60' : ''}
                `}
              >
                {/* Icon */}
                <div className={`
                  w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                  ${isNext
                    ? `bg-gradient-to-br ${prayerIconColors[prayer.key] || 'from-emerald-500/20 to-emerald-600/10'} shadow-glow-sm`
                    : 'bg-white/[0.03]'}
                `}>
                  {prayerIcons[prayer.key] || <Clock size={16} className="text-gray-500" />}
                </div>

                {/* Name + badges */}
                <div className={`flex-1 min-w-0 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                  <div className="flex items-center flex-wrap gap-1.5">
                    <span className={`font-medium text-sm ${isNext ? 'text-emerald-400' : prayer.isInfo ? 'text-gray-500' : 'text-gray-200'}`}>
                      {getPrayerNameTranslation(prayer.key, settings.language)}
                    </span>

                    {prayer.isIftar && (
                      <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] rounded-full font-medium">
                        {t('prayerTimes.iftar')}
                      </span>
                    )}

                    {rakats !== undefined && (
                      <span className="px-1.5 py-0.5 bg-white/[0.04] text-gray-500 text-[10px] rounded-full font-medium">
                        {rakats} {t('prayerTimes.rakats')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Time */}
                <span className={`
                  text-sm flex-shrink-0 tabular-nums
                  ${isNext ? 'text-emerald-400 font-semibold' : prayer.isInfo ? 'text-gray-600' : 'text-gray-300'}
                `}>
                  {formatPrayerTime(prayer.time)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════ MOON PHASE ═══════════ */}
      <div className="glass-card rounded-2xl p-4 flex items-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/15 to-indigo-600/5 flex items-center justify-center flex-shrink-0 text-2xl">
          {moonEmoji}
        </div>
        <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
          <p className="font-medium text-sm text-gray-300">
            {t('prayerTimes.currentMoonPhase')}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{phaseName}</p>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesTab;
