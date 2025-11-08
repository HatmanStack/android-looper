# Phase 7: State Management & Persistence

## Phase Goal

Implement comprehensive state management using Zustand and add data persistence so tracks, settings, and app state survive app restarts. Handle app lifecycle events and ensure data integrity across sessions.

**Success Criteria:**
- Zustand stores implemented for tracks, playback, UI state
- State persists to storage (AsyncStorage/localStorage)
- State restored on app launch
- App lifecycle handled (pause, resume, background)
- Data integrity maintained

**Estimated tokens:** ~95,000

---

## Prerequisites

- Phases 1-6 completed (all features functional)
- Understanding of Phase 0 ADR-005 (Zustand for state management)

---

## Tasks

### Task 1: Create Track Store

**Goal:** Implement Zustand store for managing track data.

**Files to Create:**
- `src/store/useTrackStore.ts` - Track state management

**Implementation Steps:**

1. Define track store interface:
   ```typescript
   interface TrackStore {
     tracks: Track[];
     addTrack: (track: Track) => void;
     removeTrack: (id: string) => void;
     updateTrack: (id: string, updates: Partial<Track>) => void;
     getTrack: (id: string) => Track | undefined;
     clearTracks: () => void;
   }
   ```

2. Implement store with Zustand:
   - Use `create` to define store
   - Implement immutable state updates
   - Add selectors for common queries

3. Add derived state:
   - Track count
   - Has playable tracks
   - Filtered tracks

4. Connect to UI:
   - Replace local state in components
   - Use store hooks in TrackList, MainScreen

**Verification Checklist:**
- [ ] Store created successfully
- [ ] CRUD operations work
- [ ] State updates trigger re-renders
- [ ] No state mutations

**Commit Message Template:**
```
feat(state): create track store with Zustand

- Define TrackStore interface and types
- Implement track CRUD operations
- Add derived state selectors
- Connect store to UI components
```

**Estimated tokens:** ~12,000

---

### Task 2: Create Playback Store

**Goal:** Manage playback state separately from track data.

**Files to Create:**
- `src/store/usePlaybackStore.ts` - Playback state

**Implementation Steps:**

1. Define playback store:
   ```typescript
   interface PlaybackStore {
     playingTracks: Set<string>;
     trackSettings: Map<string, { speed: number; volume: number }>;
     togglePlayback: (id: string) => void;
     setSpeed: (id: string, speed: number) => void;
     setVolume: (id: string, volume: number) => void;
     pauseAll: () => void;
   }
   ```

2. Implement state management
3. Sync with AudioService
4. Connect to TrackListItem controls

**Verification Checklist:**
- [ ] Playback state tracked per track
- [ ] Settings persisted per track
- [ ] UI reflects playback state
- [ ] Audio service synced

**Commit Message Template:**
```
feat(state): create playback store for audio state

- Implement PlaybackStore with Zustand
- Track playing state and settings per track
- Sync with AudioService
- Connect to playback controls UI
```

**Estimated tokens:** ~10,000

---

### Task 3: Create UI State Store

**Goal:** Manage UI-specific state (modals, dialogs, loading).

**Files to Create:**
- `src/store/useUIStore.ts` - UI state management

**Implementation Steps:**

1. Define UI store:
   ```typescript
   interface UIStore {
     saveModalVisible: boolean;
     mixingModalVisible: boolean;
     selectedTrackId: string | null;
     isRecording: boolean;
     isMixing: boolean;
     mixingProgress: number;
     errorMessage: string | null;
   }
   ```

2. Add actions for each state
3. Connect to modals and dialogs
4. Handle loading states

**Verification Checklist:**
- [ ] UI state centralized
- [ ] Modals controlled by store
- [ ] Loading states managed
- [ ] Error state handled

**Commit Message Template:**
```
feat(state): create UI state store

- Implement UIStore for modal/dialog state
- Manage loading and error states
- Control recording and mixing UI state
- Connect to UI components
```

**Estimated tokens:** ~8,000

---

### Task 4: Implement State Persistence

**Goal:** Persist state to storage using Zustand middleware.

**Files to Modify:**
- `src/store/useTrackStore.ts`
- `src/store/usePlaybackStore.ts`
- `src/store/useUIStore.ts`

**Implementation Steps:**

