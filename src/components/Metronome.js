import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from 'react-native-slider';
import { Audio } from 'expo-av';

const Metronome = ({ tempo = 120, onTempoChange, isPlaying, onToggle }) => {
  const [sound, setSound] = useState(null);
  const intervalRef = useRef(null);
  const beatRef = useRef(0);
  const [beatIndicator, setBeatIndicator] = useState(false);

  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startMetronome();
    } else {
      stopMetronome();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, tempo, sound]);

  const loadSound = async () => {
    try {
      // Set up audio mode for better performance
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
      
      // Note: To add actual metronome click sound, add a metronome-click.mp3 file
      // to the assets/ folder and uncomment the following:
      // const { sound: metronomeSound } = await Audio.Sound.createAsync(
      //   require('../../assets/metronome-click.mp3'),
      //   { shouldPlay: false, isLooping: false }
      // );
      // setSound(metronomeSound);
    } catch (error) {
      console.error('Error loading metronome sound:', error);
    }
  };

  const playClick = async () => {
    try {
      if (sound) {
        await sound.replayAsync();
      }
      // Visual feedback
      setBeatIndicator(true);
      setTimeout(() => setBeatIndicator(false), 100);
    } catch (error) {
      console.error('Error playing click:', error);
    }
  };

  const startMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const interval = 60000 / tempo; // Convert BPM to milliseconds
    beatRef.current = 0;
    
    intervalRef.current = setInterval(() => {
      playClick();
      beatRef.current = (beatRef.current + 1) % 4;
    }, interval);
  };

  const stopMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tempoContainer}>
        <Text style={styles.tempoLabel}>Tempo (BPM)</Text>
        <Text style={[styles.tempoValue, beatIndicator && styles.tempoValuePulse]}>
          {Math.round(tempo)}
        </Text>
      </View>
      
      <Slider
        style={styles.slider}
        minimumValue={40}
        maximumValue={200}
        value={tempo}
        onValueChange={onTempoChange}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#E5E5EA"
        thumbTintColor="#007AFF"
      />
      
      <View style={styles.tempoButtons}>
        <TouchableOpacity
          style={styles.tempoButton}
          onPress={() => onTempoChange(Math.max(40, tempo - 5))}
        >
          <Text style={styles.tempoButtonText}>-5</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tempoButton}
          onPress={() => onTempoChange(Math.min(200, tempo + 5))}
        >
          <Text style={styles.tempoButtonText}>+5</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={[styles.playButton, isPlaying && styles.playButtonActive]}
        onPress={onToggle}
      >
        <Text style={styles.playButtonText}>
          {isPlaying ? 'Stop' : 'Start'} Metronome
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
  },
  tempoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tempoLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
  },
  tempoValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  tempoValuePulse: {
    opacity: 0.5,
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 10,
  },
  tempoButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tempoButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  tempoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  playButtonActive: {
    backgroundColor: '#FF3B30',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Metronome;

