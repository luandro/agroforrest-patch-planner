
import { create } from 'zustand';
import { storeLogger } from '@/lib/logger';

interface TimelineState {
  isTimelineActive: boolean;
  currentMonth: number;
  isPlaying: boolean;
  playbackSpeed: number;
}

interface TimelineActions {
  setTimelineActive: (active: boolean) => void;
  setCurrentMonth: (month: number | ((prev: number) => number)) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  resetTimeline: () => void;
}

interface TimelineStore extends TimelineState, TimelineActions {}

export const useTimelineStore = create<TimelineStore>((set, _get) => ({
  // State - Initialize timeline at month 0 for seedling start
  isTimelineActive: false,
  currentMonth: 0,
  isPlaying: false,
  playbackSpeed: 1,

  // Actions with improved state management
  setTimelineActive: (active) => {
    storeLogger.debug(`[Timeline] setTimelineActive: ${active}`);
    set((state) => {
      const newState = {
        isTimelineActive: active,
        // Reset to month 0 when activating timeline for consistent start
        ...(active && { currentMonth: 0, isPlaying: false })
      };
      storeLogger.debug('[Timeline] New state after setTimelineActive', { ...state, ...newState });
      return newState;
    });
  },

  setCurrentMonth: (month) => {
    set((state) => {
      const newMonth = typeof month === 'function' ? month(state.currentMonth) : month;
      const clampedMonth = Math.max(0, Math.min(newMonth, 240)); // 20 years max

      storeLogger.debug(`[Timeline] setCurrentMonth: ${state.currentMonth} -> ${clampedMonth}`);

      return { currentMonth: clampedMonth };
    });
  },

  setIsPlaying: (playing) => {
    storeLogger.debug(`[Timeline] setIsPlaying: ${playing}`);
    set({ isPlaying: playing });
  },

  setPlaybackSpeed: (speed) => {
    storeLogger.debug(`[Timeline] setPlaybackSpeed: ${speed}`);
    set({ playbackSpeed: speed });
  },

  resetTimeline: () => {
    storeLogger.debug('[Timeline] resetTimeline');
    set({
      currentMonth: 0,
      isPlaying: false,
      playbackSpeed: 1
    });
  }
}));
