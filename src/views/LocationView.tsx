import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LocationTab from '../components/LocationTab';
import { ArrowLeft } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';
import { useAppContext } from '../context/AppContext';
import UserGuide from '../components/UserGuide';

const LocationView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isRTL } = useLocalization();
  const { setIsFirstVisit } = useAppContext();
  const [fromGuide, setFromGuide] = useState(false);
  const [showUserGuide, setShowUserGuide] = useState(false);

  useEffect(() => {
    // Check if we came from the user guide
    const searchParams = new URLSearchParams(location.search);
    const fromGuideParam = searchParams.get('fromGuide') === 'true';
    setFromGuide(fromGuideParam);
  }, [location]);

  const handleBackToGuide = () => {
    // Show the UserGuide component
    setShowUserGuide(true);
  };

  const handleCloseGuide = () => {
    setShowUserGuide(false);
  };

  return (
    <div>
      {/* Show UserGuide when back button is clicked */}
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
  );
};

export default LocationView;