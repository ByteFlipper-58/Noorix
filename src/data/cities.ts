import { City } from '../types';
import { getTranslation } from '../localization';
import { Language } from '../types';

export const popularCities: City[] = [
  // ── Saudi Arabia ──
  { id: '1', name: 'Mecca', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262 },
  { id: '2', name: 'Medina', country: 'Saudi Arabia', latitude: 24.5247, longitude: 39.5692 },
  { id: '14', name: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753 },
  { id: '51', name: 'Jeddah', country: 'Saudi Arabia', latitude: 21.5433, longitude: 39.1728 },
  { id: '52', name: 'Dammam', country: 'Saudi Arabia', latitude: 26.4207, longitude: 50.0888 },
  { id: '76', name: 'Taif', country: 'Saudi Arabia', latitude: 21.2703, longitude: 40.4158 },
  { id: '77', name: 'Tabuk', country: 'Saudi Arabia', latitude: 28.3835, longitude: 36.5662 },
  { id: '78', name: 'Buraidah', country: 'Saudi Arabia', latitude: 26.3260, longitude: 43.9750 },

  // ── Turkey ──
  { id: '3', name: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784 },
  { id: '79', name: 'Ankara', country: 'Turkey', latitude: 39.9334, longitude: 32.8597 },
  { id: '80', name: 'Izmir', country: 'Turkey', latitude: 38.4192, longitude: 27.1287 },
  { id: '81', name: 'Bursa', country: 'Turkey', latitude: 40.1885, longitude: 29.0610 },
  { id: '82', name: 'Antalya', country: 'Turkey', latitude: 36.8969, longitude: 30.7133 },
  { id: '83', name: 'Konya', country: 'Turkey', latitude: 37.8746, longitude: 32.4932 },
  { id: '84', name: 'Gaziantep', country: 'Turkey', latitude: 37.0662, longitude: 37.3833 },

  // ── Egypt ──
  { id: '4', name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 },
  { id: '67', name: 'Alexandria', country: 'Egypt', latitude: 31.2001, longitude: 29.9187 },
  { id: '85', name: 'Giza', country: 'Egypt', latitude: 30.0131, longitude: 31.2089 },
  { id: '86', name: 'Luxor', country: 'Egypt', latitude: 25.6872, longitude: 32.6396 },
  { id: '87', name: 'Aswan', country: 'Egypt', latitude: 24.0889, longitude: 32.8998 },

  // ── UAE ──
  { id: '5', name: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708 },
  { id: '53', name: 'Abu Dhabi', country: 'UAE', latitude: 24.4539, longitude: 54.3773 },
  { id: '54', name: 'Sharjah', country: 'UAE', latitude: 25.3463, longitude: 55.4209 },
  { id: '88', name: 'Ajman', country: 'UAE', latitude: 25.4052, longitude: 55.5136 },
  { id: '89', name: 'Al Ain', country: 'UAE', latitude: 24.1917, longitude: 55.7606 },

  // ── Pakistan ──
  { id: '16', name: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011 },
  { id: '18', name: 'Lahore', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587 },
  { id: '66', name: 'Islamabad', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479 },
  { id: '90', name: 'Faisalabad', country: 'Pakistan', latitude: 31.4504, longitude: 73.1350 },
  { id: '91', name: 'Rawalpindi', country: 'Pakistan', latitude: 33.5651, longitude: 73.0169 },
  { id: '92', name: 'Peshawar', country: 'Pakistan', latitude: 34.0151, longitude: 71.5249 },
  { id: '93', name: 'Multan', country: 'Pakistan', latitude: 30.1575, longitude: 71.5249 },

  // ── India ──
  { id: '17', name: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090 },
  { id: '94', name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777 },
  { id: '95', name: 'Hyderabad', country: 'India', latitude: 17.3850, longitude: 78.4867 },
  { id: '96', name: 'Bangalore', country: 'India', latitude: 12.9716, longitude: 77.5946 },
  { id: '97', name: 'Chennai', country: 'India', latitude: 13.0827, longitude: 80.2707 },
  { id: '98', name: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639 },
  { id: '99', name: 'Lucknow', country: 'India', latitude: 26.8467, longitude: 80.9462 },

  // ── Russia ──
  { id: '21', name: 'Moscow', country: 'Russia', latitude: 55.7558, longitude: 37.6173 },
  { id: '22', name: 'Saint Petersburg', country: 'Russia', latitude: 59.9343, longitude: 30.3351 },
  { id: '23', name: 'Kazan', country: 'Russia', latitude: 55.7887, longitude: 49.1221 },
  { id: '24', name: 'Ufa', country: 'Russia', latitude: 54.7431, longitude: 55.9678 },
  { id: '25', name: 'Grozny', country: 'Russia', latitude: 43.3169, longitude: 45.6981 },
  { id: '26', name: 'Makhachkala', country: 'Russia', latitude: 42.9849, longitude: 47.5047 },
  { id: '100', name: 'Novosibirsk', country: 'Russia', latitude: 55.0084, longitude: 82.9357 },
  { id: '101', name: 'Yekaterinburg', country: 'Russia', latitude: 56.8389, longitude: 60.6057 },
  { id: '102', name: 'Nizhny Novgorod', country: 'Russia', latitude: 56.2965, longitude: 43.9361 },
  { id: '103', name: 'Chelyabinsk', country: 'Russia', latitude: 55.1644, longitude: 61.4368 },
  { id: '104', name: 'Samara', country: 'Russia', latitude: 53.1959, longitude: 50.1002 },
  { id: '105', name: 'Rostov-on-Don', country: 'Russia', latitude: 47.2357, longitude: 39.7015 },
  { id: '106', name: 'Naberezhnye Chelny', country: 'Russia', latitude: 55.7440, longitude: 52.4154 },
  { id: '107', name: 'Tyumen', country: 'Russia', latitude: 57.1522, longitude: 65.5272 },

  // ── Iran ──
  { id: '63', name: 'Tehran', country: 'Iran', latitude: 35.6892, longitude: 51.3890 },
  { id: '64', name: 'Mashhad', country: 'Iran', latitude: 36.2605, longitude: 59.6168 },
  { id: '108', name: 'Isfahan', country: 'Iran', latitude: 32.6546, longitude: 51.6680 },
  { id: '109', name: 'Tabriz', country: 'Iran', latitude: 38.0800, longitude: 46.2919 },
  { id: '110', name: 'Shiraz', country: 'Iran', latitude: 29.5918, longitude: 52.5837 },

  // ── Iraq ──
  { id: '20', name: 'Baghdad', country: 'Iraq', latitude: 33.3152, longitude: 44.3661 },
  { id: '111', name: 'Basra', country: 'Iraq', latitude: 30.5085, longitude: 47.7804 },
  { id: '112', name: 'Erbil', country: 'Iraq', latitude: 36.1911, longitude: 44.0094 },
  { id: '113', name: 'Mosul', country: 'Iraq', latitude: 36.3400, longitude: 43.1300 },
  { id: '114', name: 'Najaf', country: 'Iraq', latitude: 31.9596, longitude: 44.3142 },

  // ── Jordan ──
  { id: '19', name: 'Amman', country: 'Jordan', latitude: 31.9454, longitude: 35.9284 },
  { id: '115', name: 'Irbid', country: 'Jordan', latitude: 32.5568, longitude: 35.8469 },
  { id: '116', name: 'Zarqa', country: 'Jordan', latitude: 32.0728, longitude: 36.0880 },
  { id: '117', name: 'Aqaba', country: 'Jordan', latitude: 29.5321, longitude: 35.0063 },

  // ── Germany ──
  { id: '13', name: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050 },
  { id: '118', name: 'Munich', country: 'Germany', latitude: 48.1351, longitude: 11.5820 },
  { id: '119', name: 'Hamburg', country: 'Germany', latitude: 53.5511, longitude: 9.9937 },
  { id: '120', name: 'Frankfurt', country: 'Germany', latitude: 50.1109, longitude: 8.6821 },
  { id: '121', name: 'Cologne', country: 'Germany', latitude: 50.9375, longitude: 6.9603 },
  { id: '122', name: 'Dortmund', country: 'Germany', latitude: 51.5136, longitude: 7.4653 },

  // ── France ──
  { id: '12', name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { id: '123', name: 'Marseille', country: 'France', latitude: 43.2965, longitude: 5.3698 },
  { id: '124', name: 'Lyon', country: 'France', latitude: 45.7640, longitude: 4.8357 },
  { id: '125', name: 'Strasbourg', country: 'France', latitude: 48.5734, longitude: 7.7521 },
  { id: '126', name: 'Toulouse', country: 'France', latitude: 43.6047, longitude: 1.4442 },

  // ── UK ──
  { id: '8', name: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278 },
  { id: '127', name: 'Birmingham', country: 'UK', latitude: 52.4862, longitude: -1.8904 },
  { id: '128', name: 'Manchester', country: 'UK', latitude: 53.4808, longitude: -2.2426 },
  { id: '129', name: 'Leeds', country: 'UK', latitude: 53.8008, longitude: -1.5491 },
  { id: '130', name: 'Glasgow', country: 'UK', latitude: 55.8642, longitude: -4.2518 },
  { id: '131', name: 'Edinburgh', country: 'UK', latitude: 55.9533, longitude: -3.1883 },

  // ── USA ──
  { id: '9', name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060 },
  { id: '132', name: 'Los Angeles', country: 'USA', latitude: 34.0522, longitude: -118.2437 },
  { id: '133', name: 'Chicago', country: 'USA', latitude: 41.8781, longitude: -87.6298 },
  { id: '134', name: 'Houston', country: 'USA', latitude: 29.7604, longitude: -95.3698 },
  { id: '135', name: 'Detroit', country: 'USA', latitude: 42.3314, longitude: -83.0458 },
  { id: '136', name: 'Philadelphia', country: 'USA', latitude: 39.9526, longitude: -75.1652 },
  { id: '137', name: 'Dallas', country: 'USA', latitude: 32.7767, longitude: -96.7970 },
  { id: '138', name: 'Washington D.C.', country: 'USA', latitude: 38.9072, longitude: -77.0369 },

  // ── Canada ──
  { id: '10', name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832 },
  { id: '139', name: 'Montreal', country: 'Canada', latitude: 45.5017, longitude: -73.5673 },
  { id: '140', name: 'Vancouver', country: 'Canada', latitude: 49.2827, longitude: -123.1207 },
  { id: '141', name: 'Ottawa', country: 'Canada', latitude: 45.4215, longitude: -75.6972 },
  { id: '142', name: 'Calgary', country: 'Canada', latitude: 51.0447, longitude: -114.0719 },

  // ── Australia ──
  { id: '11', name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
  { id: '143', name: 'Melbourne', country: 'Australia', latitude: -37.8136, longitude: 144.9631 },
  { id: '144', name: 'Perth', country: 'Australia', latitude: -31.9505, longitude: 115.8605 },
  { id: '145', name: 'Brisbane', country: 'Australia', latitude: -27.4698, longitude: 153.0251 },

  // ── Malaysia ──
  { id: '6', name: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869 },
  { id: '146', name: 'George Town', country: 'Malaysia', latitude: 5.4164, longitude: 100.3327 },
  { id: '147', name: 'Johor Bahru', country: 'Malaysia', latitude: 1.4927, longitude: 103.7414 },
  { id: '148', name: 'Kota Kinabalu', country: 'Malaysia', latitude: 5.9804, longitude: 116.0735 },

  // ── Indonesia ──
  { id: '7', name: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456 },
  { id: '149', name: 'Surabaya', country: 'Indonesia', latitude: -7.2575, longitude: 112.7521 },
  { id: '150', name: 'Bandung', country: 'Indonesia', latitude: -6.9175, longitude: 107.6191 },
  { id: '151', name: 'Medan', country: 'Indonesia', latitude: 3.5952, longitude: 98.6722 },
  { id: '152', name: 'Yogyakarta', country: 'Indonesia', latitude: -7.7956, longitude: 110.3695 },

  // ── Morocco ──
  { id: '71', name: 'Rabat', country: 'Morocco', latitude: 34.0209, longitude: -6.8416 },
  { id: '72', name: 'Casablanca', country: 'Morocco', latitude: 33.5731, longitude: -7.5898 },
  { id: '153', name: 'Marrakesh', country: 'Morocco', latitude: 31.6295, longitude: -7.9811 },
  { id: '154', name: 'Fez', country: 'Morocco', latitude: 34.0331, longitude: -5.0003 },
  { id: '155', name: 'Tangier', country: 'Morocco', latitude: 35.7595, longitude: -5.8340 },

  // ── Algeria ──
  { id: '68', name: 'Algiers', country: 'Algeria', latitude: 36.7538, longitude: 3.0588 },
  { id: '156', name: 'Oran', country: 'Algeria', latitude: 35.6969, longitude: -0.6331 },
  { id: '157', name: 'Constantine', country: 'Algeria', latitude: 36.3650, longitude: 6.6147 },

  // ── Tunisia ──
  { id: '69', name: 'Tunis', country: 'Tunisia', latitude: 36.8065, longitude: 10.1815 },
  { id: '158', name: 'Sfax', country: 'Tunisia', latitude: 34.7406, longitude: 10.7600 },
  { id: '159', name: 'Sousse', country: 'Tunisia', latitude: 35.8245, longitude: 10.6346 },

  // ── Palestine ──
  { id: '61', name: 'Jerusalem', country: 'Palestine', latitude: 31.7683, longitude: 35.2137 },
  { id: '62', name: 'Ramallah', country: 'Palestine', latitude: 31.9038, longitude: 35.2034 },
  { id: '160', name: 'Gaza', country: 'Palestine', latitude: 31.3547, longitude: 34.3088 },
  { id: '161', name: 'Hebron', country: 'Palestine', latitude: 31.5326, longitude: 35.0998 },
  { id: '162', name: 'Nablus', country: 'Palestine', latitude: 32.2211, longitude: 35.2544 },

  // ── Syria ──
  { id: '59', name: 'Damascus', country: 'Syria', latitude: 33.5138, longitude: 36.2765 },
  { id: '163', name: 'Aleppo', country: 'Syria', latitude: 36.2021, longitude: 37.1343 },
  { id: '164', name: 'Homs', country: 'Syria', latitude: 34.7324, longitude: 36.7137 },

  // ── Lebanon ──
  { id: '60', name: 'Beirut', country: 'Lebanon', latitude: 33.8938, longitude: 35.5018 },
  { id: '165', name: 'Tripoli', country: 'Lebanon', latitude: 34.4367, longitude: 35.8497 },
  { id: '166', name: 'Sidon', country: 'Lebanon', latitude: 33.5633, longitude: 35.3658 },

  // ── Afghanistan ──
  { id: '65', name: 'Kabul', country: 'Afghanistan', latitude: 34.5553, longitude: 69.2075 },
  { id: '167', name: 'Herat', country: 'Afghanistan', latitude: 34.3529, longitude: 62.2040 },
  { id: '168', name: 'Mazar-i-Sharif', country: 'Afghanistan', latitude: 36.7069, longitude: 67.1101 },
  { id: '169', name: 'Kandahar', country: 'Afghanistan', latitude: 31.6340, longitude: 65.7101 },

  // ── Spain ──
  { id: '27', name: 'Madrid', country: 'Spain', latitude: 40.4168, longitude: -3.7038 },
  { id: '28', name: 'Barcelona', country: 'Spain', latitude: 41.3851, longitude: 2.1734 },
  { id: '170', name: 'Valencia', country: 'Spain', latitude: 39.4699, longitude: -0.3763 },
  { id: '171', name: 'Seville', country: 'Spain', latitude: 37.3891, longitude: -5.9845 },

  // ── Italy ──
  { id: '29', name: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964 },
  { id: '30', name: 'Milan', country: 'Italy', latitude: 45.4642, longitude: 9.1900 },
  { id: '172', name: 'Naples', country: 'Italy', latitude: 40.8518, longitude: 14.2681 },
  { id: '173', name: 'Turin', country: 'Italy', latitude: 45.0703, longitude: 7.6869 },

  // ── Netherlands ──
  { id: '31', name: 'Amsterdam', country: 'Netherlands', latitude: 52.3676, longitude: 4.9041 },
  { id: '174', name: 'Rotterdam', country: 'Netherlands', latitude: 51.9244, longitude: 4.4777 },
  { id: '175', name: 'The Hague', country: 'Netherlands', latitude: 52.0705, longitude: 4.3007 },
  { id: '176', name: 'Utrecht', country: 'Netherlands', latitude: 52.0907, longitude: 5.1214 },

  // ── Poland ──
  { id: '34', name: 'Warsaw', country: 'Poland', latitude: 52.2297, longitude: 21.0122 },
  { id: '177', name: 'Krakow', country: 'Poland', latitude: 50.0647, longitude: 19.9450 },
  { id: '178', name: 'Wroclaw', country: 'Poland', latitude: 51.1079, longitude: 17.0385 },
  { id: '179', name: 'Gdansk', country: 'Poland', latitude: 54.3520, longitude: 18.6466 },

  // ── Sweden ──
  { id: '37', name: 'Stockholm', country: 'Sweden', latitude: 59.3293, longitude: 18.0686 },
  { id: '180', name: 'Gothenburg', country: 'Sweden', latitude: 57.7089, longitude: 11.9746 },
  { id: '181', name: 'Malmö', country: 'Sweden', latitude: 55.6050, longitude: 13.0038 },

  // ── Qatar ──
  { id: '15', name: 'Doha', country: 'Qatar', latitude: 25.2854, longitude: 51.5310 },
  { id: '182', name: 'Al Wakrah', country: 'Qatar', latitude: 25.1659, longitude: 51.6032 },

  // ── Kuwait ──
  { id: '55', name: 'Kuwait City', country: 'Kuwait', latitude: 29.3759, longitude: 47.9774 },
  { id: '183', name: 'Hawalli', country: 'Kuwait', latitude: 29.3328, longitude: 48.0286 },

  // ── Libya ──
  { id: '70', name: 'Tripoli', country: 'Libya', latitude: 32.8872, longitude: 13.1913 },
  { id: '184', name: 'Benghazi', country: 'Libya', latitude: 32.1194, longitude: 20.0868 },
  { id: '185', name: 'Misrata', country: 'Libya', latitude: 32.3754, longitude: 15.0925 },

  // ── Sudan ──
  { id: '73', name: 'Khartoum', country: 'Sudan', latitude: 15.5007, longitude: 32.5599 },
  { id: '186', name: 'Omdurman', country: 'Sudan', latitude: 15.6445, longitude: 32.4777 },
  { id: '187', name: 'Port Sudan', country: 'Sudan', latitude: 19.6158, longitude: 37.2164 },

  // ── Ukraine ──
  { id: '44', name: 'Kiev', country: 'Ukraine', latitude: 50.4501, longitude: 30.5234 },
  { id: '188', name: 'Odessa', country: 'Ukraine', latitude: 46.4825, longitude: 30.7233 },
  { id: '189', name: 'Kharkiv', country: 'Ukraine', latitude: 49.9935, longitude: 36.2304 },

  // ── Single-city countries (unchanged) ──
  { id: '32', name: 'Brussels', country: 'Belgium', latitude: 50.8503, longitude: 4.3517 },
  { id: '33', name: 'Vienna', country: 'Austria', latitude: 48.2082, longitude: 16.3738 },
  { id: '35', name: 'Prague', country: 'Czech Republic', latitude: 50.0755, longitude: 14.4378 },
  { id: '36', name: 'Budapest', country: 'Hungary', latitude: 47.4979, longitude: 19.0402 },
  { id: '38', name: 'Oslo', country: 'Norway', latitude: 59.9139, longitude: 10.7522 },
  { id: '39', name: 'Copenhagen', country: 'Denmark', latitude: 55.6761, longitude: 12.5683 },
  { id: '40', name: 'Helsinki', country: 'Finland', latitude: 60.1699, longitude: 24.9384 },
  { id: '41', name: 'Athens', country: 'Greece', latitude: 37.9838, longitude: 23.7275 },
  { id: '42', name: 'Sofia', country: 'Bulgaria', latitude: 42.6977, longitude: 23.3219 },
  { id: '43', name: 'Bucharest', country: 'Romania', latitude: 44.4268, longitude: 26.1025 },
  { id: '45', name: 'Minsk', country: 'Belarus', latitude: 53.9045, longitude: 27.5615 },
  { id: '46', name: 'Sarajevo', country: 'Bosnia and Herzegovina', latitude: 43.8563, longitude: 18.4131 },
  { id: '47', name: 'Tirana', country: 'Albania', latitude: 41.3275, longitude: 19.8187 },
  { id: '48', name: 'Lisbon', country: 'Portugal', latitude: 38.7223, longitude: -9.1393 },
  { id: '49', name: 'Dublin', country: 'Ireland', latitude: 53.3498, longitude: -6.2603 },
  { id: '50', name: 'Zurich', country: 'Switzerland', latitude: 47.3769, longitude: 8.5417 },
  { id: '56', name: 'Manama', country: 'Bahrain', latitude: 26.2285, longitude: 50.5860 },
  { id: '57', name: 'Muscat', country: 'Oman', latitude: 23.5880, longitude: 58.3829 },
  { id: '58', name: 'Sana\'a', country: 'Yemen', latitude: 15.3694, longitude: 44.1910 },
  { id: '74', name: 'Mogadishu', country: 'Somalia', latitude: 2.0469, longitude: 45.3182 },
  { id: '75', name: 'Djibouti', country: 'Djibouti', latitude: 11.8251, longitude: 42.5903 },
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