import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { storageService } from '../utils/storage';
import { exercises } from '../data/exercises';

const ProgressScreen = () => {
  const [progressData, setProgressData] = useState({});
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const data = await storageService.getProgressData();
    setProgressData(data);
  };

  const getExerciseStats = (exerciseId) => {
    const progress = progressData[exerciseId] || [];
    if (progress.length === 0) return null;

    const durations = progress.map(p => p.duration);
    const tempos = progress.map(p => p.tempo);
    
    return {
      sessions: progress.length,
      avgDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
      maxDuration: Math.max(...durations),
      avgTempo: Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length),
      maxTempo: Math.max(...tempos),
      minTempo: Math.min(...tempos),
      progress: progress.sort((a, b) => new Date(a.date) - new Date(b.date)),
    };
  };

  const exercisesWithProgress = exercises
    .map(ex => ({
      ...ex,
      stats: getExerciseStats(ex.id),
    }))
    .filter(ex => ex.stats !== null)
    .sort((a, b) => b.stats.sessions - a.stats.sessions);

  if (exercisesWithProgress.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No progress data yet</Text>
          <Text style={styles.emptySubtext}>
            Complete some practice sessions to see your progress here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
      </View>

      {exercisesWithProgress.map(exercise => (
        <TouchableOpacity
          key={exercise.id}
          style={styles.exerciseCard}
          onPress={() => setSelectedExercise(
            selectedExercise?.id === exercise.id ? null : exercise
          )}
        >
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseMeta}>
                {exercise.stats.sessions} session{exercise.stats.sessions !== 1 ? 's' : ''}
              </Text>
            </View>
            <Text style={styles.chevron}>
              {selectedExercise?.id === exercise.id ? '▼' : '▶'}
            </Text>
          </View>

          {selectedExercise?.id === exercise.id && (
            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Average Duration:</Text>
                <Text style={styles.statValue}>
                  {Math.floor(exercise.stats.avgDuration / 60)}:
                  {(exercise.stats.avgDuration % 60).toString().padStart(2, '0')}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Max Duration:</Text>
                <Text style={styles.statValue}>
                  {Math.floor(exercise.stats.maxDuration / 60)}:
                  {(exercise.stats.maxDuration % 60).toString().padStart(2, '0')}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Average Tempo:</Text>
                <Text style={styles.statValue}>{exercise.stats.avgTempo} BPM</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Tempo Range:</Text>
                <Text style={styles.statValue}>
                  {exercise.stats.minTempo} - {exercise.stats.maxTempo} BPM
                </Text>
              </View>
              
              <View style={styles.recentSessions}>
                <Text style={styles.recentTitle}>Recent Sessions:</Text>
                {exercise.stats.progress.slice(-5).reverse().map((session, idx) => (
                  <View key={idx} style={styles.sessionRow}>
                    <Text style={styles.sessionDate}>
                      {new Date(session.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.sessionData}>
                      {Math.floor(session.duration / 60)}:
                      {(session.duration % 60).toString().padStart(2, '0')} @ {session.tempo} BPM
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  exerciseCard: {
    backgroundColor: '#F2F2F7',
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  exerciseMeta: {
    fontSize: 14,
    color: '#8E8E93',
  },
  chevron: {
    fontSize: 16,
    color: '#8E8E93',
  },
  statsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  recentSessions: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  sessionData: {
    fontSize: 14,
    color: '#000',
  },
});

export default ProgressScreen;

