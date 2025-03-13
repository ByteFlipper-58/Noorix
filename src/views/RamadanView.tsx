import React from 'react';
import RamadanTab from '../components/RamadanTab';
import PageTransition from '../components/PageTransition';

const RamadanView: React.FC = () => {
  return (
    <PageTransition>
      <RamadanTab />
    </PageTransition>
  );
};

export default RamadanView;