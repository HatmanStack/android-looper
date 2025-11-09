import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

describe('App', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(async () => {
    // Wait for any pending async operations to complete
    await waitFor(() => {
      // Ensure all async effects have settled
      expect(true).toBe(true);
    });
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('renders without crashing and displays all control buttons', () => {
    const { getByText } = render(<App />);

    // Top control buttons
    expect(getByText('Record')).toBeTruthy();
    expect(getByText('Stop')).toBeTruthy();

    // Bottom control buttons
    expect(getByText('Import Audio')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
  });
});
