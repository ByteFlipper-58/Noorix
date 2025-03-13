import React from 'react';
import PrayerTimesTab from '../components/PrayerTimesTab';
import PageTransition from '../components/PageTransition';

const PrayerTimesView: React.FC = () => {
  return (
    <PageTransition>
      <PrayerTimesTab />
    </PageTransition>
  );
};

export default PrayerTimesView;