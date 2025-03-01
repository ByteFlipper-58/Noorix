import { Language } from '../types';

/**
 * Detects the user's preferred language based on browser settings
 * Supports English, Russian, and Arabic
 * @returns The detected language code or 'en' as default
 */
export const detectUserLanguage = (): Language => {
  // Get browser language
  const browserLang = navigator.language.toLowerCase();
  
  // Check for Russian
  if (browserLang.startsWith('ru')) {
    return 'ru';
  }
  
  // Check for Arabic
  if (browserLang.startsWith('ar') || 
      browserLang.startsWith('ar-')) {
    return 'ar';
  }
  
  // Default to English for all other languages
  return 'en';
};

/**
 * Gets translated text based on the current language
 * @param translations Object containing translations for each supported language
 * @param language Current language setting
 * @returns Translated text for the current language
 */
export const getTranslation = (
  translations: Record<Language, string>,
  language: Language
): string => {
  return translations[language] || translations.en;
};

/**
 * Translation helper for prayer names
 * @param name English prayer name
 * @param language Current language setting
 * @returns Translated prayer name
 */
export const getPrayerNameTranslation = (name: string, language: Language): string => {
  if (language === 'en') return name;
  
  const translations: Record<string, Record<string, string>> = {
    'Fajr': {
      'ru': 'Фаджр',
      'ar': 'الفجر'
    },
    'Sunrise': {
      'ru': 'Восход',
      'ar': 'الشروق'
    },
    'Dhuhr': {
      'ru': 'Зухр',
      'ar': 'الظهر'
    },
    'Asr': {
      'ru': 'Аср',
      'ar': 'العصر'
    },
    'Maghrib': {
      'ru': 'Магриб',
      'ar': 'المغرب'
    },
    'Isha': {
      'ru': 'Иша',
      'ar': 'العشاء'
    },
    'Fajr (Tomorrow)': {
      'ru': 'Фаджр (Завтра)',
      'ar': 'الفجر (غدًا)'
    }
  };
  
  return translations[name]?.[language] || name;
};