
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
    console.log('Updating bed config:', updates);
    updateBedConfigBase(updates);
    updatePreviewWithConfig(updates);
  }, [updateBedConfigBase, updatePreviewWithConfig]);

  // Enhanced preview start with tool validation
  const startPreview = useCallback((screenX: number, screenY: number) => {
    console.log('Starting preview with tool:', tool, 'at position:', screenX, screenY);
    
    // Ensure we have a valid creation tool
    const validTool = (tool === 'create-rectangle' || tool === 'create-circle') ? tool : 'create-rectangle';
    
    if (validTool !== tool) {
      console.log('Switching to valid creation tool:', validTool);
      setTool(validTool);
    }
    
    startPreviewBase(screenX, screenY, validTool);
  }, [startPreviewBase, tool, setTool]);

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
    const shouldExitCreation = confirmPlacementBase();
    
    // If should exit creation mode, switch to pan
    if (shouldExitCreation) {
      console.log('Exiting creation mode, switching to pan');
      setTool('pan');
    }
    
    return shouldExitCreation;
  }, [confirmPlacementBase, setTool]);

  // Enhanced placement cancellation
  const cancelPlacement = useCallback(() => {
    console.log('Canceling placement');
    const result = cancelPlacementBase(cursorPosition);
    
    // Return to pan mode after cancellation
    setTool('pan');
    
    return result;
  }, [cancelPlacementBase, cursorPosition, setTool]);

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
    
    // Clear states when changing away from creation tools
    if ((tool === 'create-rectangle' || tool === 'create-circle') && 
        (newTool !== 'create-rectangle' && newTool !== 'create-circle')) {
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
