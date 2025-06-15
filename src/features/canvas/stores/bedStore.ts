import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Bed, CanvasTool, BedConfig } from '../types/bed.types';

interface BedStore {
  // Existing state
  beds: Bed[];
  selectedBedIds: string[];
  tool: CanvasTool;
  
  // New focus mode state
  focusMode: {
    isActive: boolean;
    bedId: string | null;
    targetViewport: {
      zoom: number;
      centerX: number;
      centerY: number;
    } | null;
  };
  
  // Existing actions
  addBed: (bed: Bed) => void;
  updateBed: (id: string, updates: Partial<Bed>) => void;
  removeBeds: (ids: string[]) => void;
  selectBeds: (ids: string[]) => void;
  clearSelection: () => void;
  toggleBedSelection: (id: string) => void;
  setTool: (tool: CanvasTool) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  loadBeds: (beds: Bed[]) => void;
  
  // New focus mode actions
  enterFocusMode: (bedId: string) => void;
  exitFocusMode: () => void;
  
  // Internal state
  history: Bed[][];
  historyIndex: number;
}

export const useBedStore = create<BedStore>()(
  subscribeWithSelector((set, get) => ({
    beds: [],
    selectedBedIds: [],
    tool: 'pan',
    history: [[]],
    historyIndex: 0,
    
    // Initialize focus mode state
    focusMode: {
      isActive: false,
      bedId: null,
      targetViewport: null
    },

    addBed: (bed) => {
      const state = get();
      const newBeds = [...state.beds, bed];
      set({ beds: newBeds });
      get().addToHistory(newBeds);
    },

    updateBed: (id, updates) => {
      const state = get();
      const newBeds = state.beds.map(bed => 
        bed.id === id ? { ...bed, ...updates } : bed
      );
      set({ beds: newBeds });
      get().addToHistory(newBeds);
    },

    removeBeds: (ids) => {
      const state = get();
      const newBeds = state.beds.filter(bed => !ids.includes(bed.id));
      const newSelectedIds = state.selectedBedIds.filter(id => !ids.includes(id));
      set({ 
        beds: newBeds, 
        selectedBedIds: newSelectedIds,
        focusMode: state.focusMode.bedId && ids.includes(state.focusMode.bedId) 
          ? { isActive: false, bedId: null, targetViewport: null }
          : state.focusMode
      });
      get().addToHistory(newBeds);
    },

    selectBeds: (ids) => set({ selectedBedIds: ids }),
    clearSelection: () => set({ selectedBedIds: [] }),
    
    toggleBedSelection: (id) => {
      const state = get();
      const isSelected = state.selectedBedIds.includes(id);
      const newSelectedIds = isSelected 
        ? state.selectedBedIds.filter(bedId => bedId !== id)
        : [...state.selectedBedIds, id];
      set({ selectedBedIds: newSelectedIds });
    },

    setTool: (tool) => set({ tool }),
    loadBeds: (beds) => set({ beds, history: [beds], historyIndex: 0 }),

    // New focus mode actions
    enterFocusMode: (bedId) => {
      const state = get();
      const bed = state.beds.find(b => b.id === bedId);
      if (!bed) return;

      // Calculate target viewport to show bed filling 80% of view
      const padding = 0.2; // 20% total padding (10% each side)
      let bedWidth, bedHeight;
      
      if (bed.shape === 'rectangle') {
        bedWidth = bed.dimensions.length || 1;
        bedHeight = bed.dimensions.width || 1;
      } else {
        const radius = bed.dimensions.radius || 0.5;
        bedWidth = bedHeight = radius * 2;
      }
      
      // Add some extra padding for the fine grid visibility
      const targetWidth = bedWidth / (1 - padding);
      const targetHeight = bedHeight / (1 - padding);
      
      // Calculate zoom to fit bed in viewport (assuming 20m base viewport)
      const zoomX = 20 / targetWidth;
      const zoomY = 20 / targetHeight;
      const targetZoom = Math.min(zoomX, zoomY) * 0.9; // 90% to ensure some padding
      
      set({
        focusMode: {
          isActive: true,
          bedId,
          targetViewport: {
            zoom: Math.max(2, Math.min(8, targetZoom)), // Clamp between 2x and 8x
            centerX: bed.position.x,
            centerY: bed.position.y
          }
        },
        selectedBedIds: [bedId],
        tool: 'select'
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
    },

    // History management
    addToHistory: (beds: Bed[]) => {
      const state = get();
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...beds]);
      
      // Keep only last 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
      } else {
        set({ historyIndex: state.historyIndex + 1 });
      }
      
      set({ history: newHistory });
    },

    undo: () => {
      const state = get();
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        set({ 
          beds: [...state.history[newIndex]], 
          historyIndex: newIndex 
        });
      }
    },

    redo: () => {
      const state = get();
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        set({ 
          beds: [...state.history[newIndex]], 
          historyIndex: newIndex 
        });
      }
    },

    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1
  }))
);
