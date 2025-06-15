
import { Bed } from '../types/bed.types';
import { PlantSpecies } from '../types/species.types';
import { PlantPlacement } from '../stores/plantPlacementStore';
import { 
  BulkPlacementConfig, 
  BulkPlacementPreview, 
  PlacementPosition
} from '../types/bulkPlacement.types';
import { 
  getSpacingRules, 
  getDefaultBulkConfig, 
  calculateOptimalPattern 
} from './spacing/spacingRules';
import { 
  calculateGridPositions, 
  calculateStaggeredPositions, 
  calculateRowPositions 
} from './patterns/patternCalculators';
import { calculateBedArea, getBedDimensions } from './geometry/geometryUtils';

// Re-export for backwards compatibility
export { getSpacingRules, getDefaultBulkConfig };

const calculatePositionsByPattern = (
  bed: Bed,
  config: BulkPlacementConfig,
  pattern: string
): PlacementPosition[] => {
  switch (pattern) {
    case 'grid':
      return calculateGridPositions(bed, config);
    case 'staggered':
      return calculateStaggeredPositions(bed, config);
    case 'rows':
      return calculateRowPositions(bed, config);
    default:
      return calculateGridPositions(bed, config);
  }
};

const checkPositionConflicts = (
  positions: PlacementPosition[],
  existingPlacements: PlantPlacement[]
): { availablePositions: PlacementPosition[]; conflicts: number } => {
  const tolerance = 0.05; // 5cm tolerance
  let conflicts = 0;
  
  const availablePositions = positions.filter(pos => {
    const hasConflict = existingPlacements.some(existing => 
      Math.abs(existing.position.x - pos.x) < tolerance &&
      Math.abs(existing.position.y - pos.y) < tolerance
    );
    
    if (hasConflict) conflicts++;
    return !hasConflict;
  });

  return { availablePositions, conflicts };
};

const calculateCoverage = (
  positionCount: number,
  spacing: number,
  bedArea: number
) => {
  const usedArea = positionCount * (spacing * spacing);
  
  return {
    usedArea,
    totalArea: bedArea,
    efficiency: bedArea > 0 ? (usedArea / bedArea) * 100 : 0
  };
};

export const calculateBulkPlacement = (
  bed: Bed,
  species: PlantSpecies,
  config: BulkPlacementConfig,
  existingPlacements: PlantPlacement[] = []
): BulkPlacementPreview => {
  const { length: bedLength, width: bedWidth } = getBedDimensions(bed);
  const pattern = calculateOptimalPattern(bedLength, bedWidth, species, config);
  
  const positions = calculatePositionsByPattern(bed, config, pattern);
  const { availablePositions, conflicts } = checkPositionConflicts(positions, existingPlacements);
  
  const bedArea = calculateBedArea(bed);
  const coverage = calculateCoverage(availablePositions.length, config.spacing, bedArea);
  
  return {
    positions: availablePositions,
    totalCount: availablePositions.length,
    pattern,
    spacing: config.spacing,
    conflicts,
    coverage
  };
};
