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
    expect(getByText(/Track list will appear here/i)).toBeTruthy();
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

  it('renders track list placeholder', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Track list will appear here/i)).toBeTruthy();
  });
});
