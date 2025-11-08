/**
 * VolumeSlider Component
 *
 * Slider for controlling track volume (0-100)
 */

import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { styles } from './VolumeSlider.styles';

export interface VolumeSliderProps {
  value: number; // 0-100
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Volume: {Math.round(value)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        minimumTrackTintColor="#BB86FC" // Theme primary color
        maximumTrackTintColor="#666"
        thumbTintColor="#FFFFFF"
      />
    </View>
  );
};
