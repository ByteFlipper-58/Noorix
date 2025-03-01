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
      <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center fixed top-0 left-0 right-0 z-10 bg-gray-900">
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
      
      <main className="flex-1 flex mt-16 mb-16 md:mb-0">
        {/* Desktop sidebar - only visible on larger screens */}
        <div className="hidden md:block w-64 border-r dark:border-gray-700 fixed left-0 top-16 bottom-0 overflow-y-auto">
          <Navigation orientation="vertical" />
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-4 overflow-y-auto md:ml-64">
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