import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LocationTab from '../components/LocationTab';
import { ArrowLeft } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';
import UserGuide from '../components/UserGuide';
import PageTransition from '../components/PageTransition';

const LocationView: React.FC = () => {
  const location = useLocation();
  const { t, isRTL } = useLocalization();
  const [fromGuide, setFromGuide] = useState(false);
  const [showUserGuide, setShowUserGuide] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const fromGuideParam = searchParams.get('fromGuide') === 'true';
    setFromGuide(fromGuideParam);
  }, [location]);

  const handleBackToGuide = () => {
    setShowUserGuide(true);
  };

  const handleCloseGuide = () => {
    setShowUserGuide(false);
  };

  return (
    <PageTransition>
      <div>
        {showUserGuide && <UserGuide onClose={handleCloseGuide} />}
        
        {fromGuide && (
          <button 
            onClick={handleBackToGuide}
            className={`flex items-center text-green-500 hover:text-green-400 mb-5 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft size={20} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
            <span className="text-lg">{t('userGuide.backToGuide')}</span>
          </button>
        )}
        <LocationTab />
      </div>
    </PageTransition>
  );
};

export default LocationView;
