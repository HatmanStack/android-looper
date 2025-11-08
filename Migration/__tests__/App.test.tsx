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
    expect(getByText(/Open up App.tsx to start working on your app!/i)).toBeTruthy();
  });

  it('renders the main View component', () => {
    const { root } = render(<App />);
    expect(root).toBeTruthy();
  });
});
