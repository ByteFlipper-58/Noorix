import { Language } from '../types';
import translations from '../localization';

/**
 * Detects the user's preferred language based on browser settings
 * Supports English, Russian, Arabic, Turkish, and Tatar
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
  
  // Check for Turkish
  if (browserLang.startsWith('tr')) {
    return 'tr';
  }
  
  // Check for Tatar
  if (browserLang.startsWith('tt')) {
    return 'tt';
  }
  
  // Default to English for all other languages
  return 'en';
};

/**
 * Gets translated prayer name based on the current language
 * @param name English prayer name
 * @param language Current language setting
 * @returns Translated prayer name
 */
export const getPrayerNameTranslation = (name: string, language: Language): string => {
  const key = `prayers.${name}`;
  
  // Try to get from translations
  try {
    const parts = key.split('.');
    let result: any = translations[language];
    
    for (const part of parts) {
      if (result && typeof result === 'object' && part in result) {
        result = result[part];
      } else {
        return name; // Fallback to original name if not found
      }
    }
    
    return typeof result === 'string' ? result : name;
  } catch (error) {
    return name; // Fallback to original name if any error
  }
};