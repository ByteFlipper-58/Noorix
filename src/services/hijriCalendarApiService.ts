import axios from 'axios';
import { CalculationMethod, MadhabType } from '../types';
import { HijriDate } from './hijriCalendarService';

const API_BASE_URL = 'https://api.aladhan.com/v1';
const REQUEST_TIMEOUT_MS = 15000;

interface AladhanCalendarDayResponse {
  date?: {
    gregorian?: {
      date?: string;
    };
    hijri?: {
      day?: string;
      month?: {
        number?: number | string;
      };
      year?: string;
    };
  };
}

interface AladhanCalendarResponse {
  code?: number;
  data?: AladhanCalendarDayResponse[];
}

export interface HijriCalendarDay {
  gregorianDate: Date;
  gregorianKey: string;
  hijriDate: HijriDate;
  hijriKey: string;
}

export interface HijriCalendarIndex {
  byGregorianKey: Map<string, HijriCalendarDay>;
  byHijriKey: Map<string, HijriCalendarDay>;
}

interface HijriCalendarWindowParams {
  latitude: number;
  longitude: number;
  method: CalculationMethod;
  school: MadhabType;
  centerDate?: Date;
  monthsBack?: number;
  monthsForward?: number;
}

const monthRequestCache = new Map<string, Promise<HijriCalendarDay[]>>();

const normalizeDateToNoon = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);

export const toGregorianDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const toHijriDateKey = (date: HijriDate): string => {
  const year = date.year;
  const month = String(date.month).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseGregorianDate = (dateString?: string): Date | null => {
  if (!dateString) return null;

  const [dayRaw, monthRaw, yearRaw] = dateString.split('-').map(Number);
  if ([dayRaw, monthRaw, yearRaw].some((value) => Number.isNaN(value))) {
    return null;
  }

  return normalizeDateToNoon(new Date(yearRaw, monthRaw - 1, dayRaw));
};

const parseCalendarDay = (day: AladhanCalendarDayResponse): HijriCalendarDay | null => {
  const gregorianDate = parseGregorianDate(day.date?.gregorian?.date);
  if (!gregorianDate) return null;

  const hijriDay = Number(day.date?.hijri?.day);
  const hijriMonth = Number(day.date?.hijri?.month?.number);
  const hijriYear = Number(day.date?.hijri?.year);
  if ([hijriDay, hijriMonth, hijriYear].some((value) => Number.isNaN(value))) {
    return null;
  }

  const hijriDate: HijriDate = {
    day: hijriDay,
    month: hijriMonth,
    year: hijriYear
  };

  return {
    gregorianDate,
    gregorianKey: toGregorianDateKey(gregorianDate),
    hijriDate,
    hijriKey: toHijriDateKey(hijriDate)
  };
};

const createMonthCacheKey = (
  latitude: number,
  longitude: number,
  method: CalculationMethod,
  school: MadhabType,
  year: number,
  month: number
): string => {
  const normalizedLatitude = latitude.toFixed(4);
  const normalizedLongitude = longitude.toFixed(4);
  return `${normalizedLatitude}:${normalizedLongitude}:${method}:${school}:${year}-${month}`;
};

export const fetchHijriCalendarMonth = async (
  latitude: number,
  longitude: number,
  method: CalculationMethod,
  school: MadhabType,
  year: number,
  month: number
): Promise<HijriCalendarDay[]> => {
  const cacheKey = createMonthCacheKey(latitude, longitude, method, school, year, month);
  const cachedRequest = monthRequestCache.get(cacheKey);
  if (cachedRequest) {
    return cachedRequest;
  }

  const request = axios
    .get<AladhanCalendarResponse>(`${API_BASE_URL}/calendar/${year}/${month}`, {
      params: {
        latitude,
        longitude,
        method,
        school
      },
      timeout: REQUEST_TIMEOUT_MS
    })
    .then((response) => {
      if (response.data?.code !== 200 || !Array.isArray(response.data.data)) {
        throw new Error('Invalid response from Hijri calendar API');
      }

      return response.data.data
        .map(parseCalendarDay)
        .filter((entry): entry is HijriCalendarDay => entry !== null);
    })
    .catch((error) => {
      monthRequestCache.delete(cacheKey);
      throw error;
    });

  monthRequestCache.set(cacheKey, request);
  return request;
};

export const fetchHijriCalendarWindow = async ({
  latitude,
  longitude,
  method,
  school,
  centerDate = new Date(),
  monthsBack = 12,
  monthsForward = 12
}: HijriCalendarWindowParams): Promise<HijriCalendarDay[]> => {
  const firstMonth = new Date(centerDate.getFullYear(), centerDate.getMonth() - monthsBack, 1);
  const totalMonths = monthsBack + monthsForward + 1;
  const monthRequests: Promise<HijriCalendarDay[]>[] = [];

  for (let index = 0; index < totalMonths; index += 1) {
    const monthDate = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + index, 1);
    monthRequests.push(
      fetchHijriCalendarMonth(
        latitude,
        longitude,
        method,
        school,
        monthDate.getFullYear(),
        monthDate.getMonth() + 1
      )
    );
  }

  const monthEntries = await Promise.all(monthRequests);
  const deduplicatedEntries = new Map<string, HijriCalendarDay>();

  for (const monthDays of monthEntries) {
    for (const dayEntry of monthDays) {
      deduplicatedEntries.set(dayEntry.gregorianKey, dayEntry);
    }
  }

  return Array.from(deduplicatedEntries.values()).sort(
    (left, right) => left.gregorianDate.getTime() - right.gregorianDate.getTime()
  );
};

export const buildHijriCalendarIndex = (days: HijriCalendarDay[]): HijriCalendarIndex => {
  const byGregorianKey = new Map<string, HijriCalendarDay>();
  const byHijriKey = new Map<string, HijriCalendarDay>();

  for (const dayEntry of days) {
    byGregorianKey.set(dayEntry.gregorianKey, dayEntry);
    byHijriKey.set(dayEntry.hijriKey, dayEntry);
  }

  return {
    byGregorianKey,
    byHijriKey
  };
};
