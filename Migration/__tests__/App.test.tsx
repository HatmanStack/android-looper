import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

describe('App', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Looper - Audio Mixing App/i)).toBeTruthy();
  });

  it('displays Phase 1 completion message', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Phase 1: Project Setup Complete/i)).toBeTruthy();
  });

  it('renders the themed card', () => {
    const { getByText } = render(<App />);
    expect(getByText(/React Native Paper Theme Configured/i)).toBeTruthy();
  });

  it('renders the example button', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Example Button/i)).toBeTruthy();
  });
});
