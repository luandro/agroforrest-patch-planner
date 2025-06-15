import { create } from 'zustand';
import { PlantPlacement, PlantSpecies } from '../types/species.types';

interface PlantPlacementState {
  placements: PlantPlacement[];
  selectedPlacementIds: string[];
  isPlacing: boolean;
  selectedSpecies: PlantSpecies | null;
  placementPreview: { x: number; y: number } | null;
  history: PlantPlacement[][];
  historyIndex: number;
}

interface PlantPlacementActions {
  addPlacement: (placement: Omit<PlantPlacement, 'id'>) => void;
  removePlacements: (ids: string[]) => void;
  updatePlacement: (id: string, updates: Partial<PlantPlacement>) => void;
  selectPlacements: (ids: string[]) => void;
  clearSelection: () => void;
  setIsPlacing: (placing: boolean) => void;
  setSelectedSpecies: (species: PlantSpecies | null) => void;
  setPlacementPreview: (preview: { x: number; y: number } | null) => void;
  getPlacementsForBed: (bedId: string) => PlantPlacement[];
  clearPlacementsForBed: (bedId: string) => void;
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  addToHistory: () => void;
}

interface PlantPlacementStore extends PlantPlacementState, PlantPlacementActions {}

export const usePlantPlacementStore = create<PlantPlacementStore>((set, get) => ({
  // State
  placements: [],
  selectedPlacementIds: [],
  isPlacing: false,
  selectedSpecies: null,
  placementPreview: null,
  history: [[]],
  historyIndex: 0,

  // Actions
  addPlacement: (placement) => {
    const newPlacement: PlantPlacement = {
      ...placement,
      id: `plant-${Date.now()}-${Math.random()}`
    };
    
    set((state) => ({
      placements: [...state.placements, newPlacement]
    }));
    
    // Add to history
    get().addToHistory();
  },

  removePlacements: (ids) => {
    set((state) => ({
      placements: state.placements.filter(p => !ids.includes(p.id)),
      selectedPlacementIds: state.selectedPlacementIds.filter(id => !ids.includes(id))
    }));
    
    // Add to history
    get().addToHistory();
  },

  updatePlacement: (id, updates) => {
    set((state) => ({
      placements: state.placements.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    }));
    
    // Add to history
    get().addToHistory();
  },

  selectPlacements: (ids) => set({ selectedPlacementIds: ids }),
  clearSelection: () => set({ selectedPlacementIds: [] }),
  setIsPlacing: (placing) => set({ isPlacing: placing }),
  setSelectedSpecies: (species) => set({ selectedSpecies: species }),
  setPlacementPreview: (preview) => set({ placementPreview: preview }),

  getPlacementsForBed: (bedId) => {
    return get().placements.filter(p => p.bedId === bedId);
  },

  clearPlacementsForBed: (bedId) => {
    set((state) => ({
      placements: state.placements.filter(p => p.bedId !== bedId),
      selectedPlacementIds: state.selectedPlacementIds.filter(id => 
        !state.placements.find(p => p.id === id && p.bedId === bedId)
      )
    }));
    
    // Add to history
    get().addToHistory();
  },

  // History management
  addToHistory: () => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push([...state.placements]);
    
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
      const placementsAtIndex = [...state.history[newIndex]];
      
      set({ 
        placements: placementsAtIndex,
        historyIndex: newIndex,
        selectedPlacementIds: [] // Clear selection on undo
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const placementsAtIndex = [...state.history[newIndex]];
      
      set({ 
        placements: placementsAtIndex,
        historyIndex: newIndex,
        selectedPlacementIds: [] // Clear selection on redo
      });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1
}));
