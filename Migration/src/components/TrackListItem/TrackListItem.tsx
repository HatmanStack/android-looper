/**
 * TrackListItem Component
 *
 * Displays an individual track with controls:
 * - Track name
 * - Play, Pause, Delete buttons
 * - Volume and Speed sliders
 */

import React from 'react';
import { View, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { VolumeSlider } from '../VolumeSlider';
import { SpeedSlider } from '../SpeedSlider';
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
  onVolumeChange,
  onSpeedChange,
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

  const handleVolumeChange = (volume: number) => {
    onVolumeChange?.(track.id, volume);
  };

  const handleSpeedChange = (speed: number) => {
    onSpeedChange?.(track.id, speed);
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
          {/* Volume Slider */}
          <VolumeSlider value={track.volume} onValueChange={handleVolumeChange} />

          {/* Speed Slider */}
          <SpeedSlider value={track.speed} onValueChange={handleSpeedChange} />
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
