import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import PrayerTimesTab from './components/PrayerTimesTab';
import RamadanTab from './components/RamadanTab';
import LocationTab from './components/LocationTab';
import SettingsTab from './components/SettingsTab';
import PrivacyPolicyTab from './components/PrivacyPolicyTab';

const AppContent: React.FC = () => {
  const { activeTab } = useAppContext();
  
  return (
    <Layout>
      {activeTab === 'prayer' && <PrayerTimesTab />}
      {activeTab === 'ramadan' && <RamadanTab />}
      {activeTab === 'location' && <LocationTab />}
      {activeTab === 'settings' && <SettingsTab />}
      {activeTab === 'privacy' && <PrivacyPolicyTab />}
    </Layout>
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