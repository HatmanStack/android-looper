/**
 * Permissions Utility Tests
 */

import {
  requestMicrophonePermission,
  requestStoragePermission,
  PermissionStatus,
} from '../../../src/utils/permissions';
import { Platform } from 'react-native';

// Mock platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: {
      RECORD_AUDIO: 'android.permission.RECORD_AUDIO',
      WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
      NEVER_ASK_AGAIN: 'never_ask_again',
    },
  },
}));

describe('Permissions Utils', () => {
  describe('requestMicrophonePermission', () => {
    describe('iOS/Web', () => {
      beforeEach(() => {
        (Platform as any).OS = 'ios';
      });

      it('should return granted status on iOS (handled by expo-av)', async () => {
        const result = await requestMicrophonePermission();
        expect(result.status).toBe(PermissionStatus.GRANTED);
        expect(result.canAskAgain).toBe(true);
      });
    });

    describe('Android', () => {
      beforeEach(() => {
        (Platform as any).OS = 'android';
        jest.clearAllMocks();
      });

      it('should return granted status if permission granted', async () => {
        const PermissionsAndroid = require('react-native').PermissionsAndroid;
        PermissionsAndroid.request.mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

        const result = await requestMicrophonePermission();

        expect(result.status).toBe(PermissionStatus.GRANTED);
        expect(result.canAskAgain).toBe(true);
      });

      it('should return denied status and canAskAgain=true if permission denied', async () => {
        const PermissionsAndroid = require('react-native').PermissionsAndroid;
        PermissionsAndroid.request.mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);

        const result = await requestMicrophonePermission();

        expect(result.status).toBe(PermissionStatus.DENIED);
        expect(result.canAskAgain).toBe(true);
      });

      it('should return denied status and canAskAgain=false if never ask again', async () => {
        const PermissionsAndroid = require('react-native').PermissionsAndroid;
        PermissionsAndroid.request.mockResolvedValue(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN);

        const result = await requestMicrophonePermission();

        expect(result.status).toBe(PermissionStatus.DENIED);
        expect(result.canAskAgain).toBe(false);
      });
    });
  });

  describe('requestStoragePermission', () => {
    describe('iOS/Web', () => {
      beforeEach(() => {
        (Platform as any).OS = 'ios';
      });

      it('should return granted status on iOS (handled by system)', async () => {
        const result = await requestStoragePermission();
        expect(result.status).toBe(PermissionStatus.GRANTED);
        expect(result.canAskAgain).toBe(true);
      });
    });

    describe('Android', () => {
      beforeEach(() => {
        (Platform as any).OS = 'android';
        jest.clearAllMocks();
      });

      it('should request storage permission on Android', async () => {
        const PermissionsAndroid = require('react-native').PermissionsAndroid;
        PermissionsAndroid.request.mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

        const result = await requestStoragePermission();

        expect(result.status).toBe(PermissionStatus.GRANTED);
        expect(result.canAskAgain).toBe(true);
      });

      it('should return denied status if storage permission denied', async () => {
        const PermissionsAndroid = require('react-native').PermissionsAndroid;
        PermissionsAndroid.request.mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);

        const result = await requestStoragePermission();

        expect(result.status).toBe(PermissionStatus.DENIED);
        expect(result.canAskAgain).toBe(true);
      });
    });
  });

  describe('Web platform', () => {
    beforeEach(() => {
      (Platform as any).OS = 'web';
    });

    it('should return granted status for microphone on web', async () => {
      const result = await requestMicrophonePermission();
      expect(result.status).toBe(PermissionStatus.GRANTED);
    });

    it('should return granted status for storage on web', async () => {
      const result = await requestStoragePermission();
      expect(result.status).toBe(PermissionStatus.GRANTED);
    });
  });
});
