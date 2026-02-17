import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Moon, Calendar, Compass, CircleDot, MoreHorizontal } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';
import { logAnalyticsEvent } from '../firebase/firebase';

interface NavigationProps {
  orientation: 'horizontal' | 'vertical';
}

interface TabItem {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  primary: boolean;       // shown in mobile bottom bar
  desktopHidden: boolean; // hidden from desktop sidebar
}

const Navigation: React.FC<NavigationProps> = ({ orientation }) => {
  const { t, isRTL } = useLocalization();
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const allTabs: TabItem[] = [
    {
      id: 'prayer', path: '/',
      label: t('navigation.prayerTimes'),
      icon: <Clock size={20} />,
      primary: true, desktopHidden: false
    },
    {
      id: 'ramadan', path: '/ramadan',
      label: t('navigation.ramadan'),
      icon: <Moon size={20} />,
      primary: true, desktopHidden: false
    },
    {
      id: 'calendar', path: '/calendar',
      label: t('navigation.islamicCalendar'),
      icon: <Calendar size={20} />,
      primary: false, desktopHidden: false
    },
    {
      id: 'qibla', path: '/qibla',
      label: t('navigation.qibla'),
      icon: <Compass size={20} />,
      primary: false, desktopHidden: true
    },
    {
      id: 'tasbih', path: '/tasbih',
      label: t('navigation.tasbih'),
      icon: <CircleDot size={20} />,
      primary: false, desktopHidden: true
    },
    {
      id: 'location', path: '/location',
      label: t('navigation.location'),
      icon: <MapPin size={20} />,
      primary: false, desktopHidden: false
    }
  ];

  const isHorizontal = orientation === 'horizontal';
  const primaryTabs = allTabs.filter(t => t.primary);
  const moreTabs = allTabs.filter(t => !t.primary);
  const desktopTabs = allTabs.filter(t => !t.desktopHidden);

  const isMoreActive = moreTabs.some(tab => location.pathname === tab.path);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    if (moreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreOpen]);

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  const handleNavigation = (tabId: string, path: string) => {
    if (location.pathname !== path) {
      logAnalyticsEvent('navigation', {
        from: location.pathname,
        to: path,
        tabId: tabId
      });
    }
  };

  const renderTab = (tab: TabItem) => (
    <NavLink
      key={tab.id}
      to={tab.path}
      onClick={() => handleNavigation(tab.id, tab.path)}
      className={({ isActive }) => `
        ${isHorizontal
          ? 'py-3 flex-1 relative'
          : 'py-3 px-4 rounded-xl transition-all duration-300'}
        flex ${isHorizontal ? 'flex-col' : ''} items-center 
        ${!isHorizontal && (isRTL ? 'justify-end' : 'justify-start')} 
        ${isActive
          ? isHorizontal
            ? 'text-emerald-400 font-medium'
            : 'text-emerald-400 font-medium bg-emerald-500/15 shadow-glow-sm'
          : isHorizontal
            ? 'text-gray-500 hover:text-gray-300'
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.06]'
        }
        transition-all duration-300
      `}
    >
      <span className={`
        ${isHorizontal ? '' : (isRTL ? 'ml-3' : 'mr-3')}
        transition-all duration-300
      `}>{tab.icon}</span>

      <span className={`${isHorizontal ? 'text-[10px] mt-1 font-medium' : 'text-sm font-medium'}`}>{tab.label}</span>

      {isHorizontal && (
        <span
          className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${location.pathname === tab.path
            ? 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
            : 'bg-transparent'
            }`}
        />
      )}
    </NavLink>
  );

  // Desktop sidebar — show all except desktopHidden
  if (!isHorizontal) {
    return (
      <nav className="flex flex-col gap-1">
        {desktopTabs.map(renderTab)}
      </nav>
    );
  }

  // Mobile bottom bar — primary tabs + "More"
  return (
    <nav className="flex justify-around relative">
      {primaryTabs.map(renderTab)}

      <div ref={moreRef} className="flex-1 relative">
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className={`
            w-full py-3 flex flex-col items-center relative
            transition-all duration-300
            ${isMoreActive || moreOpen ? 'text-emerald-400 font-medium' : 'text-gray-500 hover:text-gray-300'}
          `}
        >
          <MoreHorizontal size={20} />
          <span className="text-[10px] mt-1 font-medium">
            {t('navigation.more')}
          </span>
          <span
            className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${isMoreActive
              ? 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
              : 'bg-transparent'
              }`}
          />
        </button>

        {moreOpen && (
          <div className={`absolute bottom-full mb-2 w-56 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#111827]/95 backdrop-blur-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)] z-50 ${isRTL ? 'left-0' : 'right-0'}`}>
            {moreTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  handleNavigation(tab.id, tab.path);
                  navigate(tab.path);
                  setMoreOpen(false);
                }}
                className={`
                  w-full px-4 py-3.5 flex items-center gap-3
                  transition-all duration-200
                  ${location.pathname === tab.path
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                  }
                `}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;