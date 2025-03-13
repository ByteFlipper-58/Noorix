import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Star, Gift } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';

const IslamicCalendarTab: React.FC = () => {
  const { t, isRTL } = useLocalization();
  
  // Important Islamic dates for 2025
  const importantDates = [
    {
      month: "Muharram",
      dates: [
        { day: "1", gregorian: "July 29, 2024", name: "Islamic New Year 1446" },
        { day: "10", gregorian: "August 7, 2024", name: "Day of Ashura" }
      ]
    },
    {
      month: "Rabi' al-Awwal",
      dates: [
        { day: "12", gregorian: "October 8, 2024", name: "Mawlid al-Nabi (Prophet's Birthday)" }
      ]
    },
    {
      month: "Rajab",
      dates: [
        { day: "27", gregorian: "February 15, 2025", name: "Isra and Mi'raj" }
      ]
    },
    {
      month: "Sha'ban",
      dates: [
        { day: "15", gregorian: "March 5, 2025", name: "Laylat al-Bara'ah" }
      ]
    },
    {
      month: "Ramadan",
      dates: [
        { day: "1", gregorian: "March 1, 2025", name: "Beginning of Ramadan" },
        { day: "27", gregorian: "March 27, 2025", name: "Laylat al-Qadr (Night of Power)" }
      ]
    },
    {
      month: "Shawwal",
      dates: [
        { day: "1", gregorian: "March 31, 2025", name: "Eid al-Fitr" }
      ]
    },
    {
      month: "Dhu al-Hijjah",
      dates: [
        { day: "9", gregorian: "June 27, 2025", name: "Day of Arafah" },
        { day: "10", gregorian: "June 28, 2025", name: "Eid al-Adha" }
      ]
    }
  ];

  return (
    <div className={`${isRTL ? 'text-right' : ''} max-w-4xl mx-auto`}>
      <h2 className="text-2xl font-semibold mb-6">
        {t('islamicCalendar.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className={`flex items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`bg-green-500/20 p-3 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <Calendar className="text-green-400" size={22} />
            </div>
            <h3 className="font-medium text-lg">
              {t('islamicCalendar.currentYear')}
            </h3>
          </div>
          <p className="text-3xl font-bold text-green-400 mb-2">1446 AH</p>
          <p className="text-gray-400">July 29, 2024 - July 17, 2025</p>
        </div>

        <div className="bg-gradient-to-br from-amber-900/30 to-gray-800 rounded-xl p-6">
          <div className={`flex items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`bg-amber-500/20 p-3 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <Star className="text-amber-400" size={22} fill="#f59e0b" />
            </div>
            <h3 className="font-medium text-lg">
              {t('islamicCalendar.nextHoliday')}
            </h3>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-medium text-amber-400">Eid al-Fitr</p>
            <p className="text-gray-300">March 31, 2025</p>
            <p className="text-gray-400">1 Shawwal 1446</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {importantDates.map((monthData, index) => (
          <div key={monthData.month} className={`p-6 ${index !== 0 ? 'border-t border-gray-700' : ''}`}>
            <h3 className="text-xl font-medium mb-4 text-green-400">{monthData.month}</h3>
            <div className="space-y-4">
              {monthData.dates.map((date) => (
                <div key={date.name} className="flex items-start">
                  <div className={`bg-green-500/10 text-green-400 rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center mt-1 ${isRTL ? 'ml-3' : 'mr-3'}`}>
                    {date.day}
                  </div>
                  <div>
                    <p className="font-medium text-lg">{date.name}</p>
                    <p className="text-gray-400">{date.gregorian}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IslamicCalendarTab;