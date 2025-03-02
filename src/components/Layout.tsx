import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Navigation from './Navigation';
import { Moon, Settings } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, isRTL } = useLocalization();
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className={`min-h-screen flex flex-col dark bg-gray-900 text-white ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Mobile header - only visible on mobile */}
      <header className="md:hidden p-4 border-b dark:border-gray-700 flex justify-between items-center fixed top-0 left-0 right-0 z-10 bg-gray-900">
        <div className="flex items-center">
          <Moon className="text-green-500 mr-2" size={24} />
          <h1 className="text-xl font-bold text-green-500 dark:text-green-400">
            Noorix
          </h1>
        </div>
        <button 
          onClick={() => navigate('/settings')}
          className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${location.pathname === '/settings' ? 'bg-gray-700 text-green-400' : ''}`}
          aria-label="Open Settings"
        >
          <Settings size={22} />
        </button>
      </header>
      
      <main className="flex-1 flex md:h-screen">
        {/* Desktop sidebar - full height on desktop */}
        <div className="hidden md:flex md:flex-col w-72 border-r dark:border-gray-700 fixed left-0 top-0 bottom-0 overflow-y-auto bg-gray-800/30">
          {/* Logo and app name at the top of sidebar on desktop */}
          <div className="p-6 border-b border-gray-700 flex items-center">
            <Moon className="text-green-500 mr-3" size={26} />
            <h1 className="text-xl font-bold text-green-500 dark:text-green-400">
              Noorix
            </h1>
          </div>
          
          <div className="flex-1 py-6 px-4">
            <Navigation orientation="vertical" />
          </div>
          
          {/* Settings button at the bottom of sidebar on desktop */}
          <div className="px-4 py-6 border-t border-gray-700">
            <button 
              onClick={() => navigate('/settings')}
              className={`w-full flex items-center py-4 px-6 rounded-xl transition-all ${isRTL ? 'justify-end' : 'justify-start'} 
                ${location.pathname === '/settings' 
                  ? 'text-green-500 dark:text-green-400 font-medium bg-green-900/20 border-l-4 border-green-500' 
                  : 'text-gray-400 hover:text-green-400 hover:bg-gray-700/30'}`}
              aria-label="Open Settings"
            >
              <Settings size={20} className={`${isRTL ? 'ml-3' : 'mr-3'}`} />
              <span className="text-sm font-medium">
                {t('settings.settings')}
              </span>
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-4 pt-6 pb-8 md:p-8 md:pt-10 md:pb-12 overflow-y-auto md:ml-72 mt-16 mb-16 md:mt-0 md:mb-0">
          {children}
        </div>
      </main>
      
      {/* Mobile bottom navigation - only visible on smaller screens */}
      <div className="md:hidden border-t dark:border-gray-700 fixed bottom-0 left-0 right-0 z-10 bg-gray-900">
        <Navigation orientation="horizontal" />
      </div>
    </div>
  );
};

export default Layout;