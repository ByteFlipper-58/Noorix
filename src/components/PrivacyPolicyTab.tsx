import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';
import { logAnalyticsEvent } from '../firebase/firebase';

const PrivacyPolicyTab: React.FC = () => {
  const { t, isRTL } = useLocalization();
  const navigate = useNavigate();

  const handleBackToSettings = () => {
    navigate('/settings');
    logAnalyticsEvent('navigation', { from: 'privacy', to: 'settings' });
  };

  return (
    <div className={`${isRTL ? 'text-right' : ''}`}>
      <button
        onClick={handleBackToSettings}
        className={`flex items-center text-emerald-400 hover:text-emerald-300 mb-5 transition-colors duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <ArrowLeft size={20} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
        <span className="text-lg">{t('privacy.backToSettings')}</span>
      </button>

      <h2 className="text-2xl font-semibold mb-6">
        {t('privacy.privacyPolicy')}
      </h2>

      <div className="space-y-6 text-gray-300 leading-relaxed">
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
          <p className="text-lg mt-2">
            Некоторые данные, такие как информация о местоположении и настройки приложения, также используются для аналитики и улучшения методов расчета времени молитв. Эти данные хранятся временно на серверах Firebase и используются только в агрегированном виде.
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
              <strong>Firebase Crashlytics</strong>: Для сбора информации о сбоях приложения и улучшения стабильности
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
            Поскольку мы используем анонимизированные данные для аналитики, которые хранятся на серверах Firebase, мы не можем предоставить прямой доступ к этим данным или их удаление на индивидуальной основе. Однако вы можете:
          </p>
          <ul className={`list-disc ${isRTL ? 'pr-8' : 'pl-8'} space-y-2 text-lg`}>
            <li>
              Отключить сбор данных, используя настройки вашего браузера или мобильного устройства
            </li>
            <li>
              Очистить локальные данные приложения, хранящиеся на вашем устройстве
            </li>
            <li>
              Связаться с нами для получения дополнительной информации о том, как мы обрабатываем ваши данные
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

        <div className="pt-5 text-sm text-gray-500 border-t border-white/[0.06]">
          <p>
            {t('privacy.lastUpdated')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyTab;