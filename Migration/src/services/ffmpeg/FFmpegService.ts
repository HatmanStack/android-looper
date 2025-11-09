/**
 * Platform-agnostic FFmpeg Service
 *
 * Automatically loads the correct platform implementation
 */

// Re-export types
export * from './types';

// Platform-specific service will be resolved by Metro bundler
// based on .web.ts or .native.ts extensions
