import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getCalculationMethodName, getMadhabName } from '../data/cities';
import { Bell, BellOff, Clock, Globe, Shield, Code } from 'lucide-react';
import { requestNotificationPermission } from '../services/prayerTimeService';
import { CalculationMethod, MadhabType } from '../types';

const SettingsTab: React.FC = () => {
  const { settings, updateSettings } = useAppContext();
  const navigate = useNavigate();
  
  const handleCalculationMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ calculationMethod: Number(e.target.value) as CalculationMethod });
  };
  
  const handleMadhabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ madhab: Number(e.target.value) as MadhabType });
  };
  
  const handleTimeFormatChange = (format: '12h' | '24h') => {
    updateSettings({ timeFormat: format });
  };
  
  const toggleNotifications = async () => {
    if (!settings.notifications) {
      const granted = await requestNotificationPermission();
      if (granted) {
        updateSettings({ notifications: true });
      }
    } else {
      updateSettings({ notifications: false });
    }
  };
  
  const handleLanguageChange = (language: 'en' | 'ru' | 'ar') => {
    updateSettings({ language });
  };
  
  const isRussian = settings.language === 'ru';
  const isArabic = settings.language === 'ar';
  
  const translations = {
    settings: {
      en: 'Settings',
      ru: 'Настройки',
      ar: 'الإعدادات'
    },
    language: {
      en: 'Language',
      ru: 'Язык',
      ar: 'اللغة'
    },
    calculationMethod: {
      en: 'Prayer Calculation Method',
      ru: 'Метод расчета молитв',
      ar: 'طريقة حساب الصلاة'
    },
    current: {
      en: 'Current',
      ru: 'Текущий',
      ar: 'الحالي'
    },
    asrCalculation: {
      en: 'Asr Calculation (Madhab)',
      ru: 'Расчет Аср (Мазхаб)',
      ar: 'حساب العصر (المذهب)'
    },
    timeFormat: {
      en: 'Time Format',
      ru: 'Формат времени',
      ar: 'تنسيق الوقت'
    },
    hour12: {
      en: '12-hour',
      ru: '12-часовой',
      ar: '12 ساعة'
    },
    hour24: {
      en: '24-hour',
      ru: '24-часовой',
      ar: '24 ساعة'
    },
    notifications: {
      en: 'Notifications',
      ru: 'Уведомления',
      ar: 'الإشعارات'
    },
    notificationsEnabled: {
      en: 'Notifications Enabled',
      ru: 'Уведомления включены',
      ar: 'الإشعارات مفعلة'
    },
    enableNotifications: {
      en: 'Enable Notifications',
      ru: 'Включить уведомления',
      ar: 'تفعيل الإشعارات'
    },
    notificationsDescription: {
      en: 'You will receive notifications before prayer times',
      ru: 'Вы будете получать уведомления перед временем молитв',
      ar: 'ستتلقى إشعارات قبل أوقات الصلاة'
    },
    enableToReceive: {
      en: 'Enable to receive notifications before prayer times',
      ru: 'Включите, чтобы получать уведомления перед временем молитв',
      ar: 'قم بالتفعيل لتلقي إشعارات قبل أوقات الصلاة'
    },
    privacy: {
      en: 'Privacy',
      ru: 'Конфиденциальность',
      ar: 'الخصوصية'
    },
    privacyPolicy: {
      en: 'Privacy Policy',
      ru: 'Политика конфиденциальности',
      ar: 'سياسة الخصوصية'
    },
    learnHow: {
      en: 'Learn how we handle your data',
      ru: 'Узнайте, как мы обрабатываем ваши данные',
      ar: 'تعرف على كيفية تعاملنا مع بياناتك'
    },
    developer: {
      en: 'Developer',
      ru: 'Разработчик',
      ar: 'المطور'
    },
    developedBy: {
      en: 'Developed by',
      ru: 'Разработано',
      ar: 'تم التطوير بواسطة'
    }
  };
  
  return (
    <div className={`${isArabic ? 'text-right' : ''}`}>
      <h2 className="text-xl font-semibold mb-4">
        {translations.settings[settings.language]}
      </h2>
      
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-3">
            {translations.language[settings.language]}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`
                py-3 px-4 rounded-lg border transition-colors flex items-center justify-center
                ${settings.language === 'en' 
                  ? 'bg-green-900/20 border-green-800 text-green-400' 
                  : 'border-gray-700 hover:bg-gray-700'}
              `}
            >
              <span>English</span>
            </button>
            <button
              onClick={() => handleLanguageChange('ru')}
              className={`
                py-3 px-4 rounded-lg border transition-colors flex items-center justify-center
                ${settings.language === 'ru' 
                  ? 'bg-green-900/20 border-green-800 text-green-400' 
                  : 'border-gray-700 hover:bg-gray-700'}
              `}
            >
              <span>Русский</span>
            </button>
            <button
              onClick={() => handleLanguageChange('ar')}
              className={`
                py-3 px-4 rounded-lg border transition-colors flex items-center justify-center
                ${settings.language === 'ar' 
                  ? 'bg-green-900/20 border-green-800 text-green-400' 
                  : 'border-gray-700 hover:bg-gray-700'}
              `}
            >
              <span>العربية</span>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-3">
            {translations.calculationMethod[settings.language]}
          </h3>
          <select
            value={settings.calculationMethod}
            onChange={handleCalculationMethodChange}
            className={`w-full p-2 border dark:border-gray-700 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${isArabic ? 'text-right' : ''}`}
          >
            <option value={0}>Shafi'i, Maliki, Ja'fari, Hanbali</option>
            <option value={1}>Hanafi</option>
            <option value={2}>Islamic Society of North America</option>
            <option value={3}>Muslim World League</option>
            <option value={4}>Umm Al-Qura University, Makkah</option>
            <option value={5}>Egyptian General Authority of Survey</option>
            <option value={7}>Institute of Geophysics, University of Tehran</option>
            <option value={8}>Gulf Region</option>
            <option value={9}>Kuwait</option>
            <option value={10}>Qatar</option>
            <option value={11}>Majlis Ugama Islam Singapura, Singapore</option>
            <option value={12}>Union Organization islamic de France</option>
            <option value={13}>Diyanet İşleri Başkanlığı, Turkey</option>
            <option value={14}>Spiritual Administration of Muslims of Russia</option>
            <option value={15}>Moonsighting Committee Worldwide</option>
          </select>
          <p className={`mt-2 text-sm text-gray-400 ${isArabic ? 'text-right' : ''}`}>
            {translations.current[settings.language]}: {getCalculationMethodName(settings.calculationMethod)}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-3">
            {translations.asrCalculation[settings.language]}
          </h3>
          <select
            value={settings.madhab}
            onChange={handleMadhabChange}
            className={`w-full p-2 border dark:border-gray-700 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${isArabic ? 'text-right' : ''}`}
          >
            <option value={0}>Shafi'i (Standard)</option>
            <option value={1}>Hanafi</option>
          </select>
          <p className={`mt-2 text-sm text-gray-400 ${isArabic ? 'text-right' : ''}`}>
            {translations.current[settings.language]}: {getMadhabName(settings.madhab)}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-3">
            {translations.timeFormat[settings.language]}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleTimeFormatChange('12h')}
              className={`
                flex-1 py-2 px-4 rounded-lg border transition-colors
                ${settings.timeFormat === '12h'
                  ? 'bg-green-900/20 border-green-800 text-green-400'
                  : 'border-gray-700 hover:bg-gray-700'}
              `}
            >
              <div className="flex items-center justify-center">
                <Clock size={16} className={`${isArabic ? 'ml-1' : 'mr-1'}`} />
                <span>{translations.hour12[settings.language]}</span>
              </div>
            </button>
            <button
              onClick={() => handleTimeFormatChange('24h')}
              className={`
                flex-1 py-2 px-4 rounded-lg border transition-colors
                ${settings.timeFormat === '24h'
                  ? 'bg-green-900/20 border-green-800 text-green-400'
                  : 'border-gray-700 hover:bg-gray-700'}
              `}
            >
              <div className="flex items-center justify-center">
                <Clock size={16} className={`${isArabic ? 'ml-1' : 'mr-1'}`} />
                <span>{translations.hour24[settings.language]}</span>
              </div>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-3">
            {translations.notifications[settings.language]}
          </h3>
          <button
            onClick={toggleNotifications}
            className={`
              w-full py-3 px-4 rounded-lg border transition-colors flex items-center justify-center
              ${settings.notifications
                ? 'bg-green-900/20 border-green-800 text-green-400'
                : 'border-gray-700 hover:bg-gray-700'}
            `}
          >
            {settings.notifications ? (
              <>
                <Bell size={18} className={`${isArabic ? 'ml-2' : 'mr-2'}`} />
                <span>{translations.notificationsEnabled[settings.language]}</span>
              </>
            ) : (
              <>
                <BellOff size={18} className={`${isArabic ? 'ml-2' : 'mr-2'}`} />
                <span>{translations.enableNotifications[settings.language]}</span>
              </>
            )}
          </button>
          <p className={`mt-2 text-sm text-gray-400 ${isArabic ? 'text-right' : ''}`}>
            {settings.notifications
              ? translations.notificationsDescription[settings.language]
              : translations.enableToReceive[settings.language]}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-3">
            {translations.privacy[settings.language]}
          </h3>
          <button
            onClick={() => navigate('/privacy')}
            className="w-full py-3 px-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <Shield size={18} className={`${isArabic ? 'ml-2' : 'mr-2'}`} />
            <span>{translations.privacyPolicy[settings.language]}</span>
          </button>
          <p className={`mt-2 text-sm text-gray-400 ${isArabic ? 'text-right' : ''}`}>
            {translations.learnHow[settings.language]}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-3">
            {translations.developer[settings.language]}
          </h3>
          <div className="flex items-center mb-2">
            <Code size={18} className={`text-green-400 ${isArabic ? 'ml-2' : 'mr-2'}`} />
            <span className="font-medium">{translations.developedBy[settings.language]} ByteFlipper</span>
          </div>
          <div className="space-y-2 mt-3 text-sm text-gray-400">
            <p>
              <a href="https://byteflipper.web.app" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                byteflipper.web.app
              </a>
            </p>
            <p>
              <a href="https://t.me/byteflipper" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                t.me/byteflipper
              </a>
            </p>
            <p>
              <a href="https://vk.com/byteflipper" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                vk.com/byteflipper
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;