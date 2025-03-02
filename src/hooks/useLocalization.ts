import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../localization';

/**
 * A hook that provides localization functions based on the current app language
 * @returns Object with translation function
 */
export function useLocalization() {
  const { settings } = useAppContext();
  const t = useTranslations(settings.language);
  
  return {
    /**
     * Get a translation by key
     * @param key The translation key in dot notation (e.g. 'common.unknown')
     * @param params Optional parameters to replace in the translation string
     * @returns The translated string
     */
    t: (key: string, params?: Record<string, string | number>) => t(key, params),
    
    /**
     * Check if the current language is RTL
     */
    isRTL: settings.language === 'ar'
  };
}

export default useLocalization;