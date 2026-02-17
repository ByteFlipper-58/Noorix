import React from 'react';
import PrayerTimesTab from '../components/PrayerTimesTab';
import AyahOfDay from '../components/AyahOfDay';
import PageTransition from '../components/PageTransition';

const PrayerTimesView: React.FC = () => {
  return (
    <PageTransition>
      <PrayerTimesTab />
      <div className="mt-5">
        <AyahOfDay />
      </div>
    </PageTransition>
  );
};

export default PrayerTimesView;