
import { create } from 'zustand';

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

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  // State - Initialize timeline at month 0 for seedling start
  isTimelineActive: false,
  currentMonth: 0,
  isPlaying: false,
  playbackSpeed: 1,

  // Actions with debugging and forced re-renders
  setTimelineActive: (active) => {
    console.log('[Timeline Store] setTimelineActive:', active);
    if (active) {
      // Always start at month 0 when activating timeline
      set({ isTimelineActive: active, currentMonth: 0 });
    } else {
      set({ isTimelineActive: active });
    }
  },
  
  setCurrentMonth: (month) => {
    const state = get();
    const newMonth = typeof month === 'function' ? month(state.currentMonth) : month;
    
    // Ensure minimum is 0 and maximum constraints
    const clampedMonth = Math.max(0, Math.min(newMonth, 240)); // 20 years max
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Timeline Store] setCurrentMonth:', state.currentMonth, '->', clampedMonth);
    }
    
    // Force state update even for small changes
    set({ currentMonth: clampedMonth });
  },
  
  setIsPlaying: (playing) => {
    console.log('[Timeline Store] setIsPlaying:', playing);
    set({ isPlaying: playing });
  },
  
  setPlaybackSpeed: (speed) => {
    console.log('[Timeline Store] setPlaybackSpeed:', speed);
    set({ playbackSpeed: speed });
  },
  
  resetTimeline: () => {
    console.log('[Timeline Store] resetTimeline - forcing month 0');
    set({ 
      currentMonth: 0, 
      isPlaying: false,
      playbackSpeed: 1 
    });
  }
}));
