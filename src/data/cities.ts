import { City } from '../types';
import { getTranslation } from '../localization';
import { Language } from '../types';

export const popularCities: City[] = [
  // Existing cities
  { id: '1', name: 'Mecca', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262 },
  { id: '2', name: 'Medina', country: 'Saudi Arabia', latitude: 24.5247, longitude: 39.5692 },
  { id: '3', name: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784 },
  { id: '4', name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 },
  { id: '5', name: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708 },
  { id: '6', name: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869 },
  { id: '7', name: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456 },
  { id: '8', name: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278 },
  { id: '9', name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060 },
  { id: '10', name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832 },
  { id: '11', name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
  { id: '12', name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { id: '13', name: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050 },
  { id: '14', name: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753 },
  { id: '15', name: 'Doha', country: 'Qatar', latitude: 25.2854, longitude: 51.5310 },
  { id: '16', name: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011 },
  { id: '17', name: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090 },
  { id: '18', name: 'Lahore', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587 },
  { id: '19', name: 'Amman', country: 'Jordan', latitude: 31.9454, longitude: 35.9284 },
  { id: '20', name: 'Baghdad', country: 'Iraq', latitude: 33.3152, longitude: 44.3661 },
  
  // Added European cities
  { id: '21', name: 'Moscow', country: 'Russia', latitude: 55.7558, longitude: 37.6173 },
  { id: '22', name: 'Saint Petersburg', country: 'Russia', latitude: 59.9343, longitude: 30.3351 },
  { id: '23', name: 'Kazan', country: 'Russia', latitude: 55.7887, longitude: 49.1221 },
  { id: '24', name: 'Ufa', country: 'Russia', latitude: 54.7431, longitude: 55.9678 },
  { id: '25', name: 'Grozny', country: 'Russia', latitude: 43.3169, longitude: 45.6981 },
  { id: '26', name: 'Makhachkala', country: 'Russia', latitude: 42.9849, longitude: 47.5047 },
  { id: '27', name: 'Madrid', country: 'Spain', latitude: 40.4168, longitude: -3.7038 },
  { id: '28', name: 'Barcelona', country: 'Spain', latitude: 41.3851, longitude: 2.1734 },
  { id: '29', name: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964 },
  { id: '30', name: 'Milan', country: 'Italy', latitude: 45.4642, longitude: 9.1900 },
  { id: '31', name: 'Amsterdam', country: 'Netherlands', latitude: 52.3676, longitude: 4.9041 },
  { id: '32', name: 'Brussels', country: 'Belgium', latitude: 50.8503, longitude: 4.3517 },
  { id: '33', name: 'Vienna', country: 'Austria', latitude: 48.2082, longitude: 16.3738 },
  { id: '34', name: 'Warsaw', country: 'Poland', latitude: 52.2297, longitude: 21.0122 },
  { id: '35', name: 'Prague', country: 'Czech Republic', latitude: 50.0755, longitude: 14.4378 },
  { id: '36', name: 'Budapest', country: 'Hungary', latitude: 47.4979, longitude: 19.0402 },
  { id: '37', name: 'Stockholm', country: 'Sweden', latitude: 59.3293, longitude: 18.0686 },
  { id: '38', name: 'Oslo', country: 'Norway', latitude: 59.9139, longitude: 10.7522 },
  { id: '39', name: 'Copenhagen', country: 'Denmark', latitude: 55.6761, longitude: 12.5683 },
  { id: '40', name: 'Helsinki', country: 'Finland', latitude: 60.1699, longitude: 24.9384 },
  { id: '41', name: 'Athens', country: 'Greece', latitude: 37.9838, longitude: 23.7275 },
  { id: '42', name: 'Sofia', country: 'Bulgaria', latitude: 42.6977, longitude: 23.3219 },
  { id: '43', name: 'Bucharest', country: 'Romania', latitude: 44.4268, longitude: 26.1025 },
  { id: '44', name: 'Kiev', country: 'Ukraine', latitude: 50.4501, longitude: 30.5234 },
  { id: '45', name: 'Minsk', country: 'Belarus', latitude: 53.9045, longitude: 27.5615 },
  { id: '46', name: 'Sarajevo', country: 'Bosnia and Herzegovina', latitude: 43.8563, longitude: 18.4131 },
  { id: '47', name: 'Tirana', country: 'Albania', latitude: 41.3275, longitude: 19.8187 },
  { id: '48', name: 'Lisbon', country: 'Portugal', latitude: 38.7223, longitude: -9.1393 },
  { id: '49', name: 'Dublin', country: 'Ireland', latitude: 53.3498, longitude: -6.2603 },
  { id: '50', name: 'Zurich', country: 'Switzerland', latitude: 47.3769, longitude: 8.5417 },
  
  // Added Middle Eastern and North African cities
  { id: '51', name: 'Jeddah', country: 'Saudi Arabia', latitude: 21.5433, longitude: 39.1728 },
  { id: '52', name: 'Dammam', country: 'Saudi Arabia', latitude: 26.4207, longitude: 50.0888 },
  { id: '53', name: 'Abu Dhabi', country: 'UAE', latitude: 24.4539, longitude: 54.3773 },
  { id: '54', name: 'Sharjah', country: 'UAE', latitude: 25.3463, longitude: 55.4209 },
  { id: '55', name: 'Kuwait City', country: 'Kuwait', latitude: 29.3759, longitude: 47.9774 },
  { id: '56', name: 'Manama', country: 'Bahrain', latitude: 26.2285, longitude: 50.5860 },
  { id: '57', name: 'Muscat', country: 'Oman', latitude: 23.5880, longitude: 58.3829 },
  { id: '58', name: 'Sana\'a', country: 'Yemen', latitude: 15.3694, longitude: 44.1910 },
  { id: '59', name: 'Damascus', country: 'Syria', latitude: 33.5138, longitude: 36.2765 },
  { id: '60', name: 'Beirut', country: 'Lebanon', latitude: 33.8938, longitude: 35.5018 },
  { id: '61', name: 'Jerusalem', country: 'Palestine', latitude: 31.7683, longitude: 35.2137 },
  { id: '62', name: 'Ramallah', country: 'Palestine', latitude: 31.9038, longitude: 35.2034 },
  { id: '63', name: 'Tehran', country: 'Iran', latitude: 35.6892, longitude: 51.3890 },
  { id: '64', name: 'Mashhad', country: 'Iran', latitude: 36.2605, longitude: 59.6168 },
  { id: '65', name: 'Kabul', country: 'Afghanistan', latitude: 34.5553, longitude: 69.2075 },
  { id: '66', name: 'Islamabad', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479 },
  { id: '67', name: 'Alexandria', country: 'Egypt', latitude: 31.2001, longitude: 29.9187 },
  { id: '68', name: 'Algiers', country: 'Algeria', latitude: 36.7538, longitude: 3.0588 },
  { id: '69', name: 'Tunis', country: 'Tunisia', latitude: 36.8065, longitude: 10.1815 },
  { id: '70', name: 'Tripoli', country: 'Libya', latitude: 32.8872, longitude: 13.1913 },
  { id: '71', name: 'Rabat', country: 'Morocco', latitude: 34.0209, longitude: -6.8416 },
  { id: '72', name: 'Casablanca', country: 'Morocco', latitude: 33.5731, longitude: -7.5898 },
  { id: '73', name: 'Khartoum', country: 'Sudan', latitude: 15.5007, longitude: 32.5599 },
  { id: '74', name: 'Mogadishu', country: 'Somalia', latitude: 2.0469, longitude: 45.3182 },
  { id: '75', name: 'Djibouti', country: 'Djibouti', latitude: 11.8251, longitude: 42.5903 }
];

export const getCalculationMethodName = (methodId: number): string => {
  const methods: Record<number, string> = {
    0: "Shafi'i, Maliki, Ja'fari, Hanbali",
    1: "Hanafi",
    2: "Islamic Society of North America",
    3: "Muslim World League",
    4: "Umm Al-Qura University, Makkah",
    5: "Egyptian General Authority of Survey",
    7: "Institute of Geophysics, University of Tehran",
    8: "Gulf Region",
    9: "Kuwait",
    10: "Qatar",
    11: "Majlis Ugama Islam Singapura, Singapore",
    12: "Union Organization islamic de France",
    13: "Diyanet İşleri Başkanlığı, Turkey",
    14: "Spiritual Administration of Muslims of Russia",
    15: "Moonsighting Committee Worldwide"
  };
  
  return methods[methodId] || "Unknown Method";
};

export const getMadhabName = (madhabId: number): string => {
  const madhabs: Record<number, string> = {
    0: "Shafi'i (standard)",
    1: "Hanafi"
  };
  
  return madhabs[madhabId] || "Unknown Madhab";
};

export const getMoonPhaseEmoji = (phase: number): string => {
  // 0 = New Moon, 0.25 = First Quarter, 0.5 = Full Moon, 0.75 = Last Quarter, 1 = New Moon
  if (phase < 0.05 || phase > 0.95) return "🌑"; // New Moon
  if (phase < 0.20) return "🌒"; // Waxing Crescent
  if (phase < 0.30) return "🌓"; // First Quarter
  if (phase < 0.45) return "🌔"; // Waxing Gibbous
  if (phase < 0.55) return "🌕"; // Full Moon
  if (phase < 0.70) return "🌖"; // Waning Gibbous
  if (phase < 0.80) return "🌗"; // Last Quarter
  return "🌘"; // Waning Crescent
};

export const getMoonPhaseName = (phase: number, language: Language): string => {
  // 0 = New Moon, 0.25 = First Quarter, 0.5 = Full Moon, 0.75 = Last Quarter, 1 = New Moon
  if (phase < 0.05 || phase > 0.95) return getTranslation(language, 'moonPhases.newMoon');
  if (phase < 0.20) return getTranslation(language, 'moonPhases.waxingCrescent');
  if (phase < 0.30) return getTranslation(language, 'moonPhases.firstQuarter');
  if (phase < 0.45) return getTranslation(language, 'moonPhases.waxingGibbous');
  if (phase < 0.55) return getTranslation(language, 'moonPhases.fullMoon');
  if (phase < 0.70) return getTranslation(language, 'moonPhases.waningGibbous');
  if (phase < 0.80) return getTranslation(language, 'moonPhases.lastQuarter');
  return getTranslation(language, 'moonPhases.waningCrescent');
};