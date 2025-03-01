import React from 'react';
import { useAppContext } from '../context/AppContext';
import RamadanTracker from './RamadanTracker';
import { Calendar, Book, Star, Gift } from 'lucide-react';

const RamadanTab: React.FC = () => {
  const { settings } = useAppContext();
  const isRTL = settings.language === 'ar';
  
  const translations = {
    ramadan2025: {
      en: 'Ramadan 2025',
      ru: 'Рамадан 2025',
      ar: 'رمضان 2025'
    },
    importantDates: {
      en: 'Important Dates',
      ru: 'Важные даты',
      ar: 'تواريخ مهمة'
    },
    firstDayRamadan: {
      en: 'First day of Ramadan',
      ru: 'Первый день Рамадана',
      ar: 'اليوم الأول من رمضان'
    },
    laylatAlQadr: {
      en: 'Laylat al-Qadr (est.)',
      ru: 'Ночь аль-Кадр (прибл.)',
      ar: 'ليلة القدر (تقريبًا)'
    },
    lastDayRamadan: {
      en: 'Last day of Ramadan',
      ru: 'Последний день Рамадана',
      ar: 'اليوم الأخير من رمضان'
    },
    eidAlFitr: {
      en: 'Eid al-Fitr',
      ru: 'Ид аль-Фитр',
      ar: 'عيد الفطر'
    },
    dailyDuas: {
      en: 'Daily Duas',
      ru: 'Ежедневные дуа',
      ar: 'الأدعية اليومية'
    },
    duaForBreakingFast: {
      en: 'Dua for Breaking Fast (Iftar)',
      ru: 'Дуа для разговения (Ифтар)',
      ar: 'دعاء الإفطار'
    },
    duaForLaylatAlQadr: {
      en: 'Dua for Laylat al-Qadr',
      ru: 'Дуа для Ночи аль-Кадр',
      ar: 'دعاء ليلة القدر'
    },
    ramadanTips: {
      en: 'Ramadan Tips',
      ru: 'Советы для Рамадана',
      ar: 'نصائح رمضانية'
    },
    stayHydrated: {
      en: 'Stay hydrated during non-fasting hours',
      ru: 'Пейте достаточно воды в нефастинговые часы',
      ar: 'حافظ على ترطيب جسمك خلال ساعات الإفطار'
    },
    eatBalancedSuhoor: {
      en: 'Eat a balanced suhoor with protein and complex carbs',
      ru: 'Ешьте сбалансированный сухур с белками и сложными углеводами',
      ar: 'تناول سحورًا متوازنًا يحتوي على البروتين والكربوهيدرات المعقدة'
    },
    breakFastWithDates: {
      en: 'Break your fast with dates and water as per Sunnah',
      ru: 'Разговляйтесь финиками и водой, следуя Сунне',
      ar: 'افطر على التمر والماء اتباعًا للسنة'
    },
    planTaraweeh: {
      en: 'Plan your Taraweeh prayers and Quran recitation',
      ru: 'Планируйте молитвы Таравих и чтение Корана',
      ar: 'خطط لصلاة التراويح وتلاوة القرآن'
    },
    duaIftar: {
      en: 'Allahumma inni laka sumtu, wa bika aamantu, wa alayka tawakkaltu, wa ala rizqika aftartu',
      ru: 'Аллахумма инни ляка сумту, ва бика ааманту, ва аляйка таваккальту, ва аля ризкика афтарту',
      ar: 'اللهم إني لك صمت، وبك آمنت، وعليك توكلت، وعلى رزقك أفطرت'
    },
    duaLaylatAlQadr: {
      en: "Allahumma innaka afuwwun tuhibbul afwa fa'fu anni",
      ru: "Аллахумма иннака афуввун тухиббуль афва фа'фу анни",
      ar: "اللهم إنك عفو تحب العفو فاعف عني"
    }
  };
  
  return (
    <div className={`${isRTL ? 'text-right' : ''}`}>
      <h2 className="text-xl font-semibold mb-4">
        {translations.ramadan2025[settings.language]}
      </h2>
      
      {/* Ramadan Tracker */}
      <RamadanTracker className="mb-6" />
      
      {/* Additional Ramadan content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className={`flex items-center mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`bg-green-500/20 p-2 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <Calendar className="text-green-400" size={20} />
            </div>
            <h3 className="font-medium">
              {translations.importantDates[settings.language]}
            </h3>
          </div>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-300">
                {translations.firstDayRamadan[settings.language]}
              </span>
              <span className="text-gray-400">
                {settings.language === 'ar' ? '١ مارس ٢٠٢٥' : 'March 1, 2025'}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-300">
                {translations.laylatAlQadr[settings.language]}
              </span>
              <span className="text-gray-400">
                {settings.language === 'ar' ? '٢٧ مارس ٢٠٢٥' : 'March 27, 2025'}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-300">
                {translations.lastDayRamadan[settings.language]}
              </span>
              <span className="text-gray-400">
                {settings.language === 'ar' ? '٣٠ مارس ٢٠٢٥' : 'March 30, 2025'}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-300">
                {translations.eidAlFitr[settings.language]}
              </span>
              <span className="text-gray-400">
                {settings.language === 'ar' ? '٣١ مارس ٢٠٢٥' : 'March 31, 2025'}
              </span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className={`flex items-center mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`bg-green-500/20 p-2 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <Book className="text-green-400" size={20} />
            </div>
            <h3 className="font-medium">
              {translations.dailyDuas[settings.language]}
            </h3>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-1">
                {translations.duaForBreakingFast[settings.language]}
              </h4>
              <p className="text-gray-300 text-sm">
                {translations.duaIftar[settings.language]}
              </p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-1">
                {translations.duaForLaylatAlQadr[settings.language]}
              </h4>
              <p className="text-gray-300 text-sm">
                {translations.duaLaylatAlQadr[settings.language]}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-900/30 to-gray-800 rounded-lg p-4">
        <div className={`flex items-center mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`bg-amber-500/20 p-2 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
            <Star className="text-amber-400" size={20} fill="#f59e0b" />
          </div>
          <h3 className="font-medium">
            {translations.ramadanTips[settings.language]}
          </h3>
        </div>
        <ul className="space-y-2">
          <li className={`flex items-start ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <div className={`bg-green-500/10 text-green-400 rounded-full w-5 h-5 flex items-center justify-center ${isRTL ? 'ml-2 mt-0.5' : 'mr-2 mt-0.5'}`}>1</div>
            <span className="text-gray-300">
              {translations.stayHydrated[settings.language]}
            </span>
          </li>
          <li className={`flex items-start ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <div className={`bg-green-500/10 text-green-400 rounded-full w-5 h-5 flex items-center justify-center ${isRTL ? 'ml-2 mt-0.5' : 'mr-2 mt-0.5'}`}>2</div>
            <span className="text-gray-300">
              {translations.eatBalancedSuhoor[settings.language]}
            </span>
          </li>
          <li className={`flex items-start ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <div className={`bg-green-500/10 text-green-400 rounded-full w-5 h-5 flex items-center justify-center ${isRTL ? 'ml-2 mt-0.5' : 'mr-2 mt-0.5'}`}>3</div>
            <span className="text-gray-300">
              {translations.breakFastWithDates[settings.language]}
            </span>
          </li>
          <li className={`flex items-start ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <div className={`bg-green-500/10 text-green-400 rounded-full w-5 h-5 flex items-center justify-center ${isRTL ? 'ml-2 mt-0.5' : 'mr-2 mt-0.5'}`}>4</div>
            <span className="text-gray-300">
              {translations.planTaraweeh[settings.language]}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RamadanTab;