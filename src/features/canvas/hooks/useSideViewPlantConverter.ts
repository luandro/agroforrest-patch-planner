
import { useCallback } from 'react';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { useBedStore } from '../stores/bedStore';
import { useTimelineStore } from '../stores/timelineStore';
import { getSpeciesHeightProfile, calculateHeightAtMonth } from '../data/heightGrowthData';
import { SideViewBed, SideViewPlant } from '../types/sideView.types';
import { getSpeciesById } from '../data/mockSpecies';

/**
 * Hook to convert bed placements to side view representation
 * Handles plant distribution, height calculation, and canopy sizing
 */
export function useSideViewPlantConverter() {
  const { getPlacementsForBed } = usePlantPlacementStore();
  const { beds } = useBedStore();
  const { isTimelineActive } = useTimelineStore();

  const convertToSideViewBed = useCallback((bedId: string, currentMonth: number): SideViewBed | null => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return null;

    const bedPlacements = getPlacementsForBed(bedId);
    const bedLength = bed.shape === 'rectangle'
      ? bed.dimensions.length || 10
      : bed.dimensions.radius ? bed.dimensions.radius * 2 : 10;

    // Sort plants by X position to maintain order
    const sortedPlacements = [...bedPlacements].sort((a, b) => a.position.x - b.position.x);

    const sideViewPlants: SideViewPlant[] = sortedPlacements.map((placement, index) => {
      // Extract species ID - handle both string and object cases
      const speciesId = typeof placement.species === 'string'
        ? placement.species
        : placement.species.id;

      const species = getSpeciesById(speciesId);
      const heightProfile = getSpeciesHeightProfile(speciesId);

      let currentHeight = 0.3; // Start with seedling height
      let canopyRadius = 0.2; // Start with seedling canopy
      let canopyLayer: SideViewPlant['canopyLayer'] = 'understory';

      // Use timeline month for proper growth calculation
      const effectiveMonth = isTimelineActive ? currentMonth : 0;

      if (heightProfile && effectiveMonth >= 0) {
        currentHeight = calculateHeightAtMonth(heightProfile, effectiveMonth);
        canopyRadius = Math.max(0.2, currentHeight * 0.25); // Proportional canopy
        canopyLayer = heightProfile.canopyLayer;
      } else if (species && !isTimelineActive) {
        // Use species mature height only if timeline is not active
        currentHeight = species.matureSize?.height || 2;
        canopyRadius = species.matureSize?.width ? species.matureSize.width / 2 : 0.5;
        canopyLayer = species.category === 'trees' ? 'canopy' :
                      species.category === 'shrubs' ? 'understory' : 'ground';
      }

      // Improved position calculation with better distribution
      const xPosition = calculatePlantXPosition(
        placement.position.x,
        index,
        bedPlacements,
        bedLength
      );

      return {
        id: placement.id,
        speciesId: speciesId,
        position: {
          x: xPosition,
          height: Math.max(0.2, currentHeight) // Ensure minimum height
        },
        canopyRadius: Math.max(0.1, canopyRadius), // Ensure minimum canopy
        canopyLayer,
        age: effectiveMonth
      };
    });

    return {
      id: bedId,
      length: bedLength,
      plants: sideViewPlants
    };
  }, [beds, getPlacementsForBed, isTimelineActive]);

  return { convertToSideViewBed };
}

/**
 * Calculate X position for a plant in the side view
 */
function calculatePlantXPosition(
  plantX: number,
  index: number,
  allPlacements: { position: { x: number } }[],
  bedLength: number
): number {
  if (allPlacements.length <= 1) {
    // Single plant, place in center
    return bedLength / 2;
  }

  // Calculate spread across bed length
  const minX = Math.min(...allPlacements.map(p => p.position.x));
  const maxX = Math.max(...allPlacements.map(p => p.position.x));
  const range = maxX - minX;

  if (range < 0.2) {
    // Plants are clustered, distribute evenly
    return (index / Math.max(1, allPlacements.length - 1)) * bedLength;
  }

  // Use actual positions but scale to bed length
  const normalizedX = (plantX - minX) / range;
  return normalizedX * bedLength;
}
