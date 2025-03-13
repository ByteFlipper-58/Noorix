import React from 'react';
import PrivacyPolicyTab from '../components/PrivacyPolicyTab';
import PageTransition from '../components/PageTransition';

const PrivacyPolicyView: React.FC = () => {
  return (
    <PageTransition>
      <PrivacyPolicyTab />
    </PageTransition>
  );
};

export default PrivacyPolicyView;