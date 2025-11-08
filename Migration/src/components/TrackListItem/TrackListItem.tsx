/**
 * TrackListItem Component
 *
 * Displays an individual track with controls:
 * - Track name
 * - Play, Pause, Delete buttons
 * - Volume and Speed sliders (placeholders for now)
 */

import React from 'react';
import { View, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import type { Track } from '../../types';
import { styles } from './TrackListItem.styles';

export interface TrackListItemProps {
  track: Track;
  onPlay?: (trackId: string) => void;
  onPause?: (trackId: string) => void;
  onDelete?: (trackId: string) => void;
  onVolumeChange?: (trackId: string, volume: number) => void;
  onSpeedChange?: (trackId: string, speed: number) => void;
}

export const TrackListItem: React.FC<TrackListItemProps> = ({
  track,
  onPlay,
  onPause,
  onDelete,
  onVolumeChange: _onVolumeChange,
  onSpeedChange: _onSpeedChange,
}) => {
  const handlePlay = () => {
    console.log(`Play track: ${track.id}`);
    onPlay?.(track.id);
  };

  const handlePause = () => {
    console.log(`Pause track: ${track.id}`);
    onPause?.(track.id);
  };

  const handleDelete = () => {
    console.log(`Delete track: ${track.id}`);
    onDelete?.(track.id);
  };

  return (
    <View style={styles.container}>
      {/* Track Name */}
      <Text style={styles.trackName}>{track.name}</Text>

      {/* Control Buttons Row */}
      <View style={styles.controlsRow}>
        {/* Play Button (left) */}
        <IconButton
          icon="play"
          size={30}
          iconColor={track.isPlaying ? '#BB86FC' : '#E1E1E1'}
          onPress={handlePlay}
          style={styles.playButton}
        />

        {/* Sliders Section */}
        <View style={styles.slidersContainer}>
          {/* Volume Section */}
          <View style={styles.sliderSection}>
            <Text style={styles.sliderLabel}>Volume: {track.volume}</Text>
            {/* Placeholder for volume slider - Task 4 */}
            <View style={styles.sliderPlaceholder} />
          </View>

          {/* Speed Section */}
          <View style={styles.sliderSection}>
            <Text style={styles.sliderLabel}>Speed: {track.speed.toFixed(2)}x</Text>
            {/* Placeholder for speed slider - Task 4 */}
            <View style={styles.sliderPlaceholder} />
          </View>
        </View>

        {/* Pause Button (right) */}
        <IconButton
          icon="pause"
          size={30}
          iconColor="#E1E1E1"
          onPress={handlePause}
          style={styles.pauseButton}
        />

        {/* Delete Button (far right) */}
        <IconButton
          icon="delete"
          size={30}
          iconColor="#E1E1E1"
          onPress={handleDelete}
          style={styles.deleteButton}
        />
      </View>
    </View>
  );
};
