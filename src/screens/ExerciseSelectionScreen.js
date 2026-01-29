import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { exercises, exerciseCategories, timeRanges, skillOptions } from '../data/exercises';

const ExerciseSelectionScreen = ({ navigation, route }) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState(exercises);

  // If coming from history to modify a session
  useEffect(() => {
    if (route.params?.sessionExercises) {
      setSelectedExercises(route.params.sessionExercises);
    }
  }, [route.params]);

  useEffect(() => {
    filterExercises();
  }, [selectedSkills, selectedTimeRange, searchQuery]);

  const filterExercises = () => {
    let filtered = exercises;

    // Filter by skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(exercise =>
        exercise.skills.some(skill => selectedSkills.includes(skill))
      );
    }

    // Filter by time range
    if (selectedTimeRange) {
      const range = timeRanges.find(r => r.id === selectedTimeRange);
      filtered = filtered.filter(exercise =>
        exercise.estimatedTime >= range.min && exercise.estimatedTime <= range.max
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleExercise = (exercise) => {
    setSelectedExercises(prev =>
      prev.find(e => e.id === exercise.id)
        ? prev.filter(e => e.id !== exercise.id)
        : [...prev, exercise]
    );
  };

  const getTotalTime = () => {
    return selectedExercises.reduce((sum, ex) => sum + ex.estimatedTime, 0);
  };

  const startPractice = () => {
    if (selectedExercises.length === 0) {
      alert('Please select at least one exercise');
      return;
    }
    navigation.navigate('Practice', { exercises: selectedExercises });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter by Skills</Text>
        <View style={styles.chipContainer}>
          {skillOptions.map(skill => (
            <TouchableOpacity
              key={skill}
              style={[
                styles.chip,
                selectedSkills.includes(skill) && styles.chipSelected,
              ]}
              onPress={() => toggleSkill(skill)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedSkills.includes(skill) && styles.chipTextSelected,
                ]}
              >
                {skill}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter by Time</Text>
        <View style={styles.chipContainer}>
          {timeRanges.map(range => (
            <TouchableOpacity
              key={range.id}
              style={[
                styles.chip,
                selectedTimeRange === range.id && styles.chipSelected,
              ]}
              onPress={() => setSelectedTimeRange(
                selectedTimeRange === range.id ? null : range.id
              )}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedTimeRange === range.id && styles.chipTextSelected,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Available Exercises ({filteredExercises.length})
        </Text>
        {filteredExercises.map(exercise => {
          const isSelected = selectedExercises.find(e => e.id === exercise.id);
          return (
            <TouchableOpacity
              key={exercise.id}
              style={[
                styles.exerciseCard,
                isSelected && styles.exerciseCardSelected,
              ]}
              onPress={() => toggleExercise(exercise)}
            >
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.exerciseDescription}>
                {exercise.description}
              </Text>
              <View style={styles.exerciseMeta}>
                <Text style={styles.exerciseMetaText}>
                  {exerciseCategories[exercise.category].name}
                </Text>
                <Text style={styles.exerciseMetaText}>
                  {exercise.estimatedTime} min
                </Text>
                <Text style={styles.exerciseMetaText}>
                  {exercise.difficulty}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedExercises.length > 0 && (
        <View style={styles.selectedSection}>
          <Text style={styles.selectedTitle}>
            Selected ({selectedExercises.length}) - {getTotalTime()} min
          </Text>
          {selectedExercises.map(exercise => (
            <View key={exercise.id} style={styles.selectedExercise}>
              <Text style={styles.selectedExerciseText}>{exercise.name}</Text>
              <TouchableOpacity onPress={() => toggleExercise(exercise)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.startButton,
          selectedExercises.length === 0 && styles.startButtonDisabled,
        ]}
        onPress={startPractice}
        disabled={selectedExercises.length === 0}
      >
        <Text style={styles.startButtonText}>
          Start Practice ({selectedExercises.length} exercises)
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  chipSelected: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    color: '#000',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
  searchInput: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  exerciseCard: {
    backgroundColor: '#F2F2F7',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  exerciseCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  checkmark: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 10,
  },
  exerciseMeta: {
    flexDirection: 'row',
    gap: 15,
  },
  exerciseMetaText: {
    fontSize: 12,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  selectedSection: {
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  selectedExercise: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  selectedExerciseText: {
    fontSize: 16,
    color: '#000',
  },
  removeText: {
    fontSize: 14,
    color: '#FF3B30',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExerciseSelectionScreen;

