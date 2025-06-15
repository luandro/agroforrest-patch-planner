
import { create } from 'zustand';

interface TimelineState {
  isTimelineActive: boolean;
  currentMonth: number;
  setTimelineActive: (active: boolean) => void;
  setCurrentMonth: (month: number) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  isTimelineActive: false,
  currentMonth: 0,
  setTimelineActive: (active) => set({ isTimelineActive: active }),
  setCurrentMonth: (month) => set({ currentMonth: month })
}));