1. Install AsyncStorage:
   - `@react-native-async-storage/async-storage`

2. Add persist middleware to stores:
   ```typescript
   import { persist } from 'zustand/middleware';

   const useTrackStore = create(
     persist(
       (set) => ({ /* store */ }),
       {
         name: 'looper-tracks',
         storage: createJSONStorage(() => AsyncStorage),
       }
     )
   );
   ```

3. Configure what to persist:
   - Tracks: persist
   - Playback settings: persist
   - UI state: mostly don't persist (except preferences)

4. Handle hydration:
   - Wait for persistence to load
   - Show loading screen during hydration
   - Handle migration from old data

5. Handle serialization:
   - Sets/Maps need custom serialization
   - File URIs may need validation
   - Clean invalid data on load

Reference Android:
- `../app/src/main/java/gemenie/looper/MainActivity.java:360-378` (save instance state)

**Verification Checklist:**
- [ ] State persists across app restarts
- [ ] Tracks restored correctly
- [ ] Playback settings restored
- [ ] Invalid data handled
- [ ] Hydration doesn't block UI

**Commit Message Template:**
```
feat(state): add persistence with Zustand middleware

- Install AsyncStorage for storage
- Add persist middleware to stores
- Configure serialization for complex types
- Handle hydration and data migration
- Validate and clean persisted data
```

**Estimated tokens:** ~15,000

---

### Task 5: Handle App Lifecycle Events

**Goal:** Properly handle app pause, resume, and background states.

**Files to Create:**
- `src/hooks/useAppLifecycle.ts` - Lifecycle hook
- `src/services/lifecycle/LifecycleManager.ts` - Lifecycle manager

**Implementation Steps:**

1. Use React Native AppState:
   - Listen to state changes (active, background, inactive)
   - Pause playback when backgrounded
   - Resume when foregrounded

2. Handle audio focus (native):
   - Pause when phone call comes
   - Pause when other apps play audio
   - Resume when audio focus regained

3. Save state on background:
   - Ensure tracks saved before background
   - Clean up temp files
   - Release audio resources

4. Handle app termination:
   - Save state before quit
   - Clean up properly

5. Web-specific handling:
   - visibilitychange event
   - beforeunload event
   - Pause audio when tab hidden

Reference Android:
- `../app/src/main/java/gemenie/looper/MainActivity.java:381-389` (onDestroy)

**Verification Checklist:**
- [ ] Playback pauses when backgrounded
- [ ] State saved on background
- [ ] Audio resources released
- [ ] Works on all platforms

**Commit Message Template:**
```
feat(lifecycle): handle app lifecycle events

- Create useAppLifecycle hook for state monitoring
- Pause playback when app backgrounded
- Save state before termination
- Handle audio focus on native
- Support web visibility changes
```

**Estimated tokens:** ~13,000

---

### Task 6: Implement Data Migration and Versioning

**Goal:** Handle data schema changes across app versions.

**Files to Create:**
- `src/store/migrations/` - Migration utilities
- `src/store/migrations/trackMigrations.ts` - Track data migrations

**Implementation Steps:**

1. Add version to persisted state:
   ```typescript
   {
     version: 1,
     state: { /* actual state */ }
   }
   ```

2. Create migration functions:
   - v1 → v2: add new field
   - v2 → v3: rename field
   - etc.

3. Run migrations on hydration:
   - Check current version
   - Apply needed migrations sequentially
   - Update version after migration

4. Handle failed migrations:
   - Log error
   - Optionally reset to defaults
   - Don't lose user data if possible

5. Add schema validation:
   - Validate structure on load
   - Fix common issues automatically
   - Warn on validation failures

**Verification Checklist:**
- [ ] Migrations run on version mismatch
- [ ] Data preserved after migration
- [ ] Failed migrations handled
- [ ] Schema validation works

**Commit Message Template:**
```
feat(state): implement data migration and versioning

- Add version field to persisted state
- Create migration system for schema changes
- Handle migration failures gracefully
- Validate data schema on load
```

**Estimated tokens:** ~12,000

---

### Task 7: Optimize Performance and Memory

**Goal:** Ensure state management doesn't cause performance issues.

**Files to Modify:**
- All store files

**Implementation Steps:**

1. Use Zustand selectors:
   - Select only needed state slices
   - Prevent unnecessary re-renders
   - Use shallow equality checks

