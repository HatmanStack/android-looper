/**
 * Audio Services Initialization
 *
 * Platform-agnostic initialization that registers the correct services for each platform.
 */

import { Platform } from 'react-native';

/**
 * Initialize audio services for the current platform
 */
export function initializeAudioServices(): void {
  if (Platform.OS === 'web') {
    // Dynamically import web services
    import('./web').then((module) => {
      module.initializeWebAudioServices();
    });
  } else {
    // Dynamically import native services
    import('./native').then((module) => {
      module.initializeNativeAudioServices();
    });
  }
}
