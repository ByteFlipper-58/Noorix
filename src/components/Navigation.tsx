import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Clock, MapPin, Moon } from 'lucide-react';

interface NavigationProps {
  orientation: 'horizontal' | 'vertical';
}

const Navigation: React.FC<NavigationProps> = ({ orientation }) => {
  const { activeTab, setActiveTab, settings } = useAppContext();
  
  const translations = {
    prayerTimes: {
      en: 'Prayer Times',
      ru: 'Время Молитв',
      ar: 'أوقات الصلاة'
    },
    ramadan: {
      en: 'Ramadan',
      ru: 'Рамадан',
      ar: 'رمضان'
    },
    location: {
      en: 'Location',
      ru: 'Местоположение',
      ar: 'الموقع'
    }
  };
  
  const tabs = [
    { 
      id: 'prayer', 
      label: translations.prayerTimes[settings.language], 
      icon: <Clock size={20} /> 
    },
    { 
      id: 'ramadan', 
      label: translations.ramadan[settings.language], 
      icon: <Moon size={20} /> 
    },
    { 
      id: 'location', 
      label: translations.location[settings.language], 
      icon: <MapPin size={20} /> 
    }
  ];
  
  const isHorizontal = orientation === 'horizontal';
  const isRTL = settings.language === 'ar';
  
  const handleTabClick = (tabId: string, customOnClick?: () => boolean) => {
    if (customOnClick) {
      const shouldChangeTab = customOnClick();
      if (!shouldChangeTab) return;
    }
    setActiveTab(tabId);
  };
  
  return (
    <nav className={`${isHorizontal ? 'flex justify-around' : 'flex flex-col py-4'}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id, tab.onClick)}
          className={`
            ${isHorizontal ? 'py-3 flex-1' : 'py-3 px-4 mb-2'}
            flex ${isHorizontal ? 'flex-col' : ''} items-center 
            ${!isHorizontal && (isRTL ? 'justify-end' : 'justify-start')} 
            ${activeTab === tab.id 
              ? 'text-green-600 dark:text-green-400 font-medium' 
              : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
            }
            transition-colors
          `}
          aria-current={activeTab === tab.id ? 'page' : undefined}
        >
          <span className={`
            ${isHorizontal ? '' : (isRTL ? 'mr-3' : 'mr-3')}
          `}>{tab.icon}</span>
          <span className={`${isHorizontal ? 'text-xs mt-1' : 'text-sm'}`}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;