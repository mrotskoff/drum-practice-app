import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Metronome from '../components/Metronome';
import { storageService } from '../utils/storage';

const PracticeScreen = ({ navigation, route }) => {
  const { exercises } = route.params;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
  const [tempo, setTempo] = useState(exercises[0]?.defaultTempo || 120);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [exerciseStartTime, setExerciseStartTime] = useState(null);
  const [exerciseData, setExerciseData] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const startTime = new Date();
    setSessionStartTime(startTime);
    setExerciseStartTime(startTime);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentExerciseIndex < exercises.length) {
      const newTempo = exercises[currentExerciseIndex].defaultTempo || 120;
      setTempo(newTempo);
      setExerciseStartTime(new Date());
    }
  }, [currentExerciseIndex, exercises]);

  const finishExercise = () => {
    const exercise = exercises[currentExerciseIndex];
    const duration = Math.round((new Date() - exerciseStartTime) / 1000); // seconds
    
    const data = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      duration,
      tempo: Math.round(tempo),
      timestamp: new Date().toISOString(),
    };
    
    setExerciseData(prev => [...prev, data]);
    
    // Save progress
    storageService.saveProgressData(exercise.id, {
      duration,
      tempo: Math.round(tempo),
      date: new Date().toISOString(),
    });
    
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      finishSession();
    }
  };

  const finishSession = async () => {
    const totalDuration = Math.round((new Date() - sessionStartTime) / 1000);
    
    const session = {
      id: Date.now().toString(),
      exercises: exercises.map((ex, idx) => ({
        ...ex,
        ...(exerciseData[idx] || {}),
      })),
      totalDuration,
      date: new Date().toISOString(),
      exerciseData,
    };
    
    await storageService.savePracticeSession(session);
    
    Alert.alert(
      'Session Complete!',
      `You practiced for ${Math.round(totalDuration / 60)} minutes. Great work!`,
      [
        {
          text: 'View Progress',
          onPress: () => navigation.navigate('Progress'),
        },
        {
          text: 'Done',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  const skipExercise = () => {
    Alert.alert(
      'Skip Exercise',
      'Are you sure you want to skip this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            if (currentExerciseIndex < exercises.length - 1) {
              setCurrentExerciseIndex(prev => prev + 1);
            } else {
              finishSession();
            }
          },
        },
      ]
    );
  };

  const currentExercise = exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      
      <View style={styles.header}>
        <Text style={styles.exerciseNumber}>
          Exercise {currentExerciseIndex + 1} of {exercises.length}
        </Text>
        <Text style={styles.exerciseName}>{currentExercise.name}</Text>
        <Text style={styles.exerciseDescription}>
          {currentExercise.description}
        </Text>
      </View>

      <Metronome
        tempo={tempo}
        onTempoChange={setTempo}
        isPlaying={isMetronomePlaying}
        onToggle={() => setIsMetronomePlaying(!isMetronomePlaying)}
      />

      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Time on this exercise</Text>
        <Timer startTime={exerciseStartTime} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.finishButton}
          onPress={finishExercise}
        >
          <Text style={styles.finishButtonText}>Complete Exercise</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.skipButton}
          onPress={skipExercise}
        >
          <Text style={styles.skipButtonText}>Skip Exercise</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const Timer = ({ startTime }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    
    const interval = setInterval(() => {
      setElapsed(Math.floor((new Date() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return <Text style={styles.timerValue}>{formatTime(elapsed)}</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  exerciseNumber: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 5,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    padding: 20,
  },
  timerLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 10,
  },
  timerValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  buttonContainer: {
    padding: 20,
  },
  finishButton: {
    backgroundColor: '#34C759',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#8E8E93',
    fontSize: 16,
  },
});

export default PracticeScreen;

