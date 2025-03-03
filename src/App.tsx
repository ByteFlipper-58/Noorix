import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import PrayerTimesView from './views/PrayerTimesView';
import RamadanView from './views/RamadanView';
import LocationView from './views/LocationView';
import SettingsView from './views/SettingsView';
import PrivacyPolicyView from './views/PrivacyPolicyView';
import UserGuide from './components/UserGuide';
import { useAppContext } from './context/AppContext';

const AppContent = () => {
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
    <Router>
      <Layout>
        {showUserGuide && <UserGuide onClose={handleCloseGuide} initialStep={0} />}
        <Routes>
          <Route path="/" element={<PrayerTimesView />} />
          <Route path="/ramadan" element={<RamadanView />} />
          <Route path="/location" element={<LocationView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/privacy" element={<PrivacyPolicyView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;