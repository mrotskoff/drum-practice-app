# Drum Practice App

A mobile app for drummers to practice exercises with a built-in metronome, track progress, and manage practice sessions.

## Features

- **Exercise Selection**: Choose exercises based on skills and available practice time
- **Metronome**: Built-in adjustable metronome with tempo control (40-200 BPM)
- **Practice Sessions**: Complete exercises with duration and tempo tracking
- **Progress Tracking**: View your progress over time for each exercise
- **Session History**: View, repeat, or modify previous practice sessions
- **Exercise Categories**: 
  - Rudiments
  - Independence
  - Groove
  - Speed
  - Fills
  - Reading

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Navigate to the project directory:
```bash
cd drum-practice-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
   - Install the Expo Go app on your iOS or Android device
   - Scan the QR code displayed in the terminal
   - Or press `i` for iOS simulator or `a` for Android emulator

## Project Structure

```
drum-practice-app/
├── App.js                 # Main app component with navigation
├── src/
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.js
│   │   ├── ExerciseSelectionScreen.js
│   │   ├── PracticeScreen.js
│   │   ├── ProgressScreen.js
│   │   ├── HistoryScreen.js
│   │   └── SessionDetailScreen.js
│   ├── components/        # Reusable components
│   │   └── Metronome.js
│   ├── data/             # Data files
│   │   └── exercises.js
│   └── utils/            # Utility functions
│       └── storage.js
└── package.json
```

## Usage

1. **Start a Practice Session**:
   - Tap "Start New Practice" from the home screen
   - Filter exercises by skills and time available
   - Select exercises you want to practice
   - Tap "Start Practice"

2. **Practice with Metronome**:
   - Adjust tempo using the slider or +/- buttons
   - Start/stop the metronome
   - Complete each exercise when finished
   - Your duration and tempo are automatically recorded

3. **View Progress**:
   - Navigate to the Progress tab
   - See statistics for each exercise you've practiced
   - View average duration, tempo ranges, and recent sessions

4. **Repeat or Modify Sessions**:
   - Go to the History tab
   - View all your past practice sessions
   - Tap "Repeat" to do the same session again
   - Tap "Modify" to change exercises before practicing

## Data Storage

All data is stored locally on your device using AsyncStorage. Your practice sessions and progress data persist between app launches.

## Technologies Used

- React Native
- Expo
- React Navigation
- AsyncStorage
- Expo AV (for metronome audio)

## Notes

- The metronome currently uses a fallback implementation. For production use, you should add a proper metronome click sound file to the `assets` folder.
- The app requires basic asset files (icon.png, splash.png, etc.) which you can add to the `assets` folder.

## Future Enhancements

- Audio playback for exercise demonstrations
- Custom exercise creation
- Practice reminders and goals
- Export progress data
- Social sharing of achievements

