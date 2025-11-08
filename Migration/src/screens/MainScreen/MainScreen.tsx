/**
 * MainScreen Component
 *
 * Main screen layout for the Looper app with three sections:
 * - Top controls: Record and Stop buttons
 * - Middle section: Track list (placeholder for now)
 * - Bottom controls: Import Audio and Save buttons
 */

import React from 'react';
import { View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './MainScreen.styles';

export const MainScreen: React.FC = () => {
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Top Controls */}
        <Surface style={styles.topControls} elevation={0}>
          <Button
            mode="contained"
            onPress={handleRecord}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Record
          </Button>
          <Button
            mode="contained"
            onPress={handleStop}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Stop
          </Button>
        </Surface>

        {/* Middle Section - Track List Area */}
        <View style={styles.trackListContainer}>
          <Text style={styles.placeholderText}>Track list will appear here</Text>
        </View>

        {/* Bottom Controls */}
        <Surface style={styles.bottomControls} elevation={0}>
          <Button
            mode="contained"
            onPress={handleImport}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Import Audio
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Save
          </Button>
        </Surface>
      </View>
    </SafeAreaView>
  );
};
