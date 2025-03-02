import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicyTab: React.FC = () => {
  const { settings } = useAppContext();
  const navigate = useNavigate();
  const isRussian = settings.language === 'ru';
  const isArabic = settings.language === 'ar';
  
  const translations = {
    backToSettings: {
      en: 'Back to Settings',
      ru: 'Назад к настройкам',
      ar: 'العودة إلى الإعدادات'
    },
    privacyPolicy: {
      en: 'Privacy Policy',
      ru: 'Политика конфиденциальности',
      ar: 'سياسة الخصوصية'
    },
    introduction: {
      en: 'Introduction',
      ru: 'Введение',
      ar: 'مقدمة'
    },
    introText: {
      en: 'Welcome to Noorix\'s Privacy Policy. We respect your privacy and are committed to protecting your personal data.',
      ru: 'Добро пожаловать в политику конфиденциальности Noorix. Мы уважаем вашу конфиденциальность и стремимся защитить ваши персональные данные.',
      ar: 'مرحبًا بك في سياسة الخصوصية الخاصة بـ Noorix. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.'
    },
    informationWeCollect: {
      en: 'Information We Collect',
      ru: 'Собираемые данные',
      ar: 'المعلومات التي نجمعها'
    },
    weCollect: {
      en: 'We collect the following information:',
      ru: 'Мы собираем следующую информацию:',
      ar: 'نحن نجمع المعلومات التالية:'
    },
    locationData: {
      en: 'Location data (with your permission) to provide accurate prayer times',
      ru: 'Данные о местоположении (с вашего разрешения) для предоставления точного времени молитв',
      ar: 'بيانات الموقع (بإذنك) لتوفير أوقات صلاة دقيقة'
    },
    appSettings: {
      en: 'App settings such as preferred calculation method, madhab, and time format',
      ru: 'Настройки приложения, такие как предпочитаемый метод расчета, мазхаб и формат времени',
      ar: 'إعدادات التطبيق مثل طريقة الحساب المفضلة والمذهب وتنسيق الوقت'
    },
    anonymousData: {
      en: 'Anonymous usage data through Firebase Analytics',
      ru: 'Анонимные данные об использовании через Firebase Analytics',
      ar: 'بيانات استخدام مجهولة من خلال Firebase Analytics'
    },
    howWeUse: {
      en: 'How We Use Your Information',
      ru: 'Как мы используем ваши данные',
      ar: 'كيف نستخدم معلوماتك'
    },
    weUse: {
      en: 'We use the collected information to:',
      ru: 'Мы используем собранную информацию для:',
      ar: 'نستخدم المعلومات التي تم جمعها لـ:'
    },
    providePrayerTimes: {
      en: 'Provide accurate prayer times based on your location',
      ru: 'Предоставления точного времени молитв на основе вашего местоположения',
      ar: 'توفير أوقات صلاة دقيقة بناءً على موقعك'
    },
    savePreferences: {
      en: 'Save your preferences to improve user experience',
      ru: 'Сохранения ваших предпочтений для улучшения пользовательского опыта',
      ar: 'حفظ تفضيلاتك لتحسين تجربة المستخدم'
    },
    improveApp: {
      en: 'Improve our app based on anonymous usage data',
      ru: 'Улучшения нашего приложения на основе анонимных данных об использовании',
      ar: 'تحسين تطبيقنا بناءً على بيانات الاستخدام المجهولة'
    },
    dataStorage: {
      en: 'Data Storage',
      ru: 'Хранение данных',
      ar: 'تخزين البيانات'
    },
    dataStorageText: {
      en: 'Your settings and location data are stored locally on your device using localStorage. We do not transfer this data to our servers except for anonymous analytics data.',
      ru: 'Ваши настройки и данные о местоположении хранятся локально на вашем устройстве с использованием localStorage. Мы не передаем эти данные на наши серверы, за исключением анонимных аналитических данных.',
      ar: 'يتم تخزين إعداداتك وبيانات موقعك محليًا على جهازك باستخدام localStorage. نحن لا ننقل هذه البيانات إلى خوادمنا باستثناء بيانات التحليلات المجهولة.'
    },
    thirdPartyServices: {
      en: 'Third-Party Services',
      ru: 'Сторонние сервисы',
      ar: 'خدمات الطرف الثالث'
    },
    weUseThirdParty: {
      en: 'We use the following third-party services:',
      ru: 'Мы используем следующие сторонние сервисы:',
      ar: 'نحن نستخدم خدمات الطرف الثالث التالية:'
    },
    firebaseAnalytics: {
      en: 'To collect anonymous data about app usage',
      ru: 'Для сбора анонимных данных об использовании приложения',
      ar: 'لجمع بيانات مجهولة حول استخدام التطبيق'
    },
    aladhanAPI: {
      en: 'To fetch accurate prayer times based on your location',
      ru: 'Для получения точного времени молитв на основе вашего местоположения',
      ar: 'للحصول على أوقات صلاة دقيقة بناءً على موقعك'
    },
    notifications: {
      en: 'Notifications',
      ru: 'Уведомления',
      ar: 'الإشعارات'
    },
    notificationsText: {
      en: 'If you enable notifications, we will send local notifications for prayer times. These notifications are processed locally on your device and are not sent through our servers.',
      ru: 'Если вы разрешите уведомления, мы будем отправлять локальные уведомления о времени молитв. Эти уведомления обрабатываются локально на вашем устройстве и не отправляются через наши серверы.',
      ar: 'إذا قمت بتمكين الإشعارات، فسنرسل إشعارات محلية لأوقات الصلاة. تتم معالجة هذه الإشعارات محليًا على جهازك ولا يتم إرسالها عبر خوادمنا.'
    },
    yourRights: {
      en: 'Your Rights',
      ru: 'Ваши права',
      ar: 'حقوقك'
    },
    youHaveRights: {
      en: 'You have the following rights regarding your data:',
      ru: 'Вы имеете следующие права в отношении ваших данных:',
      ar: 'لديك الحقوق التالية فيما يتعلق ببياناتك:'
    },
    rightToAccess: {
      en: 'The right to access your data',
      ru: 'Право на доступ к вашим данным',
      ar: 'الحق في الوصول إلى بياناتك'
    },
    rightToRectify: {
      en: 'The right to rectify inaccurate data',
      ru: 'Право на исправление неточных данных',
      ar: 'الحق في تصحيح البيانات غير الدقيقة'
    },
    rightToErasure: {
      en: 'The right to erasure of your data',
      ru: 'Право на удаление ваших данных',
      ar: 'الحق في محو بياناتك'
    },
    rightToRestrict: {
      en: 'The right to restrict processing of your data',
      ru: 'Право на ограничение обработки ваших данных',
      ar: 'الحق في تقييد معالجة بياناتك'
    },
    changes: {
      en: 'Changes to This Privacy Policy',
      ru: 'Изменения в политике конфиденциальности',
      ar: 'التغييرات في سياسة الخصوصية هذه'
    },
    changesText: {
      en: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.',
      ru: 'Мы можем обновлять нашу политику конфиденциальности время от времени. Мы уведомим вас о любых изменениях, разместив новую политику конфиденциальности на этой странице.',
      ar: 'قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنخطرك بأي تغييرات من خلال نشر سياسة الخصوصية الجديدة على هذه الصفحة.'
    },
    contactUs: {
      en: 'Contact Us',
      ru: 'Свяжитесь с нами',
      ar: 'اتصل بنا'
    },
    contactUsText: {
      en: 'If you have any questions about our Privacy Policy, please contact us at: privacy@noorix.app',
      ru: 'Если у вас есть вопросы о нашей политике конфиденциальности, пожалуйста, свяжитесь с нами по адресу: privacy@noorix.app',
      ar: 'إذا كانت لديك أي أسئلة حول سياسة الخصوصية الخاصة بنا، يرجى الاتصال بنا على: privacy@noorix.app'
    },
    lastUpdated: {
      en: 'Last updated: March 1, 2025',
      ru: 'Последнее обновление: 1 марта 2025 г.',
      ar: 'آخر تحديث: 1 مارس 2025'
    }
  };
  
  return (
    <div className={`max-w-3xl mx-auto ${isArabic ? 'text-right' : ''}`}>
      <button 
        onClick={() => navigate('/settings')}
        className={`flex items-center text-green-500 hover:text-green-400 mb-4 transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}
      >
        <ArrowLeft size={18} className={`${isArabic ? 'ml-1' : 'mr-1'}`} />
        <span>{translations.backToSettings[settings.language]}</span>
      </button>
      
      <h2 className="text-2xl font-semibold mb-6">
        {translations.privacyPolicy[settings.language]}
      </h2>
      
      <div className="space-y-6 text-gray-300">
        <section>
          <h3 className="text-lg font-medium text-white mb-2">
            {translations.introduction[settings.language]}
          </h3>
          <p>
            {translations.introText[settings.language]}
          </p>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-white mb-2">
            {translations.informationWeCollect[settings.language]}
          </h3>
          <p className="mb-2">
            {translations.weCollect[settings.language]}
          </p>
          <ul className={`list-disc ${isArabic ? 'pr-6' : 'pl-6'} space-y-1`}>
            <li>
              {translations.locationData[settings.language]}
            </li>
            <li>
              {translations.appSettings[settings.language]}
            </li>
            <li>
              {translations.anonymousData[settings.language]}
            </li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-white mb-2">
            {translations.howWeUse[settings.language]}
          </h3>
          <p className="mb-2">
            {translations.weUse[settings.language]}
          </p>
          <ul className={`list-disc ${isArabic ? 'pr-6' : 'pl-6'} space-y-1`}>
            <li>
              {translations.providePrayerTimes[settings.language]}
            </li>
            <li>
              {translations.savePreferences[settings.language]}
            </li>
            <li>
              {translations.improveApp[settings.language]}
            </li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-white mb-2">
            {translations.dataStorage[settings.language]}
          </h3>
          <p>
            {translations.dataStorageText[settings.language]}
          </p>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-white mb-2">
            {translations.thirdPartyServices[settings.language]}
          </h3>
          <p className="mb-2">
            {translations.weUseThirdParty[settings.language]}
          </p>
          <ul className={`list-disc ${isArabic ? 'pr-6' : 'pl-6'} space-y-1`}>
            <li>
              <strong>Firebase Analytics</strong>: {translations.firebaseAnalytics[settings.language]}
            </li>
            <li>
              <strong>Aladhan API</strong>: {translations.aladhanAPI[settings.language]}
            </li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-white mb-2">
            {translations.notifications[settings.language]}
          </h3>
          <p>
            {translations.notificationsText[settings.language]}
          </p>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-white mb-2">
            {translations.yourRights[settings.language]}
          </h3>
          <p className="mb-2">
            {translations.youHaveRights[settings.language]}
          </p>
          <ul className={`list-disc ${isArabic ? 'pr-6' : 'pl-6'} space-y-1`}>
            <li>
              {translations.rightToAccess[settings.language]}
            </li>
            <li>
              {translations.rightToRectify[settings.language]}
            </li>
            <li>
              {translations.rightToErasure[settings.language]}
            </li>
            <li>
              {translations.rightToRestrict[settings.language]}
            </li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-white mb-2">
            {translations.changes[settings.language]}
          </h3>
          <p>
            {translations.changesText[settings.language]}
          </p>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-white mb-2">
            {translations.contactUs[settings.language]}
          </h3>
          <p>
            {translations.contactUsText[settings.language]}
          </p>
        </section>
        
        <div className="pt-4 text-sm text-gray-400 border-t border-gray-700">
          <p>
            {translations.lastUpdated[settings.language]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyTab;