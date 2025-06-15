
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

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  // State
  isTimelineActive: false,
  currentMonth: 0,
  isPlaying: false,
  playbackSpeed: 1,

  // Actions with debugging
  setTimelineActive: (active) => {
    console.log('[Timeline Store] setTimelineActive:', active);
    set({ isTimelineActive: active });
  },
  
  setCurrentMonth: (month) => {
    const state = get();
    if (process.env.NODE_ENV === 'development') {
      console.log('[Timeline Store] setCurrentMonth:', state.currentMonth, '->', month);
    }
    set({ currentMonth: month });
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
    console.log('[Timeline Store] resetTimeline');
    set({ 
      currentMonth: 0, 
      isPlaying: false,
      playbackSpeed: 1 
    });
  }
}));
