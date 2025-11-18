
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Patch, PatchCreationData } from '../types/patch.types';
import { storeLogger } from '@/lib/logger';
import { saveToLocalStorageFallback } from '../storage';

interface PatchState {
  patches: Patch[];
  currentPatchId: string | null;
  isDirty: boolean;
  isLoading: boolean;
}

interface PatchActions {
  createPatch: (data: PatchCreationData) => Promise<string>;
  loadPatches: (patches: Patch[], markDirty?: boolean) => void;
  setCurrentPatch: (patchId: string) => void;
  updatePatch: (id: string, updates: Partial<Patch>) => void;
  deletePatch: (id: string) => void;
  duplicatePatch: (sourceId: string, newName: string) => Promise<string>;
  getCurrentPatch: () => Patch | null;
  markClean: () => void;
  markDirty: () => void;
  setLoading: (loading: boolean) => void;
  manualSave: () => void;
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

      storeLogger.info(`Patch created and marked dirty: ${newPatch.id}`);
      return newPatch.id;
    },

    loadPatches: (patches, markDirty = false) => {
      set({ patches, isDirty: markDirty });
      storeLogger.info(`Patches loaded, isDirty: ${markDirty}, count: ${patches.length}`);
    },

    setCurrentPatch: (patchId) => {
      set({ currentPatchId: patchId });
      // Store current patch in localStorage with consistent JSON encoding
      saveToLocalStorageFallback('currentPatchId', patchId);
      storeLogger.info(`Current patch set: ${patchId}`);
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
      storeLogger.info(`Patch updated and marked dirty: ${id}`);
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
      storeLogger.info(`Patch deleted and marked dirty: ${id}`);
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

      storeLogger.info(`Patch duplicated and marked dirty: ${duplicatedPatch.id}`);
      return duplicatedPatch.id;
    },

    getCurrentPatch: () => {
      const state = get();
      return state.patches.find(p => p.id === state.currentPatchId) || null;
    },

    markClean: () => {
      set({ isDirty: false });
      storeLogger.debug('Patch store marked clean');
    },

    markDirty: () => {
      set({ isDirty: true });
      storeLogger.debug('Patch store marked dirty');
    },

    setLoading: (loading) => set({ isLoading: loading }),

    manualSave: () => {
      const state = get();
      if (state.isDirty) {
        storeLogger.info('Manual save triggered for patches');
        // The auto-save hook will handle the actual saving
        set({ isDirty: true }); // Force trigger auto-save
      }
    }
  }))
);
