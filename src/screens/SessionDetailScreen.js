import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

const SessionDetailScreen = ({ route }) => {
  const { session } = route.params;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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
      return `${mins} minute${mins !== 1 ? 's' : ''} ${secs} second${secs !== 1 ? 's' : ''}`;
    }
    return `${secs} second${secs !== 1 ? 's' : ''}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(session.date)}</Text>
        <Text style={styles.duration}>
          Total Duration: {formatDuration(session.totalDuration)}
        </Text>
        <Text style={styles.exerciseCount}>
          {session.exercises.length} Exercise{session.exercises.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.exercisesContainer}>
        <Text style={styles.sectionTitle}>Exercises Practiced</Text>
        {session.exercises.map((exercise, idx) => {
          const exerciseData = session.exerciseData?.find(
            ed => ed.exerciseId === exercise.id
          );
          
          return (
            <View key={idx} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDescription}>
                {exercise.description}
              </Text>
              {exerciseData && (
                <View style={styles.exerciseStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Duration:</Text>
                    <Text style={styles.statValue}>
                      {formatDuration(exerciseData.duration)}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Tempo:</Text>
                    <Text style={styles.statValue}>
                      {exerciseData.tempo} BPM
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
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
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  duration: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 5,
  },
  exerciseCount: {
    fontSize: 16,
    color: '#8E8E93',
  },
  exercisesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  exerciseCard: {
    backgroundColor: '#F2F2F7',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  exerciseStats: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
});

export default SessionDetailScreen;

