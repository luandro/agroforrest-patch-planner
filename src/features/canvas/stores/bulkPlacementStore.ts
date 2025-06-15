
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  BulkPlacementConfig, 
  BulkPlacementPreview, 
} from '../types/bulkPlacement.types';
import { PlantSpecies } from '../types/species.types';
import { Bed } from '../types/bed.types';
import { useBedStore } from './bedStore';
import { usePlantPlacementStore } from './plantPlacementStore';
import { calculateBulkPlacement, getDefaultBulkConfig } from '../utils/bulkPlacementCalculator';

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
  initializeBulkPlacement: (species: PlantSpecies) => void;
  updateConfig: (updates: Partial<BulkPlacementConfig>) => void;
  executeBulkPlacement: () => boolean;
  cancelBulkPlacement: () => void;
  setShowPreview: (show: boolean) => void;
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
    initializeBulkPlacement: (species) => {
      const { beds, focusMode } = useBedStore.getState();
      const focusedBed = focusMode.isActive && focusMode.bedId
        ? beds.find(b => b.id === focusMode.bedId) || null
        : null;

      if (!focusedBed) {
        console.warn('No focused bed for bulk placement');
        return;
      }
      
      const defaultConfig = getDefaultBulkConfig(species);

      set({
        isActive: true,
        selectedSpecies: species,
        selectedBed: focusedBed,
        config: defaultConfig,
        preview: null,
        showPreview: false,
        isCalculating: false,
      });

      // Since we can't await in the store initializer, we'll let a useEffect handle the first calculation
    },
    
    updateConfig: (updates) => {
      const currentConfig = get().config;
      if (currentConfig) {
        set({ config: { ...currentConfig, ...updates } });
      }
    },

    executeBulkPlacement: () => {
      const { selectedSpecies, selectedBed, preview } = get();
      if (!selectedSpecies || !selectedBed || !preview || preview.positions.length === 0) {
        console.warn('Cannot execute bulk placement: missing data');
        return false;
      }

      const { addPlacement } = usePlantPlacementStore.getState();
      preview.positions.forEach(position => {
        addPlacement({
          bedId: selectedBed.id,
          species: selectedSpecies,
          position: { x: position.x, y: position.y }
        });
      });

      get().reset();
      set({ isActive: false });
      return true;
    },

    cancelBulkPlacement: () => {
      get().reset();
      set({ isActive: false });
    },

    setShowPreview: (show) => set({ showPreview: show }),

    reset: () => set({
      isActive: false, // Ensure isActive is false on reset
      selectedSpecies: null,
      selectedBed: null,
      config: null,
      preview: null,
      showPreview: false,
      isCalculating: false
    })
  }))
);
