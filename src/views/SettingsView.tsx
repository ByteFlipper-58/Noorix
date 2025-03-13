import React from 'react';
import SettingsTab from '../components/SettingsTab';
import PageTransition from '../components/PageTransition';

const SettingsView: React.FC = () => {
  return (
    <PageTransition>
      <SettingsTab />
    </PageTransition>
  );
};

export default SettingsView;