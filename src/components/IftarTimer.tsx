import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Clock, Utensils, Sunrise } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';

interface IftarTimerProps {
  className?: string;
}

const IftarTimer: React.FC<IftarTimerProps> = ({ className = '' }) => {
  const { prayerTimes } = useAppContext();
  const { t, isRTL } = useLocalization();
  const [countdown, setCountdown] = useState<string>('');
  const [isIftarTime, setIsIftarTime] = useState<boolean>(false);

  useEffect(() => {
    if (!prayerTimes || !prayerTimes.timings) return;

    const updateTimer = () => {
      const now = new Date();
      const maghribTime = prayerTimes.timings.Maghrib;
      const fajrTime = prayerTimes.timings.Fajr;

      if (!maghribTime || !fajrTime) return;

      const cleanMaghribTime = maghribTime.split(' ')[0];
      const cleanFajrTime = fajrTime.split(' ')[0];

      const [maghribHours, maghribMinutes] = cleanMaghribTime.split(':').map(Number);
      if (isNaN(maghribHours) || isNaN(maghribMinutes)) return;

      const maghribDate = new Date();
      maghribDate.setHours(maghribHours, maghribMinutes, 0, 0);

      const [fajrHours, fajrMinutes] = cleanFajrTime.split(':').map(Number);
      if (isNaN(fajrHours) || isNaN(fajrMinutes)) return;

      const fajrDate = new Date();

      if (now >= maghribDate) {
        fajrDate.setDate(fajrDate.getDate() + 1);
      }
      else if (now.getHours() < fajrHours || (now.getHours() === fajrHours && now.getMinutes() < fajrMinutes)) {
        // Fajr is today
      }

      fajrDate.setHours(fajrHours, fajrMinutes, 0, 0);

      if ((now >= maghribDate && fajrDate.getDate() > now.getDate()) ||
        (now < fajrDate && fajrDate.getDate() === now.getDate())) {
        setIsIftarTime(true);

        const timeUntilFajr = fajrDate.getTime() - now.getTime();
        const hoursUntilFajr = Math.floor(timeUntilFajr / (1000 * 60 * 60));
        const minutesUntilFajr = Math.floor((timeUntilFajr % (1000 * 60 * 60)) / (1000 * 60));
        const secondsUntilFajr = Math.floor((timeUntilFajr % (1000 * 60)) / 1000);

        setCountdown(`${hoursUntilFajr}:${minutesUntilFajr.toString().padStart(2, '0')}:${secondsUntilFajr.toString().padStart(2, '0')}`);
      } else {
        setIsIftarTime(false);

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

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes]);

  if (!prayerTimes || !prayerTimes.timings) {
    return null;
  }

  const Icon = isIftarTime ? Utensils : Clock;
  const accentColor = isIftarTime ? 'amber' : 'orange';

  return (
    <div className={`glass-card rounded-2xl p-5 relative overflow-hidden ${className}`}>
      {/* Decorative glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${accentColor}-500/5 rounded-full -mr-10 -mt-10 blur-2xl`} />

      <div className="relative">
        {/* Label */}
        <div className="flex items-center mb-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${accentColor}-500/20 to-${accentColor}-600/10 flex items-center justify-center flex-shrink-0`}>
            {isIftarTime
              ? <Sunrise className="text-amber-400" size={16} />
              : <Clock className="text-orange-400" size={16} />
            }
          </div>
          <p className={`text-xs uppercase tracking-wider font-medium ${isRTL ? 'mr-2' : 'ml-2'} ${isIftarTime ? 'text-amber-400/70' : 'text-orange-400/70'}`}>
            {isIftarTime
              ? t('iftarTimer.iftarTime')
              : t('iftarTimer.timeUntilIftar')}
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mb-1">
          {isIftarTime
            ? t('iftarTimer.timeUntilSuhoorEnds')
            : t('iftarTimer.timeUntilBreakingFast')}
        </p>

        {/* Countdown */}
        <div className="flex items-end justify-between">
          <p className={`text-3xl font-bold tabular-nums ${isIftarTime ? 'text-amber-300' : 'text-orange-300'}`}>
            {countdown}
          </p>
          <div className={`p-2.5 rounded-xl ${isIftarTime ? 'bg-amber-500/10' : 'bg-orange-500/10'}`}>
            <Icon
              size={20}
              className={`${isIftarTime ? 'text-amber-400 animate-pulse-soft' : 'text-orange-400'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IftarTimer;