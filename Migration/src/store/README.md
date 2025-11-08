# State Management

This directory contains Zustand stores for global state management.

## Organization

Stores are organized by domain:

- `trackStore.ts` - Track management (add, remove, update)
- `playbackStore.ts` - Playback state
- `uiStore.ts` - UI state (modals, loading states)

## Pattern

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TrackStore {
  tracks: Track[];
  addTrack: (track: Track) => void;
  removeTrack: (id: string) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
}

export const useTrackStore = create<TrackStore>()(
  persist(
    (set) => ({
      tracks: [],
      addTrack: (track) => set((state) => ({ tracks: [...state.tracks, track] })),
      removeTrack: (id) => set((state) => ({ tracks: state.tracks.filter((t) => t.id !== id) })),
      updateTrack: (id, updates) =>
        set((state) => ({
          tracks: state.tracks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
    }),
    { name: 'track-storage' }
  )
);
```

## Guidelines

- Keep stores focused on single domains
- Use middleware for persistence when needed
- Actions should be pure functions
- Selectors can be defined for derived state
