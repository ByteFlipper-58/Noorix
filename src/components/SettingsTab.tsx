import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

import {
  Bell, BellOff, Clock, Globe, Shield, Code, ChevronDown,
  ChevronRight, ExternalLink, Calculator, Compass,
  Send, Globe2
} from 'lucide-react';
import { requestNotificationPermission } from '../services/prayerTimeService';
import { CalculationMethod, MadhabType, Language } from '../types';
import useLocalization from '../hooks/useLocalization';

const SettingsTab: React.FC = () => {
  const { settings, updateSettings } = useAppContext();
  const { t, isRTL } = useLocalization();
  const navigate = useNavigate();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setLanguageDropdownOpen(false);
      }
      if (calcRef.current && !calcRef.current.contains(e.target as Node)) {
        setCalcDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCalculationMethodChange = (value: number) => {
    updateSettings({ calculationMethod: value as CalculationMethod });
    setCalcDropdownOpen(false);
  };

  const handleMadhabChange = (value: number) => {
    updateSettings({ madhab: value as MadhabType });
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

  const languageOptions: { code: Language; name: string; native: string; flag: string }[] = [
    { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
    { code: 'tt', name: 'Tatar', native: 'Татарча', flag: '🏳️' },
  ];

  const calculationMethods = [
    { value: 0, name: "Shafi'i, Maliki, Ja'fari, Hanbali" },
    { value: 1, name: "Hanafi" },
    { value: 2, name: "Islamic Society of North America" },
    { value: 3, name: "Muslim World League" },
    { value: 4, name: "Umm Al-Qura University, Makkah" },
    { value: 5, name: "Egyptian General Authority of Survey" },
    { value: 7, name: "Institute of Geophysics, Tehran" },
    { value: 8, name: "Gulf Region" },
    { value: 9, name: "Kuwait" },
    { value: 10, name: "Qatar" },
    { value: 11, name: "Majlis Ugama Islam Singapura" },
    { value: 12, name: "Union Organization Islamic de France" },
    { value: 13, name: "Diyanet İşleri Başkanlığı, Turkey" },
    { value: 14, name: "Spiritual Administration of Muslims of Russia" },
    { value: 15, name: "Moonsighting Committee Worldwide" },
  ];

  const currentLang = languageOptions.find(l => l.code === settings.language);
  const currentCalc = calculationMethods.find(m => m.value === settings.calculationMethod);

  return (
    <div className={`${isRTL ? 'text-right' : ''}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-100">
          {t('settings.settings')}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{t('settings.customizeApp')}</p>
      </div>

      <div className="space-y-3">

        {/* ═══════════ LANGUAGE ═══════════ */}
        <div ref={languageRef} className="relative">
          <button
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            className={`
              w-full glass-card rounded-2xl p-4 flex items-center transition-all duration-300
              ${languageDropdownOpen ? 'ring-1 ring-emerald-500/30' : ''}
            `}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center flex-shrink-0">
              <Globe className="text-blue-400" size={20} />
            </div>
            <div className={`flex-1 ${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'}`}>
              <p className="text-sm text-gray-500">{t('settings.language')}</p>
              <p className="font-medium text-gray-200 mt-0.5">
                {currentLang?.flag} {currentLang?.native}
              </p>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-600 transition-transform duration-300 ${languageDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {languageDropdownOpen && (
            <div className="absolute z-20 mt-1.5 w-full bg-[#111827]/98 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden animate-in">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`
                    w-full flex items-center py-3.5 px-4 transition-all duration-200
                    ${settings.language === lang.code
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'hover:bg-white/[0.04] text-gray-300'}
                  `}
                >
                  <span className="text-lg mr-3">{lang.flag}</span>
                  <span className="font-medium">{lang.native}</span>
                  {settings.language === lang.code && (
                    <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════ TIME FORMAT ═══════════ */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center flex-shrink-0">
              <Clock className="text-purple-400" size={20} />
            </div>
            <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
              <p className="text-sm text-gray-500">{t('settings.timeFormat')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['12h', '24h'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleTimeFormatChange(fmt)}
                className={`
                  relative py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 overflow-hidden
                  ${settings.timeFormat === fmt
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                    : 'bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-gray-200'}
                `}
              >
                {settings.timeFormat === fmt && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                )}
                <span className="text-lg font-semibold tabular-nums">
                  {fmt === '12h' ? '1:30 PM' : '13:30'}
                </span>
                <p className="text-xs mt-0.5 opacity-60">{t(`settings.hour${fmt.replace('h', '')}`)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════ CALCULATION METHOD ═══════════ */}
        <div ref={calcRef} className="relative">
          <button
            onClick={() => setCalcDropdownOpen(!calcDropdownOpen)}
            className={`
              w-full glass-card rounded-2xl p-4 flex items-center transition-all duration-300
              ${calcDropdownOpen ? 'ring-1 ring-emerald-500/30' : ''}
            `}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center flex-shrink-0">
              <Compass className="text-amber-400" size={20} />
            </div>
            <div className={`flex-1 min-w-0 ${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'}`}>
              <p className="text-sm text-gray-500">{t('settings.calculationMethod')}</p>
              <p className="font-medium text-gray-200 mt-0.5 truncate">
                {currentCalc?.name || '--'}
              </p>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-600 transition-transform duration-300 flex-shrink-0 ${calcDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {calcDropdownOpen && (
            <div className="absolute z-20 mt-1.5 w-full bg-[#111827]/98 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden max-h-72 overflow-y-auto">
              {calculationMethods.map((method) => (
                <button
                  key={method.value}
                  onClick={() => handleCalculationMethodChange(method.value)}
                  className={`
                    w-full text-left py-3 px-4 transition-all duration-200 text-sm
                    ${settings.calculationMethod === method.value
                      ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                      : 'hover:bg-white/[0.04] text-gray-300'}
                  `}
                >
                  <span>{method.name}</span>
                  {settings.calculationMethod === method.value && (
                    <div className="inline-block ml-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════ ASR MADHAB ═══════════ */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center flex-shrink-0">
              <Calculator className="text-cyan-400" size={20} />
            </div>
            <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
              <p className="text-sm text-gray-500">{t('settings.asrCalculation')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: 0, label: "Shafi'i" },
              { value: 1, label: "Hanafi" }
            ]).map((madhab) => (
              <button
                key={madhab.value}
                onClick={() => handleMadhabChange(madhab.value)}
                className={`
                  relative py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300
                  ${settings.madhab === madhab.value
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                    : 'bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-gray-200'}
                `}
              >
                {settings.madhab === madhab.value && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                )}
                <span className="font-semibold">{madhab.label}</span>
                <p className="text-xs mt-0.5 opacity-60">
                  {madhab.value === 0 ? 'Standard' : 'Later Asr'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════ NOTIFICATIONS (toggle) ═══════════ */}
        <button
          onClick={toggleNotifications}
          className="w-full glass-card rounded-2xl p-4 flex items-center transition-all duration-300 group"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${settings.notifications
            ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10'
            : 'bg-gradient-to-br from-gray-500/20 to-gray-600/10'
            }`}>
            {settings.notifications
              ? <Bell className="text-emerald-400" size={20} />
              : <BellOff className="text-gray-500" size={20} />}
          </div>
          <div className={`flex-1 ${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'}`}>
            <p className="text-sm text-gray-500">{t('settings.notifications')}</p>
            <p className={`font-medium mt-0.5 ${settings.notifications ? 'text-emerald-400' : 'text-gray-400'}`}>
              {settings.notifications
                ? t('settings.notificationsEnabled')
                : t('settings.enableNotifications')}
            </p>
          </div>
          {/* Toggle switch */}
          <div className={`
            w-12 h-7 rounded-full relative transition-all duration-300 flex-shrink-0
            ${settings.notifications
              ? 'bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'bg-white/[0.08]'}
          `}>
            <div className={`
              absolute top-1 w-5 h-5 rounded-full transition-all duration-300 shadow-md
              ${settings.notifications
                ? 'left-6 bg-emerald-400'
                : 'left-1 bg-gray-500'}
            `} />
          </div>
        </button>

        {/* ═══════════ DIVIDER ═══════════ */}
        <div className="py-1">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        {/* ═══════════ PRIVACY ═══════════ */}
        <button
          onClick={() => navigate('/privacy')}
          className="w-full glass-card rounded-2xl p-4 flex items-center transition-all duration-300 group hover:bg-white/[0.04]"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 flex items-center justify-center flex-shrink-0">
            <Shield className="text-rose-400" size={20} />
          </div>
          <div className={`flex-1 ${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'}`}>
            <p className="font-medium text-gray-200">{t('settings.privacyPolicy')}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('settings.learnHow')}</p>
          </div>
          <ChevronRight size={18} className="text-gray-600 group-hover:text-gray-400 transition-colors duration-300 flex-shrink-0" />
        </button>

        {/* ═══════════ DEVELOPER CARD ═══════════ */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Dev header with gradient */}
          <div className="relative p-5 pb-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/15 via-transparent to-transparent" />
            <div className="relative flex items-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/15">
                <Code className="text-emerald-400" size={22} />
              </div>
              <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                <p className="font-semibold text-gray-200">ByteFlipper</p>
                <p className="text-xs text-gray-500 mt-0.5">{t('settings.developer')}</p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="divide-y divide-white/[0.04]">
            {[
              { icon: <Globe2 size={16} />, label: 'byteflipper.web.app', url: 'https://byteflipper.web.app', color: 'text-blue-400' },
              { icon: <Send size={16} />, label: 'Telegram', url: 'https://t.me/byteflipper', color: 'text-sky-400' },
              { icon: <Globe size={16} />, label: 'VK', url: 'https://vk.com/byteflipper', color: 'text-indigo-400' },
            ].map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-5 py-3 hover:bg-white/[0.03] transition-colors duration-200 group"
              >
                <span className={`${link.color} ${isRTL ? 'ml-3' : 'mr-3'}`}>{link.icon}</span>
                <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors duration-200">{link.label}</span>
                <ExternalLink size={14} className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-gray-700 group-hover:text-gray-500 transition-colors duration-200`} />
              </a>
            ))}
          </div>

          {/* Version */}
          <div className="px-5 py-3 border-t border-white/[0.04]">
            <p className="text-xs text-gray-600 text-center tabular-nums">Noorix v1.0.1</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsTab;