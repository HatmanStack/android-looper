# Phase 4: Recording & Import (Platform-Specific)

## Phase Goal

Implement audio recording and file import functionality with platform-specific implementations for web and native. Handle permissions, file storage, and audio format conversion. By the end of this phase, users can record audio or import existing audio files on all platforms.

**Success Criteria:**
- Record audio on web (MediaRecorder API)
- Record audio on native (expo-av)
- Import audio files from device/file system
- Handle permissions correctly on all platforms
- Store audio files with consistent format (MP3)
- Convert audio formats as needed

**Estimated tokens:** ~105,000

---

## Prerequisites

- Phase 3 completed (audio abstractions ready)
- Understanding of Phase 0 ADR-007 (File Format Standards)

---

## Tasks

### Task 1: Implement Web Audio Recording (MediaRecorder API)

**Goal:** Create web-specific audio recorder using MediaRecorder API.

**Files to Create:**
- `src/services/audio/WebAudioRecorder.ts` - Web recorder implementation
- `src/utils/audioConversion.web.ts` - Web audio conversion utilities

**Implementation Steps:**

1. Extend BaseAudioRecorder for web
2. Implement getUserMedia for microphone access
3. Use MediaRecorder with audio/webm or audio/mp4
4. Store recorded chunks in array
5. On stop, create Blob and convert to MP3 if needed
6. Return blob URL or base64 data URI
7. Handle permissions (navigator.permissions)
8. Add error handling for unsupported browsers

Reference Android recorder:
- `../app/src/main/java/gemenie/looper/MainActivity.java:150-159`
- Use similar quality settings (adapt for web)

**Verification Checklist:**
- [ ] Recording works in Chrome, Firefox, Safari
- [ ] Microphone permission requested
- [ ] Recorded audio is playable
- [ ] Output format is consistent
- [ ] Errors handled gracefully

**Commit Message Template:**
```
feat(audio): implement web audio recording with MediaRecorder

- Create WebAudioRecorder extending BaseAudioRecorder
- Use MediaRecorder API for audio capture
- Handle microphone permissions
- Convert output to MP3 if needed
- Add cross-browser compatibility
```

**Estimated tokens:** ~15,000

---

### Task 2: Implement Native Audio Recording (expo-av)

**Goal:** Create native audio recorder using expo-av.

**Files to Create:**
- `src/services/audio/NativeAudioRecorder.ts` - Native recorder
- `src/services/audio/NativeAudioRecorder.native.ts` - Platform-specific implementation

**Implementation Steps:**

1. Extend BaseAudioRecorder for native
2. Use expo-av Audio.Recording
3. Configure recording options:
   - `android.extension`: '.mp3'
   - `android.outputFormat`: MPEG_4
   - `android.audioEncoder`: AAC
   - `ios.extension`: '.mp3'
   - `ios.outputFormat`: MPEG4AAC
   - `sampleRate`: 44100
   - `numberOfChannels`: 2
   - `bitRate`: 128000
4. Request permissions with expo-av
5. Store files using expo-file-system
6. Return file URI

Reference Android:
- Similar to `MainActivity.java:150-159` but using expo-av equivalents

**Verification Checklist:**
- [ ] Recording works on iOS
- [ ] Recording works on Android
- [ ] Permissions requested correctly
- [ ] File saved to correct location
- [ ] Audio quality matches requirements

**Commit Message Template:**
```
feat(audio): implement native audio recording with expo-av

- Create NativeAudioRecorder using expo-av
- Configure recording for MP3 output
- Handle Android and iOS permissions
- Store files with expo-file-system
- Match Android app recording quality
```

**Estimated tokens:** ~15,000

---

### Task 3: Implement File Import for Web

**Goal:** Allow users to import audio files from their computer on web.

**Files to Create:**
- `src/services/audio/WebFileImporter.ts` - Web file import
- `src/components/AudioFilePicker/AudioFilePicker.web.tsx` - File picker component

**Implementation Steps:**

