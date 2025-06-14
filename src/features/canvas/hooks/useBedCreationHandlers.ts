
import { useCallback } from 'react';
import { useBedStore } from '../stores/bedStore';

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
  const updateBedConfig = useCallback((updates: any) => {
    updateBedConfigBase(updates);
    updatePreviewWithConfig(updates);
  }, [updateBedConfigBase, updatePreviewWithConfig]);

  // Enhanced preview start with tool validation
  const startPreview = useCallback((screenX: number, screenY: number) => {
    console.log('Starting preview with tool:', tool, 'at position:', screenX, screenY);
    startPreviewBase(screenX, screenY, tool);
  }, [startPreviewBase, tool]);

  // Enhanced preview update
  const updatePreview = useCallback((screenX: number, screenY: number) => {
    console.log('Updating preview at position:', screenX, screenY);
    updatePreviewBase(screenX, screenY);
  }, [updatePreviewBase]);

  // Enhanced bed placement
  const placeBed = useCallback(() => {
    console.log('Placing bed:', previewBed);
    if (previewBed) {
      placeBedBase(previewBed);
    }
  }, [placeBedBase, previewBed]);

  // Enhanced placement confirmation
  const confirmPlacement = useCallback(() => {
    console.log('Confirming placement');
    return confirmPlacementBase();
  }, [confirmPlacementBase]);

  // Enhanced placement cancellation
  const cancelPlacement = useCallback(() => {
    console.log('Canceling placement');
    return cancelPlacementBase();
  }, [cancelPlacementBase]);

  // Enhanced cancel creation that clears all states
  const cancelCreation = useCallback(() => {
    console.log('Canceling creation');
    clearPreview();
    clearPlacement();
    setTool('pan'); // Always return to pan mode
  }, [clearPreview, clearPlacement, setTool]);

  // Tool change handler that clears states
  const handleToolChange = useCallback((newTool: any) => {
    console.log('Tool change from', tool, 'to', newTool);
    if (newTool !== tool) {
      clearPreview();
      clearPlacement();
    }
    setTool(newTool);
  }, [tool, clearPreview, clearPlacement, setTool]);

  return {
    updateBedConfig,
    startPreview,
    updatePreview,
    placeBed,
    confirmPlacement,
    cancelPlacement,
    cancelCreation,
    handleToolChange
  };
};
