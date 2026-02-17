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
    <div className={`min-h-screen flex flex-col bg-surface-deep text-gray-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Mobile header — glassmorphism */}
      <header className="md:hidden p-3 flex justify-between items-center fixed top-0 left-0 right-0 z-10 bg-surface-deep/80 backdrop-blur-lg gradient-border-b">
        <div className="flex items-center">
          <div className="relative">
            <Moon className="text-emerald-400 mr-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" size={24} />
          </div>
          <h1 className="text-xl font-semibold text-emerald-400">
            Noorix
          </h1>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className={`p-2 rounded-xl transition-all duration-300 ${location.pathname === '/settings' ? 'bg-emerald-500/15 text-emerald-400 shadow-glow-sm' : 'text-gray-400 hover:bg-white/[0.06] hover:text-gray-200'}`}
          aria-label="Open Settings"
        >
          <Settings size={22} />
        </button>
      </header>

      <main className="flex-1 flex md:h-screen">
        {/* Desktop sidebar — glassmorphism */}
        <div className="hidden md:flex md:flex-col w-64 fixed left-0 top-0 bottom-0 overflow-y-auto bg-surface-deep/60 backdrop-blur-xl gradient-border-r z-20">
          {/* Logo */}
          <div className="p-6 flex items-center">
            <div className="relative mr-3">
              <Moon className="text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]" size={26} />
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-lg"></div>
            </div>
            <h1 className="text-xl font-semibold text-emerald-400 tracking-tight">
              Noorix
            </h1>
          </div>

          {/* Gradient divider */}
          <div className="mx-4 h-px bg-gradient-to-r from-emerald-500/30 via-emerald-500/10 to-transparent"></div>

          <div className="flex-1 py-6 px-3">
            <Navigation orientation="vertical" />
          </div>

          {/* Gradient divider */}
          <div className="mx-4 h-px bg-gradient-to-r from-emerald-500/20 via-white/5 to-transparent"></div>

          {/* Settings button */}
          <div className="px-3 py-4">
            <button
              onClick={() => navigate('/settings')}
              className={`w-full flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${isRTL ? 'justify-end' : 'justify-start'} 
                ${location.pathname === '/settings'
                  ? 'bg-emerald-500/15 text-emerald-400 shadow-glow-sm'
                  : 'text-gray-400 hover:bg-white/[0.06] hover:text-gray-200'}`}
              aria-label="Open Settings"
            >
              <Settings size={19} className={`${isRTL ? 'ml-3' : 'mr-3'} transition-transform duration-300 group-hover:rotate-90`} />
              <span className="text-sm font-medium">
                {t('settings.settings')}
              </span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 pt-4 pb-6 md:p-8 md:pt-10 md:pb-12 overflow-y-auto md:ml-64 mt-16 mb-16 md:mt-0 md:mb-0">
          <div className="w-full md:w-[85%] mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile bottom navigation — glassmorphism */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-surface-deep/80 backdrop-blur-lg gradient-border-t">
        <Navigation orientation="horizontal" />
      </div>
    </div>
  );
};

export default Layout;