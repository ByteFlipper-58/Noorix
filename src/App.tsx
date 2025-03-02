import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import PrayerTimesView from './views/PrayerTimesView';
import RamadanView from './views/RamadanView';
import LocationView from './views/LocationView';
import SettingsView from './views/SettingsView';
import PrivacyPolicyView from './views/PrivacyPolicyView';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
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
    </AppProvider>
  );
}

export default App;