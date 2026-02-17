import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Bell, Moon, Settings, ChevronRight, Navigation, Sparkles } from 'lucide-react';
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
  const { setLocation, updateSettings } = useAppContext();
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isEnablingNotifications, setIsEnablingNotifications] = useState(false);

  useEffect(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  const steps = [
    {
      title: t('userGuide.welcome'),
      description: t('userGuide.welcomeDescription'),
      icon: <Moon size={28} />,
      iconColor: 'text-emerald-400',
      bgGradient: 'from-emerald-500/20 to-emerald-600/10',
    },
    {
      title: t('userGuide.location'),
      description: t('userGuide.locationDescription'),
      icon: <MapPin size={28} />,
      iconColor: 'text-blue-400',
      bgGradient: 'from-blue-500/20 to-blue-600/10',
    },
    {
      title: t('userGuide.prayerTimes'),
      description: t('userGuide.prayerTimesDescription'),
      icon: <Sparkles size={28} />,
      iconColor: 'text-amber-400',
      bgGradient: 'from-amber-500/20 to-amber-600/10',
    },
    {
      title: t('userGuide.notifications'),
      description: t('userGuide.notificationsDescription'),
      icon: <Bell size={28} />,
      iconColor: 'text-purple-400',
      bgGradient: 'from-purple-500/20 to-purple-600/10',
    },
    {
      title: t('userGuide.settings'),
      description: t('userGuide.settingsDescription'),
      icon: <Settings size={28} />,
      iconColor: 'text-rose-400',
      bgGradient: 'from-rose-500/20 to-rose-600/10',
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
        const newLocation: {
          latitude: number;
          longitude: number;
          city?: string;
          country?: string;
        } = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

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
            nextStep();
          })
          .catch(() => {
            setLocation(newLocation);
            setDetectingLocation(false);
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
      nextStep();
    }
    setIsEnablingNotifications(false);
  };

  const currentStepData = steps[currentStep];

  const renderStepContent = () => {
    return (
      <div className="flex flex-col items-center mb-6">
        {/* Icon */}
        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${currentStepData.bgGradient} flex items-center justify-center mb-5 border border-white/[0.06]`}>
          <div className={currentStepData.iconColor}>
            {currentStepData.icon}
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2 text-center text-gray-100">
          {currentStepData.title}
        </h3>
        <p className="text-gray-400 text-sm text-center leading-relaxed max-w-sm">
          {currentStepData.description}
        </p>
      </div>
    );
  };

  const renderActions = () => {
    // Location step
    if (currentStep === 1) {
      return (
        <div className="space-y-2.5 mb-6">
          <button
            onClick={detectLocation}
            disabled={detectingLocation}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center font-medium text-sm shadow-glow-sm hover:shadow-glow-md disabled:opacity-50"
          >
            {detectingLocation ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Navigation className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={18} />
            )}
            {t('location.detectMyLocation')}
          </button>

          {locationError && (
            <p className="text-red-400 text-xs text-center">{locationError}</p>
          )}

          <button
            onClick={() => {
              onClose();
              navigate('/location?fromGuide=true');
            }}
            className="w-full glass-card py-3 px-4 rounded-2xl text-gray-300 hover:text-gray-100 transition-all duration-300 flex items-center justify-center text-sm font-medium"
          >
            {t('userGuide.goToLocationSettings')}
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      );
    }

    // Notifications step
    if (currentStep === 3) {
      return (
        <div className="space-y-2.5 mb-6">
          <button
            onClick={enableNotifications}
            disabled={isEnablingNotifications}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center font-medium text-sm shadow-glow-sm hover:shadow-glow-md disabled:opacity-50"
          >
            {isEnablingNotifications ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Bell className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={18} />
            )}
            {t('settings.enableNotifications')}
          </button>

          <button
            onClick={nextStep}
            className="w-full glass-card py-3 px-4 rounded-2xl text-gray-300 hover:text-gray-100 transition-all duration-300 flex items-center justify-center text-sm font-medium"
          >
            {t('userGuide.skipForNow')}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card rounded-3xl max-w-md w-full shadow-[0_24px_64px_rgba(0,0,0,0.5)] overflow-hidden bg-[#111827]/95 backdrop-blur-2xl border border-white/[0.08]">
        {/* Header */}
        <div className="flex justify-between items-center px-5 pt-5 pb-3">
          <div className="flex items-center">
            <Moon className="text-emerald-400 mr-2" size={18} />
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
              {t('userGuide.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors duration-200 text-gray-500 hover:text-gray-300"
            aria-label={t('common.closeGuide')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pt-4 pb-5">
          {renderStepContent()}
          {renderActions()}

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mb-5">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStep
                  ? 'w-6 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                  : index < currentStep
                    ? 'w-1.5 bg-emerald-400/40'
                    : 'w-1.5 bg-white/[0.08]'
                  }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between gap-3">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex-1 py-2.5 px-4 rounded-xl glass-card text-sm font-medium text-gray-400 hover:text-gray-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t('userGuide.back')}
            </button>

            <button
              onClick={nextStep}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-sm font-medium transition-all duration-300 shadow-glow-sm hover:shadow-glow-md"
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