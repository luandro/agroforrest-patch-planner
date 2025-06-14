
import { useCallback } from 'react';
import { useBedStore } from '../stores/bedStore';
import { 
  createBedConfigUpdater, 
  createPreviewManager, 
  createPlacementManager 
} from '../utils/bedCreationHelpers';

interface UseBedCreationHandlersProps {
  tool: string;
  updateBedConfig: (updates: any) => void;
  updatePreviewWithConfig: (updates: any) => void;
  startPreview: (screenX: number, screenY: number, tool: string) => void;
  updatePreview: (screenX: number, screenY: number) => void;
  placeBed: (previewBed: any) => void;
  confirmPlacement: () => boolean;
  cancelPlacement: (cursorPosition: any) => any;
  clearPreview: () => void;
  clearPlacement: () => void;
  previewBed: any;
  cursorPosition: any;
}

export const useBedCreationHandlers = ({
  tool,
  updateBedConfig: updateBedConfigBase,
  updatePreviewWithConfig,
  startPreview: startPreviewBase,
  updatePreview: updatePreviewBase,
  placeBed: placeBedBase,
  confirmPlacement: confirmPlacementBase,
  cancelPlacement: cancelPlacementBase,
  clearPreview,
  clearPlacement,
  previewBed,
  cursorPosition
}: UseBedCreationHandlersProps) => {
  const { setTool } = useBedStore();

  // Enhanced bed config update handler that also updates preview
  const updateBedConfig = useCallback(
    createBedConfigUpdater(updateBedConfigBase, updatePreviewWithConfig),
    [updateBedConfigBase, updatePreviewWithConfig]
  );

  // Enhanced preview management with tool awareness
  const { startPreview, updatePreview } = createPreviewManager(
    startPreviewBase,
    updatePreviewBase,
    tool
  );

  // Enhanced placement management with creation mode handling
  const {
    placeBed,
    confirmPlacement,
    cancelPlacement,
    cancelCreation
  } = createPlacementManager(
    placeBedBase,
    confirmPlacementBase,
    cancelPlacementBase,
    clearPreview,
    clearPlacement,
    previewBed,
    cursorPosition
  );

  // Tool change handler that clears states
  const handleToolChange = useCallback((newTool: any) => {
    if (newTool !== tool) {
      clearPreview();
      clearPlacement();
    }
    setTool(newTool);
  }, [tool, clearPreview, clearPlacement, setTool]);

  // Enhanced cancel creation that clears all states
  const cancelCreationEnhanced = useCallback(() => {
    clearPreview();
    clearPlacement();
    setTool('pan'); // Always return to pan mode
  }, [clearPreview, clearPlacement, setTool]);

  return {
    updateBedConfig,
    startPreview,
    updatePreview,
    placeBed,
    confirmPlacement,
    cancelPlacement,
    cancelCreation: cancelCreationEnhanced,
    handleToolChange
  };
};
