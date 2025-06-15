
import { create } from 'zustand';
import { FocusMode, FocusModeActions } from './types';

interface FocusModeStore extends FocusModeActions {
  focusMode: FocusMode;
}

export const useFocusModeStore = create<FocusModeStore>((set, get) => ({
  focusMode: {
    isActive: false,
    bedId: null,
    targetViewport: null
  },

  enterFocusMode: (bedId) => {
    set({
      focusMode: {
        isActive: true,
        bedId,
        targetViewport: null // Remove target viewport - we'll handle this directly
      }
    });
  },

  exitFocusMode: () => {
    set({
      focusMode: {
        isActive: false,
        bedId: null,
        targetViewport: null
      }
    });
  }
}));
