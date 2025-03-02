import React from 'react';
import { NavLink } from 'react-router-dom';
import { Clock, MapPin, Moon } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';

interface NavigationProps {
  orientation: 'horizontal' | 'vertical';
}

const Navigation: React.FC<NavigationProps> = ({ orientation }) => {
  const { t, isRTL } = useLocalization();
  
  const tabs = [
    { 
      id: 'prayer', 
      path: '/',
      label: t('navigation.prayerTimes'), 
      icon: <Clock size={20} /> 
    },
    { 
      id: 'ramadan', 
      path: '/ramadan',
      label: t('navigation.ramadan'), 
      icon: <Moon size={20} /> 
    },
    { 
      id: 'location', 
      path: '/location',
      label: t('navigation.location'), 
      icon: <MapPin size={20} /> 
    }
  ];
  
  const isHorizontal = orientation === 'horizontal';
  
  return (
    <nav className={`${isHorizontal ? 'flex justify-around' : 'flex flex-col py-4'}`}>
      {tabs.map(tab => (
        <NavLink
          key={tab.id}
          to={tab.path}
          className={({ isActive }) => `
            ${isHorizontal ? 'py-3 flex-1' : 'py-3 px-4 mb-2'}
            flex ${isHorizontal ? 'flex-col' : ''} items-center 
            ${!isHorizontal && (isRTL ? 'justify-end' : 'justify-start')} 
            ${isActive 
              ? 'text-green-600 dark:text-green-400 font-medium' 
              : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
            }
            transition-colors
          `}
        >
          <span className={`
            ${isHorizontal ? '' : (isRTL ? 'mr-3' : 'mr-3')}
          `}>{tab.icon}</span>
          <span className={`${isHorizontal ? 'text-xs mt-1' : 'text-sm'}`}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;