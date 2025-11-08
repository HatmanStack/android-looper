// Setup file for Jest tests
// Built-in matchers are included in @testing-library/react-native v12.4+

// Mock Expo modules
jest.mock('expo', () => ({
  __ExpoImportMetaRegistry: {},
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));
