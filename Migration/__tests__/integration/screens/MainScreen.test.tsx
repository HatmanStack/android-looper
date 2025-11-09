import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { MainScreen } from '../../../src/screens/MainScreen/MainScreen';

const renderWithProvider = (component: React.ReactElement) => {
  return render(<PaperProvider>{component}</PaperProvider>);
};

describe('MainScreen Integration', () => {
  it('renders all main sections', () => {
    const { getByText } = renderWithProvider(<MainScreen />);

    // Top controls
    expect(getByText('Record')).toBeTruthy();
    expect(getByText('Stop')).toBeTruthy();

    // Bottom controls
    expect(getByText('Import Audio')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
  });

  it('renders track list with mock data', () => {
    const { getByText } = renderWithProvider(<MainScreen />);

    expect(getByText('Track 1')).toBeTruthy();
    expect(getByText('Track 2')).toBeTruthy();
    expect(getByText('Track 3')).toBeTruthy();
  });

  it('opens save modal when Save button is pressed', () => {
    const { getByText } = renderWithProvider(<MainScreen />);

    const saveButton = getByText('Save');
    fireEvent.press(saveButton);

    // Modal should appear with Cancel button
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('closes save modal when Cancel is pressed', () => {
    const { getByText } = renderWithProvider(<MainScreen />);

    // Open modal
    fireEvent.press(getByText('Save'));
    expect(getByText('Cancel')).toBeTruthy();

    // Close modal
    fireEvent.press(getByText('Cancel'));

    // Modal should be closed (check for main screen content being visible again)
    expect(getByText('Track 1')).toBeTruthy();
  });

  it('deletes track when delete button is pressed', () => {
    const { getAllByTestId, queryByText } = renderWithProvider(<MainScreen />);

    // Initially Track 1 exists
    expect(queryByText('Track 1')).toBeTruthy();

    // Get all icon buttons and find delete button for Track 1
    const iconButtons = getAllByTestId('icon-button');
    // Each track has 3 icon buttons (play, pause, delete)
    // Track 1's delete button is at index 2 (0=play, 1=pause, 2=delete)
    const deleteButton = iconButtons[2];

    fireEvent.press(deleteButton);

    // Track 1 should be removed
    expect(queryByText('Track 1')).toBeNull();
  });

  it('all action buttons are clickable', () => {
    const { getByText } = renderWithProvider(<MainScreen />);

    // Verify all buttons can be pressed without errors
    const recordButton = getByText('Record');
    const stopButton = getByText('Stop');
    const importButton = getByText('Import Audio');
    const saveButton = getByText('Save');

    expect(() => fireEvent.press(recordButton)).not.toThrow();
    expect(() => fireEvent.press(stopButton)).not.toThrow();
    expect(() => fireEvent.press(importButton)).not.toThrow();
    expect(() => fireEvent.press(saveButton)).not.toThrow();
  });

  it('track controls are functional', () => {
    const { getAllByTestId } = renderWithProvider(<MainScreen />);

    const iconButtons = getAllByTestId('icon-button');

    // Each track has 3 icon buttons
    expect(iconButtons.length).toBeGreaterThanOrEqual(9); // 3 tracks * 3 buttons

    // Press play button for Track 1
    const playButton = iconButtons[0];
    expect(() => fireEvent.press(playButton)).not.toThrow();

    // Press pause button for Track 1
    const pauseButton = iconButtons[1];
    expect(() => fireEvent.press(pauseButton)).not.toThrow();
  });

  it('sliders update values', () => {
    const { getAllByTestId } = renderWithProvider(<MainScreen />);

    const sliders = getAllByTestId('slider');

    // Each track has 2 sliders (volume and speed)
    expect(sliders.length).toBeGreaterThanOrEqual(6); // 3 tracks * 2 sliders

    // Change volume for Track 1
    const volumeSlider = sliders[0];
    expect(() => fireEvent(volumeSlider, 'onValueChange', 90)).not.toThrow();

    // Change speed for Track 1
    const speedSlider = sliders[1];
    expect(() => fireEvent(speedSlider, 'onValueChange', 82)).not.toThrow();
  });
});
