
import { useCallback } from 'react';
import { useCanvasStateOrchestrator } from './useCanvasStateOrchestrator';
import { useFocusModeIntegration } from './useFocusModeIntegration';
import { useBedCreationOrchestrator } from './useBedCreationOrchestrator';
import { PatchCanvasProps } from '../types/canvas.types';

interface UseCanvasStateManagerProps {
  initialViewport: PatchCanvasProps['initialViewport'];
  onViewportChange: PatchCanvasProps['onViewportChange'];
  onOpenPlantSelection?: () => void;
  gridSize?: number;
  minZoom?: number;
  maxZoom?: number;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const useCanvasStateManager = ({
  initialViewport,
  onViewportChange,
  onOpenPlantSelection,
  gridSize = 1,
  minZoom = 0.5,
  maxZoom = 5,
  canvasRef
}: UseCanvasStateManagerProps) => {
  // Core state orchestration
  const stateOrchestrator = useCanvasStateOrchestrator({
    initialViewport,
    onViewportChange,
    minZoom,
    maxZoom
  });

  // Focus mode integration
  const focusMode = useFocusModeIntegration({
    viewport: stateOrchestrator.viewport,
    updateViewport: stateOrchestrator.updateViewport,
    beds: stateOrchestrator.beds,
    canvasRef,
    onOpenPlantSelection
  });

  // Bed creation management
  const bedCreation = useBedCreationOrchestrator({
    viewport: stateOrchestrator.viewport,
    gridSize,
    onBedCreated: (bedId) => {
      setTimeout(() => {
        // centerOnBed is a placeholder in useCanvasViewport and doesn't have access to beds.
      }, 100);
    },
  });

  // Enhanced cancel creation that ensures tool reset
  const cancelCreation = useCallback(() => {
    bedCreation.cancelCreation();
    bedCreation.handleToolChange('pan');
  }, [bedCreation]);

  return {
    // State orchestrator
    ...stateOrchestrator,
    
    // Focus mode
    ...focusMode,
    
    // Bed creation (with enhanced cancel)
    ...bedCreation,
    cancelCreation,
    
    // Enhanced handlers
    handleToolChange: bedCreation.handleToolChange
  };
};