2. Memoize expensive computations:
   - Derived state calculations
   - Filters and sorts
   - Complex transformations

3. Limit storage size:
   - Don't persist large files (just URIs)
   - Limit track history
   - Clean old data periodically

4. Debounce frequent updates:
   - Slider changes
   - Progress updates
   - Batched updates

5. Profile performance:
   - Check re-render counts
   - Monitor memory usage
   - Identify bottlenecks

**Verification Checklist:**
- [ ] No unnecessary re-renders
- [ ] Memory usage acceptable
- [ ] UI remains responsive
- [ ] Large state handled efficiently

**Commit Message Template:**
```
perf(state): optimize state management performance

- Use Zustand selectors to minimize re-renders
- Memoize expensive computations
- Limit persisted data size
- Debounce frequent state updates
```

**Estimated tokens:** ~10,000

---

### Task 8: Add State DevTools and Debugging

**Goal:** Add tools for debugging state management.

**Files to Create:**
- `src/store/devtools.ts` - DevTools integration

**Implementation Steps:**

1. Add Zustand DevTools:
   - Integrate Redux DevTools extension
   - View state changes in browser
   - Time-travel debugging

2. Add logging middleware:
   - Log state changes in development
   - Track action history
   - Measure performance

3. Add state inspector:
   - Show current state in UI (dev only)
   - Export state for debugging
   - Import state for testing

4. Add state reset:
   - Clear all state (dev only)
   - Reset to defaults
   - Useful for testing

**Verification Checklist:**
- [ ] DevTools work in development
- [ ] State changes visible
- [ ] Logging helps debugging
- [ ] Only enabled in dev mode

**Commit Message Template:**
```
dev(state): add state devtools and debugging

- Integrate Redux DevTools for state inspection
- Add logging middleware for development
- Create state inspector UI
- Add state reset functionality
```

**Estimated tokens:** ~8,000

---

### Task 9: Add Tests for State Management

**Goal:** Comprehensively test stores and persistence.

**Files to Create:**
- `__tests__/unit/store/useTrackStore.test.ts`
- `__tests__/unit/store/usePlaybackStore.test.ts`
- `__tests__/unit/store/useUIStore.test.ts`
- `__tests__/integration/statePersistence.test.ts`

**Implementation Steps:**

1. Test track store:
   - CRUD operations
   - Derived state
   - State immutability

2. Test playback store:
   - Playback state management
   - Settings updates
   - Sync with audio service

3. Test UI store:
   - Modal state
   - Loading states
   - Error handling

4. Test persistence:
   - Save and load state
   - Hydration
   - Migrations
   - Schema validation

5. Integration tests:
   - Full state lifecycle
   - Cross-store interactions
   - App lifecycle scenarios

**Verification Checklist:**
- [ ] All unit tests pass
- [ ] Integration tests cover main flows
- [ ] Coverage >80%
- [ ] Persistence tested

**Commit Message Template:**
```
test(state): add comprehensive state management tests

- Test all Zustand stores
- Add persistence and hydration tests
- Test migration and versioning
- Add integration tests for state lifecycle
```

**Estimated tokens:** ~10,000

---

### Task 10: Documentation

**Goal:** Document state management architecture.

**Files to Create:**
- `docs/architecture/state-management.md`
- `docs/guides/state-persistence.md`

**Implementation Steps:**

1. Document state architecture
2. Explain each store's purpose
3. Document persistence strategy
4. Explain lifecycle handling
5. Add migration guide

**Verification Checklist:**
- [ ] Documentation complete
- [ ] Examples accurate
- [ ] Migration process documented

**Commit Message Template:**
```
docs(state): document state management architecture

- Create state management documentation
- Document persistence and hydration
- Explain lifecycle handling
- Add migration guide
```

**Estimated tokens:** ~7,000

---

## Phase Verification

1. **State Management:**
   - Stores control app state
   - UI synced with state
   - No prop drilling

2. **Persistence:**
   - State survives app restart
   - Data loaded correctly
   - Migrations work

3. **Lifecycle:**
   - App handles background/foreground
   - Audio paused appropriately
   - Resources released

4. **Tests:**
   - All tests pass
   - Coverage >80%

---

## Next Phase

Proceed to **[Phase 8: Testing & Quality Assurance](./Phase-8.md)**.
