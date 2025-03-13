import React from 'react';
import IslamicCalendarTab from '../components/IslamicCalendarTab';
import PageTransition from '../components/PageTransition';

const IslamicCalendarView: React.FC = () => {
  return (
    <PageTransition>
      <IslamicCalendarTab />
    </PageTransition>
  );
};

export default IslamicCalendarView;