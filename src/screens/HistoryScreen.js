import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { storageService } from '../utils/storage';

const HistoryScreen = ({ navigation }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    loadSessions();
    
    // Reload when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadSessions();
    });

    return unsubscribe;
  }, [navigation]);

  const loadSessions = async () => {
    const data = await storageService.getPracticeSessions();
    setSessions(data);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const repeatSession = (session) => {
    navigation.navigate('Practice', { exercises: session.exercises });
  };

  const modifySession = (session) => {
    navigation.navigate('ExerciseSelection', {
      sessionExercises: session.exercises,
    });
  };

  const viewDetails = (session) => {
    navigation.navigate('SessionDetail', { session });
  };

  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No practice history</Text>
          <Text style={styles.emptySubtext}>
            Your completed practice sessions will appear here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Practice History</Text>
      </View>

      {sessions.map(session => (
        <View key={session.id} style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
              <Text style={styles.sessionDuration}>
                {formatDuration(session.totalDuration)}
              </Text>
              <Text style={styles.sessionExercises}>
                {session.exercises.length} exercise{session.exercises.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <View style={styles.exerciseList}>
            {session.exercises.slice(0, 3).map((exercise, idx) => (
              <Text key={idx} style={styles.exerciseItem}>
                • {exercise.name}
              </Text>
            ))}
            {session.exercises.length > 3 && (
              <Text style={styles.moreExercises}>
                +{session.exercises.length - 3} more
              </Text>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => viewDetails(session)}
            >
              <Text style={styles.actionButtonText}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.repeatButton]}
              onPress={() => repeatSession(session)}
            >
              <Text style={[styles.actionButtonText, styles.repeatButtonText]}>
                Repeat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.modifyButton]}
              onPress={() => modifySession(session)}
            >
              <Text style={[styles.actionButtonText, styles.modifyButtonText]}>
                Modify
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  sessionCard: {
    backgroundColor: '#F2F2F7',
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },
  sessionHeader: {
    marginBottom: 10,
  },
  sessionInfo: {
    marginBottom: 5,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  sessionDuration: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 3,
  },
  sessionExercises: {
    fontSize: 14,
    color: '#8E8E93',
  },
  exerciseList: {
    marginTop: 10,
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  exerciseItem: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  moreExercises: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  repeatButton: {
    backgroundColor: '#34C759',
  },
  modifyButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  repeatButtonText: {
    color: '#fff',
  },
  modifyButtonText: {
    color: '#fff',
  },
});

export default HistoryScreen;

