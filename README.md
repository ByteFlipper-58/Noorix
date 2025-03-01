# Noorix - Prayer Time Tracker

![Noorix Logo](public/favicon.svg)

Noorix is a modern, responsive web application designed to help Muslims track prayer times, Ramadan schedules, and more. Built with React, TypeScript, and Tailwind CSS, it offers a seamless experience across devices.

## Features

- **Prayer Time Tracking**: Accurate prayer times based on your location
- **Ramadan Calendar**: Track Ramadan days, iftar and suhoor times
- **Location Detection**: Automatic location detection or manual city selection
- **Customizable Settings**: 
  - Multiple calculation methods (15+ options)
  - Madhab selection for Asr prayer calculation
  - 12/24 hour time format
  - Multilingual support (English/Russian/Arabic)
  - Prayer time notifications
- **Moon Phase Indicator**: Visual display of current moon phase
- **Iftar Timer**: Countdown to iftar during Ramadan
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Privacy Policy**: Transparent information about data usage

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **API Integration**: Aladhan API for prayer times
- **Icons**: Lucide React
- **Deployment**: Firebase Hosting
- **Analytics**: Firebase Analytics

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/noorix-app.git
   cd noorix-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```
   
   Note: A `.env.example` file is provided as a template.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

### Building for Production

```bash
npm run build
```

### Deployment

```bash
npm run deploy
```

## Project Structure

```
noorix-app/
├── public/                # Static assets
├── src/
│   ├── components/        # React components
│   ├── context/           # React context providers
│   ├── data/              # Static data (cities, etc.)
│   ├── firebase/          # Firebase configuration
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main App component
│   └── main.tsx           # Application entry point
├── .env                   # Environment variables (not committed to git)
├── .env.example           # Example environment variables template
├── index.html             # HTML template
├── package.json           # Project dependencies
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Key Components

- **PrayerTimesTab**: Displays daily prayer times and next prayer countdown
- **RamadanTab**: Shows Ramadan calendar, tracker, and related information
- **LocationTab**: Handles location detection and city selection
- **SettingsTab**: Manages user preferences and application settings
- **PrivacyPolicyTab**: Provides information about data usage and privacy practices
- **IftarTimer**: Countdown timer for iftar during Ramadan
- **MoonPhase**: Displays current moon phase with visual indicator

## API Integration

The application uses the [Aladhan API](https://aladhan.com/prayer-times-api) to fetch accurate prayer times based on location and calculation method preferences.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Developer

- **ByteFlipper**
  - Website: [byteflipper.web.app](https://byteflipper.web.app)
  - Telegram: [t.me/byteflipper](https://t.me/byteflipper)
  - VK: [vk.com/byteflipper](https://vk.com/byteflipper)

## Acknowledgements

- [Aladhan API](https://aladhan.com/prayer-times-api) for providing prayer time data
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for beautiful icons
- [Firebase](https://firebase.google.com/) for hosting and analytics