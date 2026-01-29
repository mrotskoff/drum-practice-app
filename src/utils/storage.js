import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  PRACTICE_SESSIONS: 'practice_sessions',
  PROGRESS_DATA: 'progress_data',
};

export const storageService = {
  // Practice Sessions
  async savePracticeSession(session) {
    try {
      const sessions = await this.getPracticeSessions();
      sessions.unshift(session); // Add to beginning
      await AsyncStorage.setItem(STORAGE_KEYS.PRACTICE_SESSIONS, JSON.stringify(sessions));
      return true;
    } catch (error) {
      console.error('Error saving practice session:', error);
      return false;
    }
  },

  async getPracticeSessions() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PRACTICE_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting practice sessions:', error);
      return [];
    }
  },

  // Progress Data
  async saveProgressData(exerciseId, progressEntry) {
    try {
      const progressData = await this.getProgressData();
      if (!progressData[exerciseId]) {
        progressData[exerciseId] = [];
      }
      progressData[exerciseId].push(progressEntry);
      await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS_DATA, JSON.stringify(progressData));
      return true;
    } catch (error) {
      console.error('Error saving progress data:', error);
      return false;
    }
  },

  async getProgressData() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS_DATA);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting progress data:', error);
      return {};
    }
  },

  async getExerciseProgress(exerciseId) {
    try {
      const progressData = await this.getProgressData();
      return progressData[exerciseId] || [];
    } catch (error) {
      console.error('Error getting exercise progress:', error);
      return [];
    }
  },
};

