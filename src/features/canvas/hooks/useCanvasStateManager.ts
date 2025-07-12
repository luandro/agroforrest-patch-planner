
import { useCallback, useState } from 'react';
import { useCanvasStateOrchestrator } from './useCanvasStateOrchestrator';
import { useFocusModeIntegration } from './useFocusModeIntegration';
import { useBedCreationOrchestrator } from './useBedCreationOrchestrator';
import { PatchCanvasProps } from '../types/canvas.types';
import { PlantSpecies } from '../types/species.types';

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
  // Mobile plant species panel state
  const [isPlantSpeciesPanelOpen, setIsPlantSpeciesPanelOpen] = useState(false);

  // State for editing dimensions from confirmation panel
  const [isEditingDimensions, setIsEditingDimensions] = useState(false);

  // Core state orchestration
  const stateOrchestrator = useCanvasStateOrchestrator({
    initialViewport,
    onViewportChange,
    minZoom,
    maxZoom
  });

  // Focus mode integration with mobile species panel support
  const focusMode = useFocusModeIntegration({
    viewport: stateOrchestrator.viewport,
    updateViewport: stateOrchestrator.updateViewport,
    beds: stateOrchestrator.beds,
    canvasRef,
    onOpenPlantSelection,
    onOpenPlantSpeciesPanel: () => setIsPlantSpeciesPanelOpen(true)
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
    setIsEditingDimensions, // Pass it here
  });

  // Enhanced cancel creation that ensures tool reset
  const cancelCreation = useCallback(() => {
    bedCreation.cancelCreation();
    bedCreation.handleToolChange('pan');
    setIsEditingDimensions(false); // Reset editing state
  }, [bedCreation, setIsEditingDimensions]);

  // Mobile species panel handlers
  const handleClosePlantSpeciesPanel = useCallback(() => {
    setIsPlantSpeciesPanelOpen(false);
  }, []);

  const handleSelectPlantSpecies = useCallback((species: PlantSpecies) => {
    // This will be handled by the species panel component
    setIsPlantSpeciesPanelOpen(false);
  }, []);

  return {
    // State orchestrator
    ...stateOrchestrator,
    
    // Focus mode
    ...focusMode,
    
    // Bed creation (with enhanced cancel)
    ...bedCreation,
    cancelCreation,
    
    // Enhanced handlers
    handleToolChange: bedCreation.handleToolChange,

    // Mobile plant species panel
    isPlantSpeciesPanelOpen,
    handleClosePlantSpeciesPanel,
    handleSelectPlantSpecies,

    // Dimension editing state
    isEditingDimensions,
    setIsEditingDimensions
  };
};
