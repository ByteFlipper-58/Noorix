export interface PrayerTime {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface PrayerTimesData {
  timings: PrayerTime;
  date: {
    readable: string;
    timestamp: string;
    gregorian: {
      date: string;
      format: string;
      day: string;
      weekday: {
        en: string;
      };
      month: {
        number: number;
        en: string;
      };
      year: string;
    };
    hijri: {
      date: string;
      format: string;
      day: string;
      weekday: {
        en: string;
        ar: string;
      };
      month: {
        number: number;
        en: string;
        ar: string;
      };
      year: string;
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: {
      id: number;
      name: string;
      params: {
        Fajr: number;
        Isha: number;
      };
    };
    latitudeAdjustmentMethod: string;
    midnightMode: string;
    school: string;
    offset: {
      [key: string]: number;
    };
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export type CalculationMethod = 
  | 0  // Shafi'i, Maliki, Ja'fari, Hanbali
  | 1  // Hanafi
  | 2  // Islamic Society of North America
  | 3  // Muslim World League
  | 4  // Umm Al-Qura University, Makkah
  | 5  // Egyptian General Authority of Survey
  | 7  // Institute of Geophysics, University of Tehran
  | 8  // Gulf Region
  | 9  // Kuwait
  | 10 // Qatar
  | 11 // Majlis Ugama Islam Singapura, Singapore
  | 12 // Union Organization islamic de France
  | 13 // Diyanet İşleri Başkanlığı, Turkey
  | 14 // Spiritual Administration of Muslims of Russia
  | 15; // Moonsighting Committee Worldwide (also requires shafaq parameter)

export type MadhabType = 
  | 0 // Shafi'i (standard)
  | 1; // Hanafi

export interface UserSettings {
  calculationMethod: CalculationMethod;
  madhab: MadhabType;
  timeFormat: '12h' | '24h';
  language: 'en' | 'ru' | 'ar';
  notifications: boolean;
}

export type NextPrayer = {
  name: string;
  time: string;
  countdown: string;
};

export type Language = 'en' | 'ru' | 'ar';