
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Patch } from '../types/patch.types';

interface PatchState {
  patches: Patch[];
  activePatchId: string | null;
  isDirty: boolean;
  isLoaded: boolean;
}

interface PatchActions {
  setPatches: (patches: Patch[]) => void;
  setActivePatchId: (patchId: string | null) => void;
  addPatch: (newPatch: Omit<Patch, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePatch: (patchId: string, updates: Partial<Patch>) => void;
  removePatch: (patchId: string) => void;
  markClean: () => void;
  setLoaded: () => void;
  getPatchById: (patchId: string) => Patch | undefined;
}

type PatchStore = PatchState & PatchActions;

export const usePatchStore = create<PatchStore>()(
  subscribeWithSelector((set, get) => ({
    // State
    patches: [],
    activePatchId: null,
    isDirty: false,
    isLoaded: false,

    // Actions
    setPatches: (patches) => {
      set({ patches, isLoaded: true });
    },
    setActivePatchId: (patchId) => {
      set({ activePatchId: patchId, isDirty: true });
    },
    addPatch: (newPatch) => {
      const id = `patch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const patchToAdd: Patch = {
        ...newPatch,
        id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      set(state => ({
        patches: [...state.patches, patchToAdd],
        isDirty: true,
      }));
      return id;
    },
    updatePatch: (patchId, updates) => {
      set(state => ({
        patches: state.patches.map(p =>
          p.id === patchId ? { ...p, ...updates, updatedAt: Date.now() } : p
        ),
        isDirty: true,
      }));
    },
    removePatch: (patchId) => {
      set(state => ({
        patches: state.patches.filter(p => p.id !== patchId),
        isDirty: true,
      }));
    },
    markClean: () => {
      set({ isDirty: false });
    },
    setLoaded: () => {
      set({ isLoaded: true });
    },
    getPatchById: (patchId) => {
      return get().patches.find(p => p.id === patchId);
    },
  }))
);
