
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  BulkPlacementConfig, 
  BulkPlacementPreview, 
  BulkPlacementRequest 
} from '../types/bulkPlacement.types';
import { PlantSpecies } from '../types/species.types';
import { Bed } from '../types/bed.types';

interface BulkPlacementState {
  isActive: boolean;
  selectedSpecies: PlantSpecies | null;
  selectedBed: Bed | null;
  config: BulkPlacementConfig | null;
  preview: BulkPlacementPreview | null;
  showPreview: boolean;
  isCalculating: boolean;
}

interface BulkPlacementActions {
  setActive: (active: boolean) => void;
  setSelectedSpecies: (species: PlantSpecies | null) => void;
  setSelectedBed: (bed: Bed | null) => void;
  setConfig: (config: BulkPlacementConfig) => void;
  updateConfig: (updates: Partial<BulkPlacementConfig>) => void;
  setPreview: (preview: BulkPlacementPreview | null) => void;
  setShowPreview: (show: boolean) => void;
  setIsCalculating: (calculating: boolean) => void;
  reset: () => void;
}

type BulkPlacementStore = BulkPlacementState & BulkPlacementActions;

export const useBulkPlacementStore = create<BulkPlacementStore>()(
  subscribeWithSelector((set, get) => ({
    // State
    isActive: false,
    selectedSpecies: null,
    selectedBed: null,
    config: null,
    preview: null,
    showPreview: false,
    isCalculating: false,

    // Actions
    setActive: (active) => {
      set({ isActive: active });
      if (!active) {
        get().reset();
      }
    },

    setSelectedSpecies: (species) => set({ selectedSpecies: species }),
    setSelectedBed: (bed) => set({ selectedBed: bed }),
    setConfig: (config) => set({ config }),
    
    updateConfig: (updates) => {
      const currentConfig = get().config;
      if (currentConfig) {
        set({ config: { ...currentConfig, ...updates } });
      }
    },

    setPreview: (preview) => set({ preview }),
    setShowPreview: (show) => set({ showPreview: show }),
    setIsCalculating: (calculating) => set({ isCalculating: calculating }),

    reset: () => set({
      selectedSpecies: null,
      selectedBed: null,
      config: null,
      preview: null,
      showPreview: false,
      isCalculating: false
    })
  }))
);
