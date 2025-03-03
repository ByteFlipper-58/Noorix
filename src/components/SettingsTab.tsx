import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getCalculationMethodName, getMadhabName } from '../data/cities';
import { Bell, BellOff, Clock, Globe, Shield, Code, ChevronDown } from 'lucide-react';
import { requestNotificationPermission } from '../services/prayerTimeService';
import { CalculationMethod, MadhabType, Language } from '../types';
import useLocalization from '../hooks/useLocalization';

const SettingsTab: React.FC = () => {
  const { settings, updateSettings } = useAppContext();
  const { t, isRTL } = useLocalization();
  const navigate = useNavigate();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  
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
  
  const handleLanguageChange = (language: Language) => {
    updateSettings({ language });
    setLanguageDropdownOpen(false);
  };
  
  const languageNames: Record<Language, string> = {
    'en': 'English',
    'ru': 'Русский',
    'ar': 'العربية',
    'tr': 'Türkçe',
    'tt': 'Татарча'
  };
  
  return (
    <div className={`${isRTL ? 'text-right' : ''} max-w-4xl mx-auto`}>
      <h2 className="text-2xl font-semibold mb-4">
        {t('settings.settings')}
      </h2>
      
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <h3 className="font-medium mb-4 text-lg">
            {t('settings.language')}
          </h3>
          <div className="relative">
            <button
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <span className="text-lg">{languageNames[settings.language]}</span>
              <ChevronDown size={20} className={`transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {languageDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
                {Object.entries(languageNames).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code as Language)}
                    className={`
                      w-full text-left py-3 px-4 hover:bg-gray-700 transition-colors
                      ${settings.language === code ? 'bg-green-900/20 text-green-400' : ''}
                    `}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <h3 className="font-medium mb-4 text-lg">
            {t('settings.calculationMethod')}
          </h3>
          <select
            value={settings.calculationMethod}
            onChange={handleCalculationMethodChange}
            className={`w-full p-3 border dark:border-gray-700 rounded-xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${isRTL ? 'text-right' : ''} text-lg`}
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
          <p className={`mt-3 text-sm text-gray-400 ${isRTL ? 'text-right' : ''}`}>
            {t('settings.current')}: {getCalculationMethodName(settings.calculationMethod)}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <h3 className="font-medium mb-4 text-lg">
            {t('settings.asrCalculation')}
          </h3>
          <select
            value={settings.madhab}
            onChange={handleMadhabChange}
            className={`w-full p-3 border dark:border-gray-700 rounded-xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${isRTL ? 'text-right' : ''} text-lg`}
          >
            <option value={0}>Shafi'i (Standard)</option>
            <option value={1}>Hanafi</option>
          </select>
          <p className={`mt-3 text-sm text-gray-400 ${isRTL ? 'text-right' : ''}`}>
            {t('settings.current')}: {getMadhabName(settings.madhab)}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <h3 className="font-medium mb-4 text-lg">
            {t('settings.timeFormat')}
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={() => handleTimeFormatChange('12h')}
              className={`
                flex-1 py-3 px-4 rounded-xl border transition-colors
                ${settings.timeFormat === '12h'
                  ? 'bg-green-900/20 border-green-800 text-green-400'
                  : 'border-gray-700 hover:bg-gray-700'}
              `}
            >
              <div className="flex items-center justify-center">
                <Clock size={18} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className="text-lg">{t('settings.hour12')}</span>
              </div>
            </button>
            <button
              onClick={() => handleTimeFormatChange('24h')}
              className={`
                flex-1 py-3 px-4 rounded-xl border transition-colors
                ${settings.timeFormat === '24h'
                  ? 'bg-green-900/20 border-green-800 text-green-400'
                  : 'border-gray-700 hover:bg-gray-700'}
              `}
            >
              <div className="flex items-center justify-center">
                <Clock size={18} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className="text-lg">{t('settings.hour24')}</span>
              </div>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <h3 className="font-medium mb-4 text-lg">
            {t('settings.notifications')}
          </h3>
          <button
            onClick={toggleNotifications}
            className={`
              w-full py-3 px-4 rounded-xl border transition-colors flex items-center justify-center
              ${settings.notifications
                ? 'bg-green-900/20 border-green-800 text-green-400'
                : 'border-gray-700 hover:bg-gray-700'}
            `}
          >
            {settings.notifications ? (
              <>
                <Bell size={20} className={`${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span className="text-lg">{t('settings.notificationsEnabled')}</span>
              </>
            ) : (
              <>
                <BellOff size={20} className={`${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span className="text-lg">{t('settings.enableNotifications')}</span>
              </>
            )}
          </button>
          <p className={`mt-3 text-sm text-gray-400 ${isRTL ? 'text-right' : ''}`}>
            {settings.notifications
              ? t('settings.notificationsDescription')
              : t('settings.enableToReceive')}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <h3 className="font-medium mb-4 text-lg">
            {t('settings.privacy')}
          </h3>
          <button
            onClick={() => navigate('/privacy')}
            className="w-full py-3 px-4 rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <Shield size={20} className={`${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span className="text-lg">{t('settings.privacyPolicy')}</span>
          </button>
          <p className={`mt-3 text-sm text-gray-400 ${isRTL ? 'text-right' : ''}`}>
            {t('settings.learnHow')}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <h3 className="font-medium mb-4 text-lg">
            {t('settings.developer')}
          </h3>
          <div className="flex items-center mb-3">
            <Code size={20} className={`text-green-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span className="font-medium text-lg">{t('settings.developedBy')} ByteFlipper</span>
          </div>
          <div className="space-y-2 mt-4 text-sm text-gray-400">
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