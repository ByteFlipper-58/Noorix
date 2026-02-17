import { PrayerTimesData } from '../types';

export interface HijriDate {
  day: number;
  month: number;
  year: number;
}

const HIJRI_LEAP_YEAR_SET = new Set([2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29]);

let hijriFormatter: Intl.DateTimeFormat | null | undefined;

const getHijriFormatter = (): Intl.DateTimeFormat | null => {
  if (hijriFormatter !== undefined) {
    return hijriFormatter;
  }

  try {
    hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  } catch {
    hijriFormatter = null;
  }

  return hijriFormatter;
};

const cloneLocalDate = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);

export const isHijriLeapYear = (year: number): boolean => {
  const cycleYear = ((year - 1) % 30 + 30) % 30 + 1;
  return HIJRI_LEAP_YEAR_SET.has(cycleYear);
};

export const getHijriMonthLength = (year: number, month: number): number => {
  if (month < 1 || month > 12) {
    throw new Error(`Invalid Hijri month: ${month}`);
  }

  if (month === 12) {
    return isHijriLeapYear(year) ? 30 : 29;
  }

  return month % 2 === 1 ? 30 : 29;
};

export const compareHijriDates = (a: HijriDate, b: HijriDate): number => {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
};

const addOneHijriDay = (date: HijriDate): HijriDate => {
  const monthLength = getHijriMonthLength(date.year, date.month);
  if (date.day < monthLength) {
    return { ...date, day: date.day + 1 };
  }

  if (date.month < 12) {
    return { day: 1, month: date.month + 1, year: date.year };
  }

  return { day: 1, month: 1, year: date.year + 1 };
};

const subtractOneHijriDay = (date: HijriDate): HijriDate => {
  if (date.day > 1) {
    return { ...date, day: date.day - 1 };
  }

  if (date.month > 1) {
    const previousMonth = date.month - 1;
    return {
      day: getHijriMonthLength(date.year, previousMonth),
      month: previousMonth,
      year: date.year
    };
  }

  const previousYear = date.year - 1;
  return {
    day: getHijriMonthLength(previousYear, 12),
    month: 12,
    year: previousYear
  };
};

export const addHijriDays = (date: HijriDate, days: number): HijriDate => {
  if (days === 0) return { ...date };

  let result: HijriDate = { ...date };
  const step = days > 0 ? addOneHijriDay : subtractOneHijriDay;

  for (let i = 0; i < Math.abs(days); i += 1) {
    result = step(result);
  }

  return result;
};

export const getHijriDayDifference = (from: HijriDate, to: HijriDate): number => {
  const comparison = compareHijriDates(from, to);
  if (comparison === 0) return 0;

  let cursor: HijriDate = { ...from };
  let diff = 0;
  const step = comparison < 0 ? 1 : -1;

  while (compareHijriDates(cursor, to) !== 0) {
    cursor = addHijriDays(cursor, step);
    diff += step;
  }

  return diff;
};

export const getGregorianDateForHijriDate = (
  currentHijriDate: HijriDate,
  currentGregorianDate: Date,
  targetHijriDate: HijriDate
): Date => {
  const diffDays = getHijriDayDifference(currentHijriDate, targetHijriDate);
  const result = cloneLocalDate(currentGregorianDate);
  result.setDate(result.getDate() + diffDays);
  return result;
};

export const getHijriDateFromPrayerTimes = (
  prayerTimes: PrayerTimesData | null
): HijriDate | null => {
  const hijri = prayerTimes?.date?.hijri;
  if (!hijri) return null;

  const day = Number(hijri.day);
  const month = Number(hijri.month?.number);
  const year = Number(hijri.year);

  if ([day, month, year].some((value) => Number.isNaN(value))) {
    return null;
  }

  return { day, month, year };
};

export const getHijriDateFromIntl = (date: Date): HijriDate | null => {
  try {
    const formatter = getHijriFormatter();
    if (!formatter) return null;

    const parts = formatter.formatToParts(cloneLocalDate(date));
    const day = Number(parts.find((part) => part.type === 'day')?.value);
    const month = Number(parts.find((part) => part.type === 'month')?.value);
    const year = Number(parts.find((part) => part.type === 'year')?.value);

    if ([day, month, year].some((value) => Number.isNaN(value))) {
      return null;
    }

    return { day, month, year };
  } catch {
    return null;
  }
};

export const resolveCurrentHijriDate = (
  prayerTimes: PrayerTimesData | null,
  fallbackDate: Date = new Date()
): HijriDate | null => {
  return getHijriDateFromPrayerTimes(prayerTimes) ?? getHijriDateFromIntl(fallbackDate);
};
