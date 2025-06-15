
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Patch, PatchCreationData } from '../types/patch.types';

interface PatchState {
  patches: Patch[];
  currentPatchId: string | null;
  isDirty: boolean;
  isLoading: boolean;
}

interface PatchActions {
  createPatch: (data: PatchCreationData) => Promise<string>;
  loadPatches: (patches: Patch[]) => void;
  setCurrentPatch: (patchId: string) => void;
  updatePatch: (id: string, updates: Partial<Patch>) => void;
  deletePatch: (id: string) => void;
  duplicatePatch: (sourceId: string, newName: string) => Promise<string>;
  getCurrentPatch: () => Patch | null;
  markClean: () => void;
  setLoading: (loading: boolean) => void;
}

interface PatchStore extends PatchState, PatchActions {}

export const usePatchStore = create<PatchStore>()(
  subscribeWithSelector((set, get) => ({
    // State
    patches: [],
    currentPatchId: null,
    isDirty: false,
    isLoading: false,

    // Actions
    createPatch: async (data) => {
      const newPatch: Patch = {
        id: `patch-${Date.now()}-${Math.random()}`,
        name: data.name,
        description: data.description,
        size: data.size,
        location: data.location,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastViewport: {
          zoom: 1,
          centerX: 0,
          centerY: 0
        }
      };

      set(state => ({
        patches: [...state.patches, newPatch],
        currentPatchId: newPatch.id,
        isDirty: true
      }));

      return newPatch.id;
    },

    loadPatches: (patches) => {
      set({ patches, isDirty: false });
    },

    setCurrentPatch: (patchId) => {
      set({ currentPatchId: patchId });
      // Store current patch in localStorage
      localStorage.setItem('currentPatchId', patchId);
    },

    updatePatch: (id, updates) => {
      set(state => ({
        patches: state.patches.map(patch =>
          patch.id === id 
            ? { ...patch, ...updates, updatedAt: Date.now() }
            : patch
        ),
        isDirty: true
      }));
    },

    deletePatch: (id) => {
      set(state => {
        const newPatches = state.patches.filter(p => p.id !== id);
        const newCurrentId = state.currentPatchId === id 
          ? (newPatches.length > 0 ? newPatches[0].id : null)
          : state.currentPatchId;
        
        return {
          patches: newPatches,
          currentPatchId: newCurrentId,
          isDirty: true
        };
      });
    },

    duplicatePatch: async (sourceId, newName) => {
      const sourcePatch = get().patches.find(p => p.id === sourceId);
      if (!sourcePatch) throw new Error('Source patch not found');

      const duplicatedPatch: Patch = {
        ...sourcePatch,
        id: `patch-${Date.now()}-${Math.random()}`,
        name: newName,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      set(state => ({
        patches: [...state.patches, duplicatedPatch],
        isDirty: true
      }));

      return duplicatedPatch.id;
    },

    getCurrentPatch: () => {
      const state = get();
      return state.patches.find(p => p.id === state.currentPatchId) || null;
    },

    markClean: () => set({ isDirty: false }),
    setLoading: (loading) => set({ isLoading: loading })
  }))
);
