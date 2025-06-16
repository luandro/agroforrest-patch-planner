
import { create } from 'zustand';
import { ViewMode, SideViewport } from '../types/sideView.types';

interface SideViewState {
  viewMode: ViewMode;
  viewport: SideViewport;
}

interface SideViewActions {
  setViewMode: (mode: ViewMode) => void;
  setSideViewport: (viewport: Partial<SideViewport>) => void;
  resetSideViewport: () => void;
}

interface SideViewStore extends SideViewState, SideViewActions {}

const DEFAULT_VIEWPORT: SideViewport = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  bounds: { width: 50, height: 30 }
};

export const useSideViewStore = create<SideViewStore>((set) => ({
  // State
  viewMode: 'top',
  viewport: DEFAULT_VIEWPORT,

  // Actions
  setViewMode: (mode) => {
    console.log('[Side View Store] setViewMode:', mode);
    set({ viewMode: mode });
  },

  setSideViewport: (viewport) => {
    set((state) => ({
      viewport: { ...state.viewport, ...viewport }
    }));
  },

  resetSideViewport: () => {
    set({ viewport: DEFAULT_VIEWPORT });
  }
}));
