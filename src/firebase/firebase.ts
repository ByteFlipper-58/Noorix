// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, setUserId, setUserProperties } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Enhanced analytics functions
export const logAnalyticsEvent = (eventName: string, eventParams?: Record<string, any>) => {
  try {
    logEvent(analytics, eventName, eventParams);
  } catch (error) {
    console.error('Error logging analytics event:', error);
  }
};

export const setAnalyticsUserId = (userId: string) => {
  try {
    setUserId(analytics, userId);
  } catch (error) {
    console.error('Error setting analytics user ID:', error);
  }
};

export const setAnalyticsUserProperties = (properties: Record<string, any>) => {
  try {
    setUserProperties(analytics, properties);
  } catch (error) {
    console.error('Error setting analytics user properties:', error);
  }
};

export { app, analytics };