import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

describe('App', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(async () => {
    // Wait for cleanup operations
    await new Promise((resolve) => setTimeout(resolve, 200));
    consoleLogSpy.mockRestore();
  });
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Record/i)).toBeTruthy();
  });

  it('renders top control buttons', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Record/i)).toBeTruthy();
    expect(getByText(/Stop/i)).toBeTruthy();
  });

  it('renders bottom control buttons', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Import Audio/i)).toBeTruthy();
    expect(getByText(/Save/i)).toBeTruthy();
  });

  it('renders track list with mock tracks', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Track 1/i)).toBeTruthy();
    expect(getByText(/Track 2/i)).toBeTruthy();
    expect(getByText(/Track 3/i)).toBeTruthy();
  });
});
