/**
 * FFmpegService for Web Platform
 *
 * Handles FFmpeg operations using @ffmpeg/ffmpeg (WebAssembly) for web browsers.
 * Provides audio mixing, conversion, and processing capabilities.
 */

import { createFFmpeg, FFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { AudioError, AudioErrorCode } from '../audio/AudioError';

export interface MixingProgress {
  ratio: number; // 0-1
  time: number; // Current time in ms
  duration: number; // Total duration in ms
}

export interface MixTrack {
  uri: string;
  speed: number; // 0.05 - 2.50
  volume: number; // 0 - 100
}

export interface MixOptions {
  tracks: MixTrack[];
  onProgress?: (progress: MixingProgress) => void;
}

/**
 * Web FFmpeg Service using WebAssembly
 */
export class FFmpegService {
  private ffmpeg: FFmpeg | null = null;
  private isLoaded: boolean = false;
  private isLoading: boolean = false;

  /**
   * Initialize FFmpeg instance with logging
   */
  constructor() {
    this.log('FFmpegService created for web platform');
  }

  /**
   * Load FFmpeg WebAssembly module
   * This is lazy-loaded to avoid loading large WASM files unless needed
   */
  public async load(onProgress?: (ratio: number) => void): Promise<void> {
    if (this.isLoaded) {
      this.log('FFmpeg already loaded');
      return;
    }

    if (this.isLoading) {
      this.log('FFmpeg is already loading');
      throw new AudioError(
        AudioErrorCode.MIXING_FAILED,
        'FFmpeg is already loading',
        'Please wait for FFmpeg to finish loading'
      );
    }

    try {
      this.isLoading = true;
      this.log('Loading FFmpeg WebAssembly module...');

      this.ffmpeg = createFFmpeg({
        log: true,
        progress: ({ ratio }) => {
          this.log(`FFmpeg load progress: ${(ratio * 100).toFixed(1)}%`);
          onProgress?.(ratio);
        },
      });

      await this.ffmpeg.load();

      this.isLoaded = true;
      this.isLoading = false;
      this.log('FFmpeg loaded successfully');
    } catch (error) {
      this.isLoading = false;
      this.error('Failed to load FFmpeg', error as Error);

      throw new AudioError(
        AudioErrorCode.MIXING_FAILED,
        `Failed to load FFmpeg: ${(error as Error).message}`,
        'FFmpeg could not be initialized. Your browser may not support WebAssembly.',
        { originalError: error }
      );
    }
  }

  /**
   * Check if FFmpeg is loaded and ready
   */
  public isReady(): boolean {
    return this.isLoaded && this.ffmpeg !== null;
  }

  /**
   * Mix multiple audio tracks into a single output file
   * Applies speed and volume adjustments to each track
   */
  public async mix(options: MixOptions): Promise<Blob> {
    await this.ensureLoaded();

    const { tracks, onProgress } = options;

    if (!tracks || tracks.length === 0) {
      throw new AudioError(
        AudioErrorCode.MIXING_FAILED,
        'No tracks provided for mixing',
        'Please select at least one track to mix'
      );
    }

    if (!this.ffmpeg) {
      throw new AudioError(
        AudioErrorCode.MIXING_FAILED,
        'FFmpeg not initialized',
        'FFmpeg is not ready'
      );
    }

    this.log(`Mixing ${tracks.length} tracks...`);

    try {
      // Load audio files into FFmpeg virtual file system
      const inputFiles: string[] = [];
      for (let i = 0; i < tracks.length; i++) {
        const inputName = `input${i}.mp3`;
        this.log(`Loading ${inputName} from ${tracks[i].uri}`);

        const fileData = await fetchFile(tracks[i].uri);
        this.ffmpeg.FS('writeFile', inputName, fileData);
        inputFiles.push(inputName);
      }

      // Build FFmpeg command
      const command = this.buildMixCommand(tracks, inputFiles, 'output.mp3');
      this.log(`Executing FFmpeg command: ${command.join(' ')}`);

      // Set progress callback if provided
      if (onProgress) {
        this.ffmpeg.setProgress(({ ratio, time }) => {
          onProgress({
            ratio,
            time: time * 1000, // Convert to ms
            duration: 0, // We don't have total duration easily accessible
          });
        });
      }

      // Execute FFmpeg command
      await this.ffmpeg.run(...command);

      // Read output file
      const data = this.ffmpeg.FS('readFile', 'output.mp3');
      const blob = new Blob([data.buffer], { type: 'audio/mpeg' });

      // Clean up virtual file system
      for (const file of inputFiles) {
        this.ffmpeg.FS('unlink', file);
      }
      this.ffmpeg.FS('unlink', 'output.mp3');

      this.log(`Mixing complete, output size: ${blob.size} bytes`);
      return blob;
    } catch (error) {
      this.error('Mixing failed', error as Error);

      throw new AudioError(
        AudioErrorCode.MIXING_FAILED,
        `Failed to mix audio: ${(error as Error).message}`,
        'Audio mixing encountered an error',
        { tracks: tracks.length, originalError: error }
      );
    }
  }

  /**
   * Build FFmpeg command for mixing tracks with speed and volume
   */
  private buildMixCommand(
    tracks: MixTrack[],
    inputFiles: string[],
    outputFile: string
  ): string[] {
    const command: string[] = [];

    // Add input files
    for (const file of inputFiles) {
      command.push('-i', file);
    }

    // Build filter complex for speed and volume adjustments
    const filters: string[] = [];
    const mixInputs: string[] = [];

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      const inputLabel = `${i}:a`;
      let filterChain = `[${inputLabel}]`;

      // Apply speed adjustment using atempo filter
      // atempo only supports 0.5-2.0 range, so we need to chain filters for extreme values
      const atempoFilters = this.buildAtempoFilter(track.speed);
      if (atempoFilters.length > 0) {
        filterChain += atempoFilters.join(',');
        filterChain += ',';
      }

      // Apply volume adjustment
      // Convert 0-100 range to volume multiplier
      const volumeMultiplier = this.calculateVolumeMultiplier(track.volume);
      filterChain += `volume=${volumeMultiplier}`;

      // Output label for this processed stream
      const outputLabel = `a${i}`;
      filterChain += `[${outputLabel}]`;

      filters.push(filterChain);
      mixInputs.push(`[${outputLabel}]`);
    }

    // Add amix filter to combine all processed streams
    const amixFilter = `${mixInputs.join('')}amix=inputs=${tracks.length}:duration=longest:normalize=0[out]`;
    filters.push(amixFilter);

    // Join all filters into filter_complex
    command.push('-filter_complex', filters.join(';'));

    // Map output
    command.push('-map', '[out]');

    // Output encoding settings
    command.push(
      '-codec:a',
      'libmp3lame',
      '-b:a',
      '128k',
      '-ar',
      '44100',
      '-y', // Overwrite output file
      outputFile
    );

    return command;
  }

  /**
   * Build atempo filter chain for speed adjustment
   * atempo only supports 0.5-2.0, so we chain multiple filters for extreme values
   */
  private buildAtempoFilter(speed: number): string[] {
    const filters: string[] = [];

    if (speed === 1.0) {
      return filters; // No speed change needed
    }

    let remainingSpeed = speed;

    // Apply atempo filters in chain to reach desired speed
    while (Math.abs(remainingSpeed - 1.0) > 0.01) {
      if (remainingSpeed > 2.0) {
        filters.push('atempo=2.0');
        remainingSpeed /= 2.0;
      } else if (remainingSpeed < 0.5) {
        filters.push('atempo=0.5');
        remainingSpeed /= 0.5;
      } else {
        filters.push(`atempo=${remainingSpeed.toFixed(2)}`);
        break;
      }
    }

    return filters;
  }

  /**
   * Calculate volume multiplier from 0-100 range
   * Uses logarithmic scaling matching Android implementation
   */
  private calculateVolumeMultiplier(volume: number): number {
    if (volume === 0) return 0;
    if (volume === 100) return 1.0;

    // Logarithmic scaling: 1 - (log(100 - volume) / log(100))
    const scaledVolume = 1 - Math.log(100 - volume) / Math.log(100);
    return Math.max(0, Math.min(1, scaledVolume));
  }

  /**
   * Ensure FFmpeg is loaded before operations
   */
  private async ensureLoaded(): Promise<void> {
    if (!this.isLoaded) {
      await this.load();
    }
  }

  /**
   * Log message with tag
   */
  private log(message: string, ...args: unknown[]): void {
    if (__DEV__) {
      console.log('[FFmpegService.web]', message, ...args);
    }
  }

  /**
   * Log error with tag
   */
  private error(message: string, error: Error): void {
    console.error('[FFmpegService.web]', message, error);
  }
}

// Export singleton instance
let ffmpegServiceInstance: FFmpegService | null = null;

export function getFFmpegService(): FFmpegService {
  if (!ffmpegServiceInstance) {
    ffmpegServiceInstance = new FFmpegService();
  }
  return ffmpegServiceInstance;
}
