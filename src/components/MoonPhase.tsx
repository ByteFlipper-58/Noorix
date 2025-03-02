import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { getMoonPhaseEmoji, getMoonPhaseName } from '../data/cities';
import { Moon } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';

const MoonPhase: React.FC = () => {
  const { settings } = useAppContext();
  const { t } = useLocalization();
  const [moonPhase, setMoonPhase] = useState<number>(0);
  
  useEffect(() => {
    // Calculate moon phase (simplified algorithm)
    // This is a simple approximation - for more accurate calculations, a specialized library would be better
    const calculateMoonPhase = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      // Calculate approximate moon phase using a simple algorithm
      // 29.53 days is the average length of a lunar month
      const lp = 2551443; // Moon phase cycle in seconds
      const now = new Date(year, month - 1, day, 20, 35, 0).getTime() / 1000;
      const newMoon = new Date(2000, 0, 6, 18, 14, 0).getTime() / 1000;
      const phase = ((now - newMoon) % lp) / lp;
      
      setMoonPhase(phase);
    };
    
    calculateMoonPhase();
  }, []);
  
  const moonEmoji = getMoonPhaseEmoji(moonPhase);
  const phaseName = getMoonPhaseName(moonPhase, settings.language);
  
  return (
    <div className="bg-gray-800/50 rounded-xl p-5 mb-6 flex items-center">
      <div className="text-4xl mr-4">{moonEmoji}</div>
      <div>
        <h3 className="font-medium text-lg text-gray-300">
          {t('prayerTimes.currentMoonPhase')}
        </h3>
        <p className="text-gray-400 text-lg">{phaseName}</p>
      </div>
    </div>
  );
};

export default MoonPhase;