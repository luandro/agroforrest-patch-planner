
import { useState, useEffect } from 'react';
import { CanvasViewport } from '@/features/canvas/types/canvas.types';
import { PlantSpecies } from '@/features/canvas/types/species.types';
import { useBedStore } from '@/features/canvas/stores/bedStore';
import { usePlantPlacementStore } from '@/features/canvas/stores/plantPlacementStore';
import { useTimelineStore } from '@/features/canvas/stores/timelineStore';
import { useOfflineStorage } from '@/features/canvas/hooks/useOfflineStorage';
import { useIsMobile } from '@/hooks/use-mobile';

export const usePatchCreatorState = () => {
  const [viewport, setViewport] = useState<CanvasViewport | null>(null);
  const [fps, setFps] = useState(0);
  const [isPlantSelectionOpen, setIsPlantSelectionOpen] = useState(false);
  const { beds, selectedBedIds, tool, setTool, loadBeds, focusMode, exitFocusMode } = useBedStore();
  const { setSelectedSpecies, setIsPlacing, placements } = usePlantPlacementStore();
  const { isTimelineActive, setTimelineActive } = useTimelineStore();
  const isMobile = useIsMobile();

  // Initialize unified offline storage
  const storage = useOfflineStorage();

  // Debug logging for initialization
  useEffect(() => {
    console.log('🔧 PatchCreatorState initialized - offline storage active');
    console.log('📦 Storage status:', {
      isInitialized: storage.isInitialized,
      isSaving: storage.isSaving,
      isDirty: storage.isDirty,
      errors: storage.saveErrors
    });
  }, [storage.isInitialized]);

  // Ensure pan tool is default on page load
  useEffect(() => {
    if (tool !== 'pan') {
      setTool('pan');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewportChange = (newViewport: CanvasViewport) => {
    setViewport(newViewport);
    console.log('Viewport changed:', newViewport);
  };

  const handleFitAll = () => {
    // This will be called by the canvas component
    if (viewport) {
      console.log('Fitting all beds to screen');
    }
  };

  const handleCreateNewPatch = () => {
    // Reset the canvas state
    loadBeds([]);
    setTool('pan');
    console.log('Creating new patch');
  };

  const handleOpenPlantSelection = () => {
    setIsPlantSelectionOpen(true);
  };

  const handleClosePlantSelection = () => {
    setIsPlantSelectionOpen(false);
  };

  const handleSelectSpecies = (species: PlantSpecies) => {
    console.log('Selected species for placement:', species);
    setSelectedSpecies(species);
    setIsPlacing(true); // Enable placement mode
    setIsPlantSelectionOpen(false); // Close the panel
    console.log('Plant placement mode activated for species:', species.commonName);
  };

  const handleExitFocus = () => {
    exitFocusMode();
    console.log('Exited focus mode from header button');
  };

  const handleManualSave = () => {
    console.log('🔧 Manual save triggered from UI');
    storage.saveAll();
  };

  // FPS counter for development
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;
    
    const updateFps = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrameId = requestAnimationFrame(updateFps);
    };
    
    animationFrameId = requestAnimationFrame(updateFps);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return {
    viewport,
    fps,
    isPlantSelectionOpen,
    beds,
    selectedBedIds,
    tool,
    focusMode,
    placements,
    isTimelineActive,
    isMobile,
    handleViewportChange,
    handleFitAll,
    handleCreateNewPatch,
    handleOpenPlantSelection,
    handleClosePlantSelection,
    handleSelectSpecies,
    handleExitFocus,
    setTimelineActive,
    handleManualSave,
    // Expose storage status for debugging
    isStorageInitialized: storage.isInitialized,
    isSaving: storage.isSaving,
    isDirty: storage.isDirty,
    saveErrors: storage.saveErrors
  };
};
