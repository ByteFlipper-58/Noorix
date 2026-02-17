import { differenceInCalendarDays } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  buildHijriCalendarIndex,
  fetchHijriCalendarWindow,
  HijriCalendarDay,
  toGregorianDateKey,
  toHijriDateKey
} from '../services/hijriCalendarApiService';
import {
  getGregorianDateForHijriDate as getGregorianDateByApproximation,
  HijriDate,
  resolveCurrentHijriDate
} from '../services/hijriCalendarService';

interface UseHijriCalendarApiResult {
  loading: boolean;
  error: string | null;
  source: 'api' | 'fallback';
  currentHijriDate: HijriDate | null;
  getGregorianDateForHijri: (targetHijriDate: HijriDate) => Date | null;
  getDaysUntilHijriDate: (targetHijriDate: HijriDate) => number | null;
}

const getLocalNoon = (date: Date = new Date()): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);

const findCurrentHijriFromApiDays = (days: HijriCalendarDay[]): HijriDate | null => {
  if (days.length === 0) return null;

  const index = buildHijriCalendarIndex(days).byGregorianKey;
  const offsets = [0, -1, 1];
  const today = getLocalNoon();

  for (const offset of offsets) {
    const candidate = new Date(today);
    candidate.setDate(candidate.getDate() + offset);
    const entry = index.get(toGregorianDateKey(candidate));
    if (entry) {
      return entry.hijriDate;
    }
  }

  return null;
};

export const useHijriCalendarApi = (): UseHijriCalendarApiResult => {
  const { location, prayerTimes, settings } = useAppContext();
  const [apiCalendarDays, setApiCalendarDays] = useState<HijriCalendarDay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const latitude = location?.latitude;
  const longitude = location?.longitude;

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) {
      setApiCalendarDays([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    setLoading(true);
    setError(null);

    const loadCalendar = async () => {
      try {
        const days = await fetchHijriCalendarWindow({
          latitude,
          longitude,
          method: settings.calculationMethod,
          school: settings.madhab
        });

        if (isCancelled) return;
        setApiCalendarDays(days);
      } catch (calendarError) {
        if (isCancelled) return;
        setApiCalendarDays([]);
        setError(calendarError instanceof Error ? calendarError.message : 'Failed to load Hijri calendar');
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void loadCalendar();

    return () => {
      isCancelled = true;
    };
  }, [
    latitude,
    longitude,
    settings.calculationMethod,
    settings.madhab
  ]);

  const apiCalendarIndex = useMemo(() => buildHijriCalendarIndex(apiCalendarDays), [apiCalendarDays]);
  const apiCurrentHijriDate = useMemo(() => findCurrentHijriFromApiDays(apiCalendarDays), [apiCalendarDays]);

  const fallbackCurrentHijriDate = useMemo(
    () => resolveCurrentHijriDate(prayerTimes, getLocalNoon()),
    [prayerTimes]
  );

  const currentHijriDate = apiCurrentHijriDate ?? fallbackCurrentHijriDate;

  const getGregorianDateForHijri = useCallback(
    (targetHijriDate: HijriDate): Date | null => {
      const apiEntry = apiCalendarIndex.byHijriKey.get(toHijriDateKey(targetHijriDate));
      if (apiEntry) {
        return apiEntry.gregorianDate;
      }

      if (!currentHijriDate) {
        return null;
      }

      return getGregorianDateByApproximation(currentHijriDate, getLocalNoon(), targetHijriDate);
    },
    [apiCalendarIndex.byHijriKey, currentHijriDate]
  );

  const getDaysUntilHijriDate = useCallback(
    (targetHijriDate: HijriDate): number | null => {
      const eventDate = getGregorianDateForHijri(targetHijriDate);
      if (!eventDate) return null;

      return differenceInCalendarDays(eventDate, getLocalNoon());
    },
    [getGregorianDateForHijri]
  );

  return {
    loading,
    error,
    source: apiCurrentHijriDate ? 'api' : 'fallback',
    currentHijriDate,
    getGregorianDateForHijri,
    getDaysUntilHijriDate
  };
};

export default useHijriCalendarApi;
