
import { useCallback } from 'react';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { PlantSpecies } from '../types/species.types';

interface UsePlantPlacementProps {
  viewport: CanvasViewport;
  focusedBed: Bed | null;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const usePlantPlacement = ({ 
  viewport, 
  focusedBed, 
  canvasRef 
}: UsePlantPlacementProps) => {
  const {
    placements: _placements,
    selectedPlacementIds,
    isPlacing,
    selectedSpecies,
    placementPreview,
    addPlacement,
    removePlacements,
    selectPlacements,
    clearSelection,
    setSelectedSpecies,
    setIsPlacing,
    setPlacementPreview,
    getPlacementsForBed
  } = usePlantPlacementStore();

  // Convert canvas coordinates to bed-relative coordinates
  const canvasToBedCoordinates = useCallback((canvasX: number, canvasY: number): { x: number; y: number } | null => {
    if (!focusedBed || !canvasRef?.current) return null;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Convert to canvas coordinates
    const pixelsPerMeter = 50 * viewport.zoom;
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    
    // Calculate bed screen position
    const bedScreenX = (displayWidth / 2) + (focusedBed.position.x - viewport.centerX) * pixelsPerMeter;
    const bedScreenY = (displayHeight / 2) - (focusedBed.position.y - viewport.centerY) * pixelsPerMeter;
    
    // Convert click to bed-relative coordinates
    const relativeX = (canvasX - bedScreenX) / pixelsPerMeter;
    const relativeY = -(canvasY - bedScreenY) / pixelsPerMeter; // Invert Y
    
    return { x: relativeX, y: relativeY };
  }, [focusedBed, viewport, canvasRef]);

  // Check if a position is within the bed bounds
  const isWithinBedBounds = useCallback((bedRelativePos: { x: number; y: number }): boolean => {
    if (!focusedBed) return false;

    if (focusedBed.shape === 'rectangle') {
      const halfLength = (focusedBed.dimensions.length || 1) / 2;
      const halfWidth = (focusedBed.dimensions.width || 1) / 2;
      
      return Math.abs(bedRelativePos.x) <= halfLength && 
             Math.abs(bedRelativePos.y) <= halfWidth;
    } else {
      const radius = focusedBed.dimensions.radius || 0.5;
      const distance = Math.sqrt(bedRelativePos.x ** 2 + bedRelativePos.y ** 2);
      return distance <= radius;
    }
  }, [focusedBed]);

  // Snap position to 10cm grid
  const snapToGrid = useCallback((position: { x: number; y: number }): { x: number; y: number } => {
    const gridSize = 0.1; // 10cm
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize
    };
  }, []);

  // Handle mouse move for placement preview
  const handlePlacementPreview = useCallback((canvasX: number, canvasY: number) => {
    if (!isPlacing || !selectedSpecies || !focusedBed) return;

    const bedPos = canvasToBedCoordinates(canvasX, canvasY);
    if (!bedPos || !isWithinBedBounds(bedPos)) {
      setPlacementPreview(null);
      return;
    }

    const snappedPos = snapToGrid(bedPos);
    if (isWithinBedBounds(snappedPos)) {
      setPlacementPreview(snappedPos);
    } else {
      setPlacementPreview(null);
    }
  }, [isPlacing, selectedSpecies, focusedBed, canvasToBedCoordinates, isWithinBedBounds, snapToGrid, setPlacementPreview]);

  // Handle plant placement
  const handlePlantPlacement = useCallback((canvasX: number, canvasY: number) => {
    if (!isPlacing || !selectedSpecies || !focusedBed) return;

    const bedPos = canvasToBedCoordinates(canvasX, canvasY);
    if (!bedPos || !isWithinBedBounds(bedPos)) return;

    const snappedPos = snapToGrid(bedPos);
    if (!isWithinBedBounds(snappedPos)) return;

    // Check for existing plant at this position
    const existingPlants = getPlacementsForBed(focusedBed.id);
    const tolerance = 0.05; // 5cm tolerance
    const hasConflict = existingPlants.some(plant => 
      Math.abs(plant.position.x - snappedPos.x) < tolerance &&
      Math.abs(plant.position.y - snappedPos.y) < tolerance
    );

    if (hasConflict) return; // Don't place if there's already a plant here

    // Add the plant placement
    addPlacement({
      bedId: focusedBed.id,
      species: selectedSpecies,
      position: snappedPos
    });

    setPlacementPreview(null);
    
    // Continue placing mode - user can place another of the same species
    // To switch species, they can click another species card
  }, [isPlacing, selectedSpecies, focusedBed, canvasToBedCoordinates, isWithinBedBounds, snapToGrid, getPlacementsForBed, addPlacement, setPlacementPreview]);

  // Direct species selection - eliminates need for separate selection step
  const selectSpeciesForPlacement = useCallback((species: PlantSpecies) => {
    setSelectedSpecies(species);
    setIsPlacing(true); // Immediately enter placement mode
    clearSelection(); // Clear any selected placements
    setPlacementPreview(null); // Clear any existing preview
  }, [setSelectedSpecies, setIsPlacing, clearSelection, setPlacementPreview]);

  // Cancel placement mode - triggered by ESC key or clicking empty area
  const cancelPlacement = useCallback(() => {
    setSelectedSpecies(null);
    setIsPlacing(false);
    setPlacementPreview(null);
  }, [setSelectedSpecies, setIsPlacing, setPlacementPreview]);

  // Handle clicks on empty canvas areas to cancel placement
  const handleEmptyAreaClick = useCallback(() => {
    if (isPlacing) {
      cancelPlacement();
    }
  }, [isPlacing, cancelPlacement]);

  // Get placements for the currently focused bed
  const currentBedPlacements = focusedBed ? getPlacementsForBed(focusedBed.id) : [];

  return {
    // State
    placements: currentBedPlacements,
    selectedPlacementIds,
    isPlacing,
    selectedSpecies,
    placementPreview,
    
    // Actions
    handlePlacementPreview,
    handlePlantPlacement,
    selectSpeciesForPlacement,
    cancelPlacement,
    handleEmptyAreaClick,
    selectPlacements,
    removePlacements,
    
    // Utilities
    canvasToBedCoordinates,
    isWithinBedBounds,
    snapToGrid
  };
};
