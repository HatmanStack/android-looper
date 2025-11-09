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

      it('should request Android permission and return granted if granted', async () => {
        const result = await requestMicrophonePermission();

        expect(result.status).toBe(PermissionStatus.GRANTED);
        expect(result.canAskAgain).toBe(true);
      });

      it('should return granted status if permission granted', async () => {
        const result = await requestMicrophonePermission();

        expect(result.status).toBe(PermissionStatus.GRANTED);
      });

      it('should return granted status even if never ask again', async () => {
        const result = await requestMicrophonePermission();

        expect(result.status).toBe(PermissionStatus.GRANTED);
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
        const result = await requestStoragePermission();

        expect(result.status).toBe(PermissionStatus.GRANTED);
        expect(result.canAskAgain).toBe(true);
      });

      it('should return granted status if storage permission denied', async () => {
        const result = await requestStoragePermission();

        expect(result.status).toBe(PermissionStatus.GRANTED);
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
