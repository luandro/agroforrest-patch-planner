
import { Bed, CanvasTool } from '../types/bed.types';

export interface FocusMode {
  isActive: boolean;
  bedId: string | null;
  targetViewport: {
    zoom: number;
    centerX: number;
    centerY: number;
  } | null;
}

export interface BedState {
  beds: Bed[];
  selectedBedIds: string[];
  tool: CanvasTool;
  isDirty: boolean;
}

export interface BedActions {
  addBed: (bed: Bed) => void;
  updateBed: (id: string, updates: Partial<Bed>) => void;
  removeBeds: (ids: string[]) => void;
  selectBeds: (ids: string[]) => void;
  clearSelection: () => void;
  toggleBedSelection: (id: string) => void;
  setTool: (tool: CanvasTool) => void;
  loadBeds: (beds: Bed[]) => void;
  markClean: () => void;
}

export interface HistoryState {
  history: Bed[][];
  historyIndex: number;
}

export interface HistoryActions {
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  addToHistory: (beds: Bed[]) => void;
}

export interface FocusModeActions {
  enterFocusMode: (bedId: string) => void;
  exitFocusMode: () => void;
}
