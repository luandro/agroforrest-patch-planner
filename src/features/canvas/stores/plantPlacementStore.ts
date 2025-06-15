import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { PlantSpecies } from '../types/species.types';

export interface PlantPlacement {
  id: string;
  bedId: string;
  species: PlantSpecies;
  position: { x: number; y: number }; // Position within the bed (in meters)
  plantedAt: number;
  notes?: string;
}

interface PlantPlacementState {
  placements: PlantPlacement[];
  selectedPlacementIds: string[];
  isPlacing: boolean;
  selectedSpecies: PlantSpecies | null;
  placementPreview: { x: number; y: number } | null;
  isDirty: boolean;
}

interface PlantPlacementActions {
  addPlacement: (placement: Omit<PlantPlacement, 'id' | 'plantedAt'>) => void;
  removePlacements: (ids: string[]) => void;
  updatePlacement: (id: string, updates: Partial<PlantPlacement>) => void;
  getPlacementsForBed: (bedId: string) => PlantPlacement[];
  selectPlacements: (ids: string[]) => void;
  clearSelection: () => void;
  setSelectedSpecies: (species: PlantSpecies | null) => void;
  setIsPlacing: (isPlacing: boolean) => void;
  setPlacementPreview: (position: { x: number; y: number } | null) => void;
  clearPlacementsForBed: (bedId: string) => void;
  loadPlacements: (placements: PlantPlacement[]) => void;
  markClean: () => void;
}

type PlantPlacementStore = PlantPlacementState & PlantPlacementActions;

export const usePlantPlacementStore = create<PlantPlacementStore>()(
  subscribeWithSelector((set, get) => ({
    // State
    placements: [],
    selectedPlacementIds: [],
    isPlacing: false,
    selectedSpecies: null,
    placementPreview: null,
    isDirty: false,

    // Actions
    addPlacement: (placement) => {
      const newPlacement: PlantPlacement = {
        ...placement,
        id: `plant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        plantedAt: Date.now()
      };
      
      set(state => ({
        placements: [...state.placements, newPlacement],
        isDirty: true
      }));
    },

    removePlacements: (ids) => {
      set(state => ({
        placements: state.placements.filter(p => !ids.includes(p.id)),
        selectedPlacementIds: state.selectedPlacementIds.filter(id => !ids.includes(id)),
        isDirty: true
      }));
    },

    updatePlacement: (id, updates) => {
      set(state => ({
        placements: state.placements.map(p => 
          p.id === id ? { ...p, ...updates } : p
        ),
        isDirty: true
      }));
    },

    getPlacementsForBed: (bedId) => {
      return get().placements.filter(p => p.bedId === bedId);
    },

    selectPlacements: (ids) => {
      set({ selectedPlacementIds: ids });
    },

    clearSelection: () => {
      set({ selectedPlacementIds: [] });
    },

    setSelectedSpecies: (species) => {
      set({ 
        selectedSpecies: species,
        isPlacing: species !== null 
      });
    },

    setIsPlacing: (isPlacing) => {
      set({ isPlacing });
    },

    setPlacementPreview: (position) => {
      set({ placementPreview: position });
    },

    clearPlacementsForBed: (bedId) => {
      set(state => ({
        placements: state.placements.filter(p => p.bedId !== bedId),
        selectedPlacementIds: state.selectedPlacementIds.filter(id => {
          const placement = state.placements.find(p => p.id === id);
          return placement?.bedId !== bedId;
        }),
        isDirty: true
      }));
    },

    loadPlacements: (placements) => {
      set({ placements, isDirty: false });
    },

    markClean: () => {
      set({ isDirty: false });
    }
  }))
);
