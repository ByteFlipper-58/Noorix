import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Bell, Moon, Settings, ChevronRight, Navigation, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import useLocalization from '../hooks/useLocalization';
import { requestNotificationPermission } from '../services/prayerTimeService';

interface UserGuideProps {
  onClose: () => void;
  initialStep?: number;
}

const UserGuide: React.FC<UserGuideProps> = ({ onClose, initialStep = 0 }) => {
  const { t, isRTL } = useLocalization();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const { setLocation, settings, updateSettings } = useAppContext();
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isEnablingNotifications, setIsEnablingNotifications] = useState(false);
  
  // Set the initial step when the component mounts
  useEffect(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);
  
  const steps = [
    {
      title: t('userGuide.welcome'),
      description: t('userGuide.welcomeDescription'),
      icon: <Moon className="text-green-400" size={32} />,
      action: null
    },
    {
      title: t('userGuide.location'),
      description: t('userGuide.locationDescription'),
      icon: <MapPin className="text-green-400" size={32} />,
      action: {
        label: t('userGuide.setLocation'),
        onClick: () => navigate('/location?fromGuide=true')
      }
    },
    {
      title: t('userGuide.prayerTimes'),
      description: t('userGuide.prayerTimesDescription'),
      icon: <Moon className="text-green-400" size={32} />,
      action: null
    },
    {
      title: t('userGuide.notifications'),
      description: t('userGuide.notificationsDescription'),
      icon: <Bell className="text-green-400" size={32} />,
      action: {
        label: t('userGuide.enableNotifications'),
        onClick: () => navigate('/settings')
      }
    },
    {
      title: t('userGuide.settings'),
      description: t('userGuide.settingsDescription'),
      icon: <Settings className="text-green-400" size={32} />,
      action: null
    }
  ];
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const detectLocation = () => {
    setDetectingLocation(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError(t('location.geolocationNotSupported'));
      setDetectingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Create location object with the correct type
        const newLocation: {
          latitude: number;
          longitude: number;
          city?: string;
          country?: string;
        } = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        // Try to get city name using reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.latitude}&lon=${newLocation.longitude}`)
          .then(response => response.json())
          .then(data => {
            if (data.address) {
              newLocation.city = data.address.city || data.address.town || data.address.village || 
                t('common.unknown');
              newLocation.country = data.address.country || 
                t('common.unknown');
            }
            setLocation(newLocation);
            setDetectingLocation(false);
            // Move to the next step after successful location detection
            nextStep();
          })
          .catch(() => {
            // If reverse geocoding fails, still set the location with coordinates only
            setLocation(newLocation);
            setDetectingLocation(false);
            // Move to the next step after successful location detection
            nextStep();
          });
      },
      (error) => {
        setLocationError(t('location.errorGettingLocation', { message: error.message }));
        setDetectingLocation(false);
      }
    );
  };

  const enableNotifications = async () => {
    setIsEnablingNotifications(true);
    const granted = await requestNotificationPermission();
    if (granted) {
      updateSettings({ notifications: true });
      // Move to the next step after enabling notifications
      nextStep();
    }
    setIsEnablingNotifications(false);
  };
  
  const currentStepData = steps[currentStep];
  
  // Custom location step content
  const renderLocationStepContent = () => {
    return (
      <div className="flex flex-col items-center mb-6">
        <div className="bg-green-900/20 p-4 rounded-full mb-4">
          <MapPin className="text-green-400" size={32} />
        </div>
        <h3 className="text-xl font-medium mb-2 text-center">
          {t('userGuide.location')}
        </h3>
        <p className="text-gray-300 text-center mb-4">
          {t('userGuide.locationDescription')}
        </p>
        
        <button
          onClick={detectLocation}
          disabled={detectingLocation}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition-colors mb-3 flex items-center justify-center"
        >
          {detectingLocation ? (
            <span className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></span>
          ) : (
            <Navigation className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={20} />
          )}
          {t('location.detectMyLocation')}
        </button>
        
        {locationError && (
          <p className="text-red-400 text-sm mb-3">{locationError}</p>
        )}
        
        <button
          onClick={() => {
            onClose(); // Close the guide before navigating
            navigate('/location?fromGuide=true');
          }}
          className="w-full border border-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
        >
          {t('userGuide.goToLocationSettings')}
          <ChevronRight size={18} className="ml-1" />
        </button>
      </div>
    );
  };

  // Custom notifications step content
  const renderNotificationsStepContent = () => {
    return (
      <div className="flex flex-col items-center mb-6">
        <div className="bg-green-900/20 p-4 rounded-full mb-4">
          <Bell className="text-green-400" size={32} />
        </div>
        <h3 className="text-xl font-medium mb-2 text-center">
          {t('userGuide.notifications')}
        </h3>
        <p className="text-gray-300 text-center mb-4">
          {t('userGuide.notificationsDescription')}
        </p>
        
        <button
          onClick={enableNotifications}
          disabled={isEnablingNotifications}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition-colors mb-3 flex items-center justify-center"
        >
          {isEnablingNotifications ? (
            <span className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></span>
          ) : (
            <Bell className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={20} />
          )}
          {t('settings.enableNotifications')}
        </button>
        
        <button
          onClick={nextStep}
          className="w-full border border-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
        >
          {t('userGuide.skipForNow')}
        </button>
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl max-w-md w-full shadow-lg overflow-hidden md:max-w-lg lg:max-w-xl">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-green-400">
            {t('userGuide.title')}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close guide"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Step content */}
        <div className="p-4 md:p-6">
          {currentStep === 1 ? (
            renderLocationStepContent()
          ) : currentStep === 3 ? (
            renderNotificationsStepContent()
          ) : (
            <div className="flex flex-col items-center mb-6">
              <div className="bg-green-900/20 p-4 rounded-full mb-4">
                {currentStepData.icon}
              </div>
              <h3 className="text-xl font-medium mb-2 text-center">
                {currentStepData.title}
              </h3>
              <p className="text-gray-300 text-center">
                {currentStepData.description}
              </p>
            </div>
          )}
          
          {/* Action button if available and not on location or notification step */}
          {currentStep !== 1 && currentStep !== 3 && currentStepData.action && (
            <button
              onClick={() => {
                onClose(); // Close the guide before navigating
                currentStepData.action?.onClick();
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition-colors mb-4 flex items-center justify-center"
            >
              {currentStepData.action.label}
              <ChevronRight size={18} className="ml-1" />
            </button>
          )}
          
          {/* Progress indicators */}
          <div className="flex justify-center space-x-2 mb-4">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'w-8 bg-green-500' 
                    : 'w-2 bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('userGuide.back')}
            </button>
            
            <button
              onClick={nextStep}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors"
            >
              {currentStep < steps.length - 1 
                ? t('userGuide.next') 
                : t('userGuide.finish')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;