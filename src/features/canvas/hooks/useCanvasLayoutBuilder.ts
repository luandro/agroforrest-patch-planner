
import { useCanvasLayoutProps } from './useCanvasLayoutProps';

interface UseCanvasLayoutBuilderProps {
  viewport: any;
  updateViewport: any;
  beds: any[];
  selectedBedIds: string[];
  tool: any;
  handleToolChange: any;
  bedConfig: any;
  updateBedConfig: any;
  isCreating: boolean;
  previewBed: any;
  previewBeds?: any[];
  placementBed: any;
  placementBeds?: any[];
  showConfirmation: boolean;
  multiCreationMode: boolean;
  setMultiCreationMode: (enabled: boolean) => void;
  hasCollision?: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  confirmPlacement: () => void;
  cancelPlacement: () => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoomTo: (zoom: number) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  deleteSelected: () => void;
  isSaving: boolean;
  cancelCreation: () => void;
  fitAllBeds: () => void;
  gridSize: number;
  minZoom: number;
  maxZoom: number;
  handlePlantSelectionOpen?: () => void;
  handlePlantSpeciesSelect?: (species: any) => void;
  isInFocusMode?: boolean;
  focusedBedId?: string | null;
  focusedBed?: any;
  handleEnterFocus?: (bedId: string) => void;
  handleExitFocus?: () => void;
}

export const useCanvasLayoutBuilder = (props: UseCanvasLayoutBuilderProps) => {
  return useCanvasLayoutProps(props);
};
