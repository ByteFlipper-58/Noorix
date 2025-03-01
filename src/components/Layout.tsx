import React from 'react';
import { useAppContext } from '../context/AppContext';
import Navigation from './Navigation';
import { Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { setActiveTab, settings } = useAppContext();
  
  const openSettings = () => {
    setActiveTab('settings');
  };
  
  const isRTL = settings.language === 'ar';
  
  return (
    <div className={`min-h-screen flex flex-col dark bg-gray-900 text-white ${isRTL ? 'rtl' : 'ltr'}`}>
      <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-600 dark:text-green-400">
          Noorix
        </h1>
        <button 
          onClick={openSettings}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Open Settings"
        >
          <Settings size={20} />
        </button>
      </header>
      
      <main className="flex-1 flex">
        {/* Desktop sidebar - only visible on larger screens */}
        <div className="hidden md:block w-64 border-r dark:border-gray-700">
          <Navigation orientation="vertical" />
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {children}
        </div>
      </main>
      
      {/* Mobile bottom navigation - only visible on smaller screens */}
      <div className="md:hidden border-t dark:border-gray-700">
        <Navigation orientation="horizontal" />
      </div>
    </div>
  );
};

export default Layout;