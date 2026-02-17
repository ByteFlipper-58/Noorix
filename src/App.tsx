import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import PrayerTimesView from './views/PrayerTimesView';
import RamadanView from './views/RamadanView';
import IslamicCalendarView from './views/IslamicCalendarView';
import LocationView from './views/LocationView';
import SettingsView from './views/SettingsView';
import PrivacyPolicyView from './views/PrivacyPolicyView';
import QiblaView from './views/QiblaView';
import TasbihView from './views/TasbihView';
import UserGuide from './components/UserGuide';
import { useAppContext } from './context/AppContext';

const AnimatedRoutes = () => {
  const location = useLocation();
  const { isFirstVisit, setIsFirstVisit } = useAppContext();
  const [showUserGuide, setShowUserGuide] = useState(isFirstVisit);

  useEffect(() => {
    setShowUserGuide(isFirstVisit);
  }, [isFirstVisit]);

  const handleCloseGuide = () => {
    setShowUserGuide(false);
    setIsFirstVisit(false);
  };

  return (
    <Layout>
      {showUserGuide && <UserGuide onClose={handleCloseGuide} initialStep={0} />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PrayerTimesView />} />
          <Route path="/ramadan" element={<RamadanView />} />
          <Route path="/calendar" element={<IslamicCalendarView />} />
          <Route path="/location" element={<LocationView />} />
          <Route path="/qibla" element={<QiblaView />} />
          <Route path="/tasbih" element={<TasbihView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/privacy" element={<PrivacyPolicyView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AppProvider>
  );
}

export default App