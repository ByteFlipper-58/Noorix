import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';

const PrivacyPolicyTab: React.FC = () => {
  const { t, isRTL } = useLocalization();
  const navigate = useNavigate();
  
  return (
    <div className={`max-w-4xl mx-auto ${isRTL ? 'text-right' : ''}`}>
      <button 
        onClick={() => navigate('/settings')}
        className={`flex items-center text-green-500 hover:text-green-400 mb-6 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <ArrowLeft size={20} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
        <span className="text-lg">{t('privacy.backToSettings')}</span>
      </button>
      
      <h2 className="text-2xl font-semibold mb-8">
        {t('privacy.privacyPolicy')}
      </h2>
      
      <div className="space-y-8 text-gray-300">
        <section>
          <h3 className="text-xl font-medium text-white mb-3">
            {t('privacy.introduction')}
          </h3>
          <p className="text-lg">
            {t('privacy.introText')}
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-white mb-3">
            {t('privacy.informationWeCollect')}
          </h3>
          <p className="mb-3 text-lg">
            {t('privacy.weCollect')}
          </p>
          <ul className={`list-disc ${isRTL ? 'pr-8' : 'pl-8'} space-y-2 text-lg`}>
            <li>
              {t('privacy.locationData')}
            </li>
            <li>
              {t('privacy.appSettings')}
            </li>
            <li>
              {t('privacy.anonymousData')}
            </li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-white mb-3">
            {t('privacy.howWeUse')}
          </h3>
          <p className="mb-3 text-lg">
            {t('privacy.weUse')}
          </p>
          <ul className={`list-disc ${isRTL ? 'pr-8' : 'pl-8'} space-y-2 text-lg`}>
            <li>
              {t('privacy.providePrayerTimes')}
            </li> <li>
              {t('privacy.savePreferences')}
            </li>
            <li>
              {t('privacy.improveApp')}
            </li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-white mb-3">
            {t('privacy.dataStorage')}
          </h3>
          <p className="text-lg">
            {t('privacy.dataStorageText')}
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-white mb-3">
            {t('privacy.thirdPartyServices')}
          </h3>
          <p className="mb-3 text-lg">
            {t('privacy.weUseThirdParty')}
          </p>
          <ul className={`list-disc ${isRTL ? 'pr-8' : 'pl-8'} space-y-2 text-lg`}>
            <li>
              <strong>Firebase Analytics</strong>: {t('privacy.firebaseAnalytics')}
            </li>
            <li>
              <strong>Aladhan API</strong>: {t('privacy.aladhanAPI')}
            </li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-white mb-3">
            {t('privacy.notifications')}
          </h3>
          <p className="text-lg">
            {t('privacy.notificationsText')}
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-white mb-3">
            {t('privacy.yourRights')}
          </h3>
          <p className="mb-3 text-lg">
            {t('privacy.youHaveRights')}
          </p>
          <ul className={`list-disc ${isRTL ? 'pr-8' : 'pl-8'} space-y-2 text-lg`}>
            <li>
              {t('privacy.rightToAccess')}
            </li>
            <li>
              {t('privacy.rightToRectify')}
            </li>
            <li>
              {t('privacy.rightToErasure')}
            </li>
            <li>
              {t('privacy.rightToRestrict')}
            </li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-white mb-3">
            {t('privacy.changes')}
          </h3>
          <p className="text-lg">
            {t('privacy.changesText')}
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-white mb-3">
            {t('privacy.contactUs')}
          </h3>
          <p className="text-lg">
            {t('privacy.contactUsText')}
          </p>
        </section>
        
        <div className="pt-6 text-sm text-gray-400 border-t border-gray-700">
          <p>
            {t('privacy.lastUpdated')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyTab;