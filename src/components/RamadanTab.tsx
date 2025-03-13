import React from 'react';
import { useAppContext } from '../context/AppContext';
import RamadanTracker from './RamadanTracker';
import { Calendar, Book, Star, Gift } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';
import { format } from 'date-fns';
import { ar, ru, tr, enUS } from 'date-fns/locale';
import { Language } from '../types';

const RamadanTab: React.FC = () => {
  const { t, isRTL } = useLocalization();
  const { settings } = useAppContext();
  
  // Map language codes to date-fns locales
  const localeMap: Record<Language, Locale> = {
    en: enUS,
    ru: ru,
    ar: ar,
    tr: tr,
    tt: ru // Use Russian locale for Tatar as it's not available in date-fns
  };

  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const locale = localeMap[settings.language];
    
    if (settings.language === 'ar') {
      // For Arabic, use a custom format
      const formatted = format(date, 'dd MMMM yyyy', { locale });
      // Convert numbers to Arabic numerals
      return formatted.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    }
    
    if (settings.language === 'tt') {
      // For Tatar, use Russian locale with custom month names
      const formatted = format(date, 'dd MMMM yyyy', { locale: ru });
      // You could add custom Tatar month name replacements here if needed
      return formatted;
    }
    
    return format(date, 'dd MMMM yyyy', { locale });
  };
  
  return (
    <div className={`${isRTL ? 'text-right' : ''} max-w-4xl mx-auto`}>
      <h2 className="text-2xl font-semibold mb-4">
        {t('ramadan.ramadan2025')}
      </h2>
      
      {/* Ramadan Tracker */}
      <RamadanTracker className="mb-6" />
      
      {/* Additional Ramadan content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 md:p-6">
          <div className={`flex items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`bg-green-500/20 p-3 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <Calendar className="text-green-400" size={22} />
            </div>
            <h3 className="font-medium text-lg">
              {t('ramadan.importantDates')}
            </h3>
          </div>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-gray-300">
                {t('ramadan.firstDayRamadan')}
              </span>
              <span className="text-gray-400 ml-2 text-right">
                {formatDate(new Date(2025, 2, 1))}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-300">
                {t('ramadan.laylatAlQadr')}
              </span>
              <span className="text-gray-400 ml-2 text-right">
                {formatDate(new Date(2025, 2, 27))}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-300">
                {t('ramadan.lastDayRamadan')}
              </span>
              <span className="text-gray-400 ml-2 text-right">
                {formatDate(new Date(2025, 2, 30))}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-300">
                {t('ramadan.eidAlFitr')}
              </span>
              <span className="text-gray-400 ml-2 text-right">
                {formatDate(new Date(2025, 2, 31))}
              </span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 md:p-6">
          <div className={`flex items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`bg-green-500/20 p-3 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <Book className="text-green-400" size={22} />
            </div>
            <h3 className="font-medium text-lg">
              {t('ramadan.dailyDuas')}
            </h3>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-2">
                {t('ramadan.duaForBreakingFast')}
              </h4>
              <p className="text-gray-300 text-sm">
                {t('ramadan.duaIftar')}
              </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-2">
                {t('ramadan.duaForLaylatAlQadr')}
              </h4>
              <p className="text-gray-300 text-sm">
                {t('ramadan.duaLaylatAlQadr')}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-900/30 to-gray-800 rounded-xl p-4 md:p-6">
        <div className={`flex items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`bg-amber-500/20 p-3 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
            <Star className="text-amber-400" size={22} fill="#f59e0b" />
          </div>
          <h3 className="font-medium text-lg">
            {t('ramadan.ramadanTips')}
          </h3>
        </div>
        <ul className="space-y-3">
          <li className={`flex items-start ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <div className={`bg-green-500/10 text-green-400 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center ${isRTL ? 'ml-3 mt-0.5' : 'mr-3 mt-0.5'}`}>1</div>
            <span className="text-gray-300">
              {t('ramadan.stayHydrated')}
            </span>
          </li>
          <li className={`flex items-start ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <div className={`bg-green-500/10 text-green-400 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center ${isRTL ? 'ml-3 mt-0.5' : 'mr-3 mt-0.5'}`}>2</div>
            <span className="text-gray-300">
              {t('ramadan.eatBalancedSuhoor')}
            </span>
          </li>
          <li className={`flex items-start ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <div className={`bg-green-500/10 text-green-400 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center ${isRTL ? 'ml-3 mt-0.5' : 'mr-3 mt-0.5'}`}>3</div>
            <span className="text-gray-300">
              {t('ramadan.breakFastWithDates')}
            </span>
          </li>
          <li className={`flex items-start ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <div className={`bg-green-500/10 text-green-400 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center ${isRTL ? 'ml-3 mt-0.5' : 'mr-3 mt-0.5'}`}>4</div>
            <span className="text-gray-300">
              {t('ramadan.planTaraweeh')}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RamadanTab;