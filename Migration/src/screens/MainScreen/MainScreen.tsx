/**
 * MainScreen Component
 *
 * Main screen layout for the Looper app with three sections:
 * - Top controls: Record and Stop buttons
 * - Middle section: Track list with FlatList
 * - Bottom controls: Import Audio and Save buttons
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrackList } from '@components/TrackList';
import { ActionButton } from '@components/ActionButton';
import type { Track } from '../../types';
import { styles } from './MainScreen.styles';

// Mock data for testing
const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    name: 'Track 1',
    uri: 'mock://track1.mp3',
    duration: 120000, // 2 minutes
    speed: 1.0,
    volume: 75,
    isPlaying: false,
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Track 2',
    uri: 'mock://track2.mp3',
    duration: 180000, // 3 minutes
    speed: 1.25,
    volume: 100,
    isPlaying: true,
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: 'Track 3',
    uri: 'mock://track3.mp3',
    duration: 90000, // 1.5 minutes
    speed: 0.75,
    volume: 50,
    isPlaying: false,
    createdAt: Date.now(),
  },
];

export const MainScreen: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);

  const handleRecord = () => {
    console.log('Record button pressed');
  };

  const handleStop = () => {
    console.log('Stop button pressed');
  };

  const handleImport = () => {
    console.log('Import Audio button pressed');
  };

  const handleSave = () => {
    console.log('Save button pressed');
  };

  const handlePlay = (trackId: string) => {
    console.log(`Play track: ${trackId}`);
    // Update track state in future phases
  };

  const handlePause = (trackId: string) => {
    console.log(`Pause track: ${trackId}`);
    // Update track state in future phases
  };

  const handleDelete = (trackId: string) => {
    console.log(`Delete track: ${trackId}`);
    setTracks((prevTracks) => prevTracks.filter((track) => track.id !== trackId));
  };

  const handleVolumeChange = (trackId: string, volume: number) => {
    console.log(`Volume change for track ${trackId}: ${volume}`);
    // Update track state in future phases
  };

  const handleSpeedChange = (trackId: string, speed: number) => {
    console.log(`Speed change for track ${trackId}: ${speed}`);
    // Update track state in future phases
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Top Controls */}
        <Surface style={styles.topControls} elevation={0}>
          <ActionButton label="Record" icon="microphone" onPress={handleRecord} />
          <ActionButton label="Stop" icon="stop" onPress={handleStop} />
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
          <ActionButton label="Import Audio" icon="file-music" onPress={handleImport} />
          <ActionButton label="Save" icon="content-save" onPress={handleSave} />
        </Surface>
      </View>
    </SafeAreaView>
  );
};
