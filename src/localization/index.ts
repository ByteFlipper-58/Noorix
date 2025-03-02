import enTranslations from './en.json';
import ruTranslations from './ru.json';
import arTranslations from './ar.json';
import { Language } from '../types';

// Define the structure of our translations
export type TranslationKeys = typeof enTranslations;

// Create a record of all translations
const translations: Record<Language, TranslationKeys> = {
  en: enTranslations,
  ru: ruTranslations,
  ar: arTranslations
};

/**
 * Get a translation by key path
 * @param language Current language
 * @param keyPath Dot notation path to the translation (e.g. 'common.unknown')
 * @param params Optional parameters to replace in the translation string
 * @returns The translated string
 */
export function getTranslation(
  language: Language,
  keyPath: string,
  params?: Record<string, string | number>
): string {
  // Split the key path into parts
  const keys = keyPath.split('.');
  
  // Start with the translations for the current language
  let result: any = translations[language];
  
  // Navigate through the object using the key path
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      // If key not found, try English as fallback
      if (language !== 'en') {
        return getTranslation('en', keyPath, params);
      }
      console.warn(`Translation key not found: ${keyPath}`);
      return keyPath;
    }
  }
  
  // If the result is not a string, return the key path
  if (typeof result !== 'string') {
    return keyPath;
  }
  
  // Replace parameters in the string if provided
  if (params) {
    return Object.entries(params).reduce((str, [key, value]) => {
      return str.replace(new RegExp(`{${key}}`, 'g'), String(value));
    }, result);
  }
  
  return result;
}

/**
 * A hook to use translations in components
 * @param language Current language
 * @returns A function to get translations
 */
export function useTranslations(language: Language) {
  return (keyPath: string, params?: Record<string, string | number>) => 
    getTranslation(language, keyPath, params);
}

export default translations;