/**
 * MainScreen Component
 *
 * Main screen layout for the Looper app with three sections:
 * - Top controls: Record and Stop buttons
 * - Middle section: Track list with FlatList
 * - Bottom controls: Import Audio and Save buttons
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Alert } from 'react-native';
import { Surface, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrackList } from '@components/TrackList';
import { ActionButton } from '@components/ActionButton';
import { SaveModal } from '@components/SaveModal';
import type { Track } from '../../types';
import { styles } from './MainScreen.styles';
import { registerMockServices } from '../../services/audio/mock';
import { getAudioService } from '../../services/audio/AudioServiceFactory';
import { AudioService } from '../../services/audio/AudioService';
import { AudioError } from '../../services/audio/AudioError';

// Register mock services on module load
registerMockServices();

export const MainScreen: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioServiceRef = useRef<AudioService | null>(null);

  // Initialize AudioService
  useEffect(() => {
    try {
      audioServiceRef.current = getAudioService();
      console.log('[MainScreen] AudioService initialized');
    } catch (error) {
      console.error('[MainScreen] Failed to initialize AudioService:', error);
      if (error instanceof AudioError) {
        Alert.alert('Error', error.userMessage);
      }
    }

    return () => {
      // Cleanup on unmount
      if (audioServiceRef.current) {
        audioServiceRef.current.cleanup();
      }
    };
  }, []);

  const handleRecord = async () => {
    if (!audioServiceRef.current) {
      Alert.alert('Error', 'Audio service not initialized');
      return;
    }

    try {
      setIsLoading(true);
      await audioServiceRef.current.startRecording();
      setIsRecording(true);
      console.log('[MainScreen] Recording started');
    } catch (error) {
      console.error('[MainScreen] Recording failed:', error);
      if (error instanceof AudioError) {
        Alert.alert('Recording Error', error.userMessage);
      } else {
        Alert.alert('Error', 'Failed to start recording');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    if (!audioServiceRef.current) {
      Alert.alert('Error', 'Audio service not initialized');
      return;
    }

    try {
      setIsLoading(true);
      const uri = await audioServiceRef.current.stopRecording();
      setIsRecording(false);

      // Create new track
      const newTrack: Track = {
        id: `track-${Date.now()}`,
        name: `Recording ${tracks.length + 1}`,
        uri,
        duration: audioServiceRef.current.getRecordingDuration(),
        speed: 1.0,
        volume: 75,
        isPlaying: false,
        createdAt: Date.now(),
      };

      // Load track for playback
      await audioServiceRef.current.loadTrack(newTrack.id, newTrack.uri, {
        speed: newTrack.speed,
        volume: newTrack.volume,
        loop: true,
      });

      setTracks((prevTracks) => [...prevTracks, newTrack]);
      console.log('[MainScreen] Recording stopped and track added:', newTrack.name);
    } catch (error) {
      console.error('[MainScreen] Stop recording failed:', error);
      if (error instanceof AudioError) {
        Alert.alert('Error', error.userMessage);
      } else {
        Alert.alert('Error', 'Failed to stop recording');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    console.log('Import Audio button pressed');
    Alert.alert('Coming Soon', 'Audio import will be implemented in Phase 4');
  };

  const handleSave = () => {
    console.log('Save button pressed');
    setSaveModalVisible(true);
  };

  const handleSaveModalDismiss = () => {
    setSaveModalVisible(false);
  };

  const handleSaveModalSave = (filename: string) => {
    console.log(`Saving file as: ${filename}`);
    setSaveModalVisible(false);
    Alert.alert('Coming Soon', 'Audio mixing and saving will be implemented in Phase 6');
  };

  const handlePlay = async (trackId: string) => {
    if (!audioServiceRef.current) {
      return;
    }

    try {
      await audioServiceRef.current.playTrack(trackId);

      // Update track state
      setTracks((prevTracks) =>
        prevTracks.map((track) => (track.id === trackId ? { ...track, isPlaying: true } : track))
      );

      console.log(`[MainScreen] Playing track: ${trackId}`);
    } catch (error) {
      console.error('[MainScreen] Play failed:', error);
      if (error instanceof AudioError) {
        Alert.alert('Playback Error', error.userMessage);
      }
    }
  };

  const handlePause = async (trackId: string) => {
    if (!audioServiceRef.current) {
      return;
    }

    try {
      await audioServiceRef.current.pauseTrack(trackId);

      // Update track state
      setTracks((prevTracks) =>
        prevTracks.map((track) => (track.id === trackId ? { ...track, isPlaying: false } : track))
      );

      console.log(`[MainScreen] Paused track: ${trackId}`);
    } catch (error) {
      console.error('[MainScreen] Pause failed:', error);
      if (error instanceof AudioError) {
        Alert.alert('Playback Error', error.userMessage);
      }
    }
  };

  const handleDelete = async (trackId: string) => {
    if (!audioServiceRef.current) {
      return;
    }

    try {
      // Unload and delete track
      await audioServiceRef.current.unloadTrack(trackId);

      setTracks((prevTracks) => prevTracks.filter((track) => track.id !== trackId));

      console.log(`[MainScreen] Deleted track: ${trackId}`);
    } catch (error) {
      console.error('[MainScreen] Delete failed:', error);
      if (error instanceof AudioError) {
        Alert.alert('Delete Error', error.userMessage);
      }
    }
  };

  const handleVolumeChange = async (trackId: string, volume: number) => {
    if (!audioServiceRef.current) {
      return;
    }

    try {
      await audioServiceRef.current.setTrackVolume(trackId, volume);

      // Update track state
      setTracks((prevTracks) =>
        prevTracks.map((track) => (track.id === trackId ? { ...track, volume } : track))
      );

      console.log(`[MainScreen] Volume changed for track ${trackId}: ${volume}`);
    } catch (error) {
      console.error('[MainScreen] Volume change failed:', error);
    }
  };

  const handleSpeedChange = async (trackId: string, speed: number) => {
    if (!audioServiceRef.current) {
      return;
    }

    try {
      await audioServiceRef.current.setTrackSpeed(trackId, speed);

      // Update track state
      setTracks((prevTracks) =>
        prevTracks.map((track) => (track.id === trackId ? { ...track, speed } : track))
      );

      console.log(`[MainScreen] Speed changed for track ${trackId}: ${speed}`);
    } catch (error) {
      console.error('[MainScreen] Speed change failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Top Controls */}
        <Surface style={styles.topControls} elevation={0}>
          <ActionButton
            label={isRecording ? 'Recording...' : 'Record'}
            icon="microphone"
            onPress={handleRecord}
            disabled={isRecording || isLoading}
          />
          <ActionButton
            label="Stop"
            icon="stop"
            onPress={handleStop}
            disabled={!isRecording || isLoading}
          />
        </Surface>

        {/* Middle Section - Track List */}
        <View style={styles.trackListContainer}>
          <TrackList
            tracks={tracks}
            onPlay={handlePlay}
            onPause={handlePause}
            onDelete={handleDelete}
            onVolumeChange={handleVolumeChange}
            onSpeedChange={handleSpeedChange}
          />
        </View>

        {/* Bottom Controls */}
        <Surface style={styles.bottomControls} elevation={0}>
          <ActionButton
            label="Import Audio"
            icon="file-music"
            onPress={handleImport}
            disabled={isLoading}
          />
          <ActionButton
            label="Save"
            icon="content-save"
            onPress={handleSave}
            disabled={tracks.length === 0 || isLoading}
          />
        </Surface>

        {/* Save Modal */}
        <SaveModal
          visible={saveModalVisible}
          trackNumber={tracks.length}
          onDismiss={handleSaveModalDismiss}
          onSave={handleSaveModalSave}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <ActivityIndicator size="large" color="#BB86FC" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