1. Create file input element (HTML input type="file")
2. Accept audio/* MIME types
3. On file select, read file as blob or base64
4. Validate file type (MP3, WAV, AAC, etc.)
5. Convert to MP3 if necessary (using @ffmpeg/ffmpeg, or accept as-is for now)
6. Return blob URL
7. Store file metadata (name, size, duration)
8. Update UI with selected file

**Verification Checklist:**
- [ ] File picker opens on button click
- [ ] Only audio files selectable
- [ ] Selected file is readable
- [ ] File URI returned correctly
- [ ] Works in all browsers

**Commit Message Template:**
```
feat(audio): implement audio file import for web

- Create web file picker for audio files
- Accept multiple audio formats
- Validate file types
- Return file blob URL
- Add file metadata extraction
```

**Estimated tokens:** ~12,000

---

### Task 4: Implement File Import for Native

**Goal:** Allow users to import audio from device storage on iOS/Android.

**Files to Create:**
- `src/services/audio/NativeFileImporter.ts` - Native file import
- `src/components/AudioFilePicker/AudioFilePicker.native.tsx` - Native picker

**Implementation Steps:**

1. Use expo-document-picker
2. Configure for audio MIME types
3. Request storage permissions
4. On file select, copy to app directory
5. Use expo-file-system for file operations
6. Extract metadata with expo-av
7. Return file URI
8. Handle permission denials

Reference Android:
- `../app/src/main/java/gemenie/looper/MainActivity.java:307-316`
- Similar flow with expo equivalents

**Verification Checklist:**
- [ ] Document picker opens
- [ ] Can browse device storage
- [ ] Audio files are selectable
- [ ] File copied to app directory
- [ ] Metadata extracted correctly
- [ ] Permissions handled

**Commit Message Template:**
```
feat(audio): implement audio file import for native

- Use expo-document-picker for file selection
- Request storage permissions
- Copy files to app directory with expo-file-system
- Extract audio metadata
- Match Android import functionality
```

**Estimated tokens:** ~13,000

---

### Task 5: Implement Permission Handling

**Goal:** Request and manage permissions for microphone and storage across platforms.

**Files to Create:**
- `src/utils/permissions.ts` - Permission utility
- `src/utils/permissions.web.ts` - Web permissions
- `src/utils/permissions.native.ts` - Native permissions

**Implementation Steps:**

1. Create permission request functions:
   - `requestMicrophonePermission()`
   - `requestStoragePermission()` (native only)
   - `checkPermission(type)`

2. Web implementation:
   - Use navigator.permissions API
   - Fallback to navigator.mediaDevices.getUserMedia
   - Handle permission denied state

3. Native implementation:
   - Use expo-av for microphone
   - Use expo-media-library for storage
   - Show system permission dialogs
   - Handle different iOS/Android behaviors

4. Add permission status tracking:
   - granted, denied, pending
   - Re-request if needed
   - Show explanatory UI before requesting

5. Handle edge cases:
   - Permissions revoked mid-session
   - Permission denied → show instructions
   - iOS-specific settings redirect

Reference Android:
- `../app/src/main/java/gemenie/looper/MainActivity.java:108-127`

**Verification Checklist:**
- [ ] Permissions requested at right time
- [ ] User can grant or deny
- [ ] App handles denial gracefully
- [ ] Permission state persisted
- [ ] Platform differences handled

**Commit Message Template:**
```
feat(permissions): implement cross-platform permission handling

- Create permission utilities for web and native
- Request microphone permissions for recording
- Request storage permissions for import (native)
- Handle permission denial and re-request
- Show user guidance for permissions
```

**Estimated tokens:** ~14,000

---

### Task 6: Implement Audio File Management

**Goal:** Create utilities for storing, retrieving, and deleting audio files.

**Files to Create:**
- `src/services/storage/AudioFileManager.ts` - File manager interface
- `src/services/storage/AudioFileManager.web.ts` - Web storage
- `src/services/storage/AudioFileManager.native.ts` - Native storage

**Implementation Steps:**

1. Define file storage locations:
   - Web: IndexedDB or localStorage for metadata, blob URLs
   - Native: expo-file-system (documentDirectory)

2. Implement file operations:
   - `saveFile(blob, name)` → returns URI
   - `getFile(uri)` → returns file handle
   - `deleteFile(uri)` → removes file
   - `listFiles()` → returns all saved files
   - `getFileInfo(uri)` → returns size, type, etc.

3. Handle temporary vs permanent storage:
   - Recordings initially temp
   - Move to permanent on save
   - Clean up temp files on app close

4. Add file naming:
   - Generate unique names (timestamp + random)
   - Sanitize user-provided names
   - Avoid collisions

5. Implement storage quota management:
   - Check available space
   - Warn if low storage
   - Clean old temp files

Reference Android:
- `../app/src/main/java/gemenie/looper/MainActivity.java:186-191` (file naming)
- `../app/src/main/java/gemenie/looper/MainActivity.java:250-280` (file operations)

**Verification Checklist:**
- [ ] Files saved correctly on all platforms
- [ ] URIs are consistent and retrievable
- [ ] Files can be deleted
- [ ] Storage quota checked
- [ ] Temp files cleaned up

**Commit Message Template:**
```
feat(storage): implement audio file management

- Create AudioFileManager for web and native
- Implement save, retrieve, delete operations
- Handle temporary vs permanent storage
- Add file naming with collision prevention
- Manage storage quota
```

**Estimated tokens:** ~16,000

---

### Task 7: Add Audio Format Conversion (Preparation for Phase 6)

**Goal:** Set up basic audio format conversion utilities (full implementation in Phase 6).

**Files to Create:**
- `src/utils/audioConversion.ts` - Conversion interface
- `src/utils/audioUtils.ts` - Audio utility functions

**Implementation Steps:**

1. Create conversion utility stubs:
   - `convertToMP3(input, output)` - stub for now
   - `getAudioMetadata(uri)` - extract duration, format, etc.
   - `validateAudioFile(uri)` - check if playable

2. Implement metadata extraction:
   - Web: Use Audio element to get duration
   - Native: Use expo-av getStatusAsync()
   - Extract format, sample rate, channels if possible

3. Add audio validation:
   - Check file exists and is readable
   - Verify file is audio (MIME type or extension)
   - Test if playable before adding to list

4. Document conversion requirements for Phase 6:
   - Note which formats need FFmpeg conversion
   - List supported input formats
   - Define quality settings

**Verification Checklist:**
- [ ] Metadata extraction works
- [ ] Validation detects invalid files
- [ ] Utilities are platform-agnostic
- [ ] Conversion stubs are in place

**Commit Message Template:**
```
feat(audio): add audio utility functions and conversion stubs

- Create audio metadata extraction utilities
- Implement audio file validation
- Add conversion function stubs for Phase 6
- Extract duration and format information
```

**Estimated tokens:** ~10,000

---

### Task 8: Integrate Recording and Import with UI

**Goal:** Connect Phase 2 UI to real recording and import functionality.

**Files to Modify:**
- `src/screens/MainScreen/MainScreen.tsx`
- `src/services/audio/AudioService.ts`

**Implementation Steps:**

1. Replace mock recorder with platform-specific implementation
2. Wire Record button to start recording
3. Wire Stop button to stop and create track
4. Add recording indicator UI (red dot, timer)
5. Wire Import button to file picker
6. Handle file selection and track creation
7. Show progress/loading during operations
8. Handle errors (permissions, invalid files)
9. Update track list with new tracks

**Verification Checklist:**
- [ ] Record button starts recording
- [ ] Stop button creates track with audio
- [ ] Import button opens file picker
- [ ] Selected files added to track list
- [ ] Errors shown to user
- [ ] Loading states displayed

**Commit Message Template:**
```
feat(integration): connect recording and import to UI

- Replace mock recorder with real implementations
- Wire Record/Stop buttons to audio recording
- Connect Import button to file picker
- Add recording indicator and progress UI
- Handle errors and show user feedback
- Create tracks from recordings and imports
```

**Estimated tokens:** ~12,000

---

### Task 9: Add Unit and Integration Tests

**Goal:** Test recording and import functionality thoroughly.

**Files to Create:**
- `__tests__/unit/services/WebAudioRecorder.test.ts`
- `__tests__/unit/services/NativeAudioRecorder.test.ts`
- `__tests__/unit/services/AudioFileManager.test.ts`
- `__tests__/integration/recording.test.ts`

**Implementation Steps:**

1. Mock platform APIs:
   - MediaRecorder for web
   - expo-av for native
   - File system APIs

2. Test WebAudioRecorder:
   - Start/stop recording
   - Permission handling
   - Blob creation
   - Error cases

3. Test NativeAudioRecorder:
   - Recording lifecycle
   - Permission requests
   - File storage
   - Platform-specific behavior

4. Test AudioFileManager:
   - Save and retrieve files
   - Delete files
   - Storage quota
   - File naming

5. Integration tests:
   - Full recording flow (start → stop → track created)
   - Import flow (select file → track created)
   - Permission denial handling

**Verification Checklist:**
- [ ] All unit tests pass
- [ ] Integration tests cover main flows
- [ ] Mocks are realistic
- [ ] Coverage >80%
- [ ] Platform-specific tests isolated

**Commit Message Template:**
```
test(audio): add tests for recording and import

- Test WebAudioRecorder and NativeAudioRecorder
- Add AudioFileManager tests
- Create integration tests for full flows
- Mock platform APIs appropriately
- Achieve 80%+ coverage
```

**Estimated tokens:** ~10,000

---

### Task 10: Documentation and Phase Completion

**Goal:** Document recording and import features.

**Files to Create:**
- `docs/features/recording.md` - Recording documentation
- `docs/features/import.md` - Import documentation

**Implementation Steps:**

1. Document recording feature:
   - How to record audio
   - Supported formats and quality
   - Permission requirements
   - Platform differences
   - Troubleshooting

2. Document import feature:
   - How to import audio files
   - Supported file formats
   - File size limits
   - Platform-specific behaviors

3. Add developer guide:
   - How to extend recording options
   - How to add new import sources
   - Platform-specific implementation details

4. Create user guide snippets:
   - Step-by-step recording
   - Step-by-step importing
   - Common issues and solutions

**Verification Checklist:**
- [ ] Documentation is comprehensive
- [ ] Examples are accurate
- [ ] Platform differences noted
- [ ] Troubleshooting guide included

**Commit Message Template:**
```
docs(audio): document recording and import features

- Create recording feature documentation
- Document import functionality
- Add platform-specific notes
- Include troubleshooting guide
```

**Estimated tokens:** ~6,000

---

## Phase Verification

### How to Verify Phase 4 is Complete

1. **Recording Works:**
   - Test on web browser (allow mic permission)
   - Test on iOS device/simulator
   - Test on Android device/emulator
   - Verify audio is recorded and playable

2. **Import Works:**
   - Select audio file from computer (web)
   - Import from device storage (native)
   - Verify imported audio is playable

3. **Permissions:**
   - Microphone permission requested
   - Storage permission requested (native)
   - Denials handled gracefully

4. **File Management:**
   - Files saved correctly
   - Files retrievable by URI
   - Deletion works

5. **Tests Pass:**
   - `npm test` passes all tests
   - Coverage meets threshold

### Integration Points for Phase 5

Phase 4 provides audio sources (recordings, imports) that Phase 5 will play back with speed/volume control.

### Known Limitations

- No playback yet (Phase 5)
- No mixing yet (Phase 6)
- Format conversion limited (full FFmpeg in Phase 6)

---

## Next Phase

Proceed to **[Phase 5: Playback & Controls (Platform-Specific)](./Phase-5.md)** to implement audio playback with speed and volume control.
