import axios from 'axios';
import { PrayerTimesData, CalculationMethod, MadhabType } from '../types';

const API_BASE_URL = 'https://api.aladhan.com/v1';

export const fetchPrayerTimes = async (
  latitude: number,
  longitude: number,
  method: CalculationMethod = 3,
  school: MadhabType = 0
): Promise<PrayerTimesData> => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    const response = await axios.get(`${API_BASE_URL}/timings/${today.getDate()}-${month}-${year}`, {
      params: {
        latitude,
        longitude,
        method,
        school
      }
    });
    
    if (response.data.code === 200 && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Invalid response from prayer times API');
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};

export const getNextPrayer = (prayerTimes: PrayerTimesData): { name: string; time: string; countdown: string } => {
  const now = new Date();
  
  // Make sure we have valid prayer times before proceeding
  if (!prayerTimes || !prayerTimes.timings) {
    return {
      name: 'Unknown',
      time: '--:--',
      countdown: '--'
    };
  }
  
  const prayers = [
    { name: 'Fajr', time: prayerTimes.timings.Fajr },
    { name: 'Dhuhr', time: prayerTimes.timings.Dhuhr },
    { name: 'Asr', time: prayerTimes.timings.Asr },
    { name: 'Maghrib', time: prayerTimes.timings.Maghrib },
    { name: 'Isha', time: prayerTimes.timings.Isha }
  ];
  
  // Clean time strings (remove " (EET)", etc.) and ensure they exist
  prayers.forEach(prayer => {
    if (prayer.time && typeof prayer.time === 'string') {
      prayer.time = prayer.time.split(' ')[0];
    } else {
      prayer.time = '--:--'; // Default value if time is missing
    }
  });
  
  // Find the next prayer
  for (const prayer of prayers) {
    if (prayer.time === '--:--') continue; // Skip invalid times
    
    const [hours, minutes] = prayer.time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) continue; // Skip if parsing fails
    
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);
    
    if (prayerTime > now) {
      // Calculate countdown
      const diff = prayerTime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return {
        name: prayer.name,
        time: prayer.time,
        countdown: `${hours}h ${minutes}m`
      };
    }
  }
  
  // If all prayers for today have passed, return Fajr for tomorrow
  return {
    name: 'Fajr (Tomorrow)',
    time: prayers[0].time !== '--:--' ? prayers[0].time : '--:--',
    countdown: '...'
  };
};

export const formatTime = (timeString: string, format: '12h' | '24h'): string => {
  // Handle undefined or null timeString
  if (!timeString) {
    return '--:--';
  }
  
  // Remove any timezone information if present
  const cleanTime = timeString.split(' ')[0];
  
  if (format === '24h') {
    return cleanTime;
  }
  
  // Convert to 12-hour format
  const [hours, minutes] = cleanTime.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    return '--:--';
  }
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

export const scheduleNotification = (prayerName: string, prayerTime: string): void => {
  // Don't schedule if prayer name or time is invalid
  if (!prayerName || !prayerTime || prayerTime === '--:--') return;
  
  const now = new Date();
  const [hours, minutes] = prayerTime.split(':').map(Number);
  
  // Don't schedule if time parsing fails
  if (isNaN(hours) || isNaN(minutes)) return;
  
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);
  
  // If the prayer time has already passed today, don't schedule
  if (scheduledTime <= now) return;
  
  const timeUntilPrayer = scheduledTime.getTime() - now.getTime();
  
  setTimeout(() => {
    new Notification(`Prayer Time: ${prayerName}`, {
      body: `It's time for ${prayerName} prayer.`,
      icon: '/favicon.svg'
    });
  }, timeUntilPrayer);
};