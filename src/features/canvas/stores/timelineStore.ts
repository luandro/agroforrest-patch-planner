
import { create } from 'zustand';

interface TimelineState {
  isTimelineActive: boolean;
  currentMonth: number;
  isPlaying: boolean;
  playbackSpeed: number;
}

interface TimelineActions {
  setTimelineActive: (active: boolean) => void;
  setCurrentMonth: (month: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  resetTimeline: () => void;
}

interface TimelineStore extends TimelineState, TimelineActions {}

export const useTimelineStore = create<TimelineStore>((set) => ({
  // State
  isTimelineActive: false,
  currentMonth: 0,
  isPlaying: false,
  playbackSpeed: 1,

  // Actions
  setTimelineActive: (active) => set({ isTimelineActive: active }),
  setCurrentMonth: (month) => set({ currentMonth: month }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  resetTimeline: () => set({ 
    currentMonth: 0, 
    isPlaying: false,
    playbackSpeed: 1 
  })
}));
