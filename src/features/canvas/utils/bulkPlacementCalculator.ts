
import { Bed } from '../types/bed.types';
import { PlantSpecies } from '../types/species.types';
import { PlantPlacement } from '../stores/plantPlacementStore';
import { 
  BulkPlacementConfig, 
  BulkPlacementPreview, 
  PlacementPosition,
  PlantSpacingRules 
} from '../types/bulkPlacement.types';

// Default spacing rules for different plant categories
const PLANT_SPACING_RULES: Record<string, PlantSpacingRules> = {
  'ground-cover': {
    type: 'ground-cover',
    idealSpacing: 0.1, // 10cm
    minSpacing: 0.05,
    maxSpacing: 0.2,
    preferredPattern: 'grid',
    maxPlantsPerRow: 20
  },
  'herbs': {
    type: 'herbs',
    idealSpacing: 0.15, // 15cm
    minSpacing: 0.1,
    maxSpacing: 0.3,
    preferredPattern: 'grid',
    maxPlantsPerRow: 15
  },
  'shrubs': {
    type: 'shrubs',
    idealSpacing: 0.8, // 80cm
    minSpacing: 0.5,
    maxSpacing: 1.5,
    preferredPattern: 'staggered',
    maxPlantsPerRow: 8
  },
  'trees': {
    type: 'trees',
    idealSpacing: 3.0, // 3m
    minSpacing: 2.0,
    maxSpacing: 5.0,
    preferredPattern: 'rows',
    maxPlantsPerRow: 4
  }
};

export const getSpacingRules = (species: PlantSpecies): PlantSpacingRules => {
  return PLANT_SPACING_RULES[species.category] || PLANT_SPACING_RULES['herbs'];
};

export const getDefaultBulkConfig = (species: PlantSpecies): BulkPlacementConfig => {
  const rules = getSpacingRules(species);
  
  return {
    pattern: 'auto',
    spacing: rules.idealSpacing,
    marginFromEdge: rules.idealSpacing / 2,
    maxPlantsPerRow: rules.maxPlantsPerRow,
    maxRows: species.category === 'trees' ? 2 : undefined
  };
};

export const calculateOptimalPattern = (
  bed: Bed, 
  species: PlantSpecies, 
  config: BulkPlacementConfig
): string => {
  if (config.pattern !== 'auto') {
    return config.pattern;
  }

  const rules = getSpacingRules(species);
  const bedLength = bed.dimensions.length || 0;
  const bedWidth = bed.dimensions.width || 0;

  // Auto-select based on spacing and bed dimensions
  if (config.spacing <= 0.2) {
    return 'grid'; // Dense vegetables/ground cover
  } else if (config.spacing <= 1.0) {
    return bedWidth >= config.spacing * 2 ? 'staggered' : 'rows'; // Shrubs/herbs
  } else {
    return bedLength >= config.spacing * 3 ? 'rows' : 'grid'; // Trees
  }
};

export const calculateBedArea = (bed: Bed): number => {
  if (bed.shape === 'rectangle') {
    return (bed.dimensions.length || 0) * (bed.dimensions.width || 0);
  } else {
    const radius = bed.dimensions.radius || 0;
    return Math.PI * radius * radius;
  }
};

export const calculateGridPositions = (
  bed: Bed,
  config: BulkPlacementConfig
): PlacementPosition[] => {
  const positions: PlacementPosition[] = [];
  
  if (bed.shape !== 'rectangle') {
    return calculateCircularPositions(bed, config);
  }

  const bedLength = bed.dimensions.length || 0;
  const bedWidth = bed.dimensions.width || 0;
  const { spacing, marginFromEdge } = config;

  // Calculate usable area
  const usableLength = bedLength - (marginFromEdge * 2);
  const usableWidth = bedWidth - (marginFromEdge * 2);

  if (usableLength <= 0 || usableWidth <= 0) {
    return positions; // Bed too small
  }

  // Calculate number of plants per dimension
  const plantsPerLength = Math.floor(usableLength / spacing) + 1;
  const plantsPerWidth = Math.floor(usableWidth / spacing) + 1;

  // Calculate actual spacing to center the grid
  const actualSpacingLength = plantsPerLength > 1 ? usableLength / (plantsPerLength - 1) : 0;
  const actualSpacingWidth = plantsPerWidth > 1 ? usableWidth / (plantsPerWidth - 1) : 0;

  // Generate positions relative to bed center
  const startX = -(usableLength / 2);
  const startY = -(usableWidth / 2);

  for (let row = 0; row < plantsPerWidth; row++) {
    for (let col = 0; col < plantsPerLength; col++) {
      const x = startX + (col * actualSpacingLength);
      const y = startY + (row * actualSpacingWidth);
      
      positions.push({
        x: Math.round(x * 100) / 100, // Round to cm precision
        y: Math.round(y * 100) / 100,
        row,
        column: col
      });
    }
  }

  return positions;
};

export const calculateStaggeredPositions = (
  bed: Bed,
  config: BulkPlacementConfig
): PlacementPosition[] => {
  const gridPositions = calculateGridPositions(bed, config);
  
  // Offset alternate rows by half spacing
  return gridPositions.map(pos => ({
    ...pos,
    x: pos.x + (pos.row % 2 === 1 ? config.spacing / 2 : 0)
  })).filter(pos => {
    // Remove positions that fall outside bed bounds after staggering
    if (bed.shape === 'rectangle') {
      const halfLength = (bed.dimensions.length || 0) / 2;
      return Math.abs(pos.x) <= halfLength - config.marginFromEdge;
    }
    return true;
  });
};

export const calculateRowPositions = (
  bed: Bed,
  config: BulkPlacementConfig
): PlacementPosition[] => {
  const positions: PlacementPosition[] = [];
  
  if (bed.shape !== 'rectangle') {
    return calculateCircularPositions(bed, config);
  }

  const bedLength = bed.dimensions.length || 0;
  const bedWidth = bed.dimensions.width || 0;
  const { spacing, marginFromEdge, maxRows = 3 } = config;

  const usableLength = bedLength - (marginFromEdge * 2);
  const usableWidth = bedWidth - (marginFromEdge * 2);

  if (usableLength <= 0 || usableWidth <= 0) {
    return positions;
  }

  // Calculate number of rows that fit
  const maxRowsForWidth = Math.floor(usableWidth / spacing) + 1;
  const numRows = Math.min(maxRows, maxRowsForWidth);
  
  // Calculate plants per row
  const plantsPerRow = Math.floor(usableLength / spacing) + 1;
  
  if (plantsPerRow <= 0 || numRows <= 0) {
    return positions;
  }

  // Calculate actual spacing
  const actualSpacingLength = plantsPerRow > 1 ? usableLength / (plantsPerRow - 1) : 0;
  const rowSpacing = numRows > 1 ? usableWidth / (numRows - 1) : 0;

  const startX = -(usableLength / 2);
  const startY = -(usableWidth / 2);

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < plantsPerRow; col++) {
      const x = startX + (col * actualSpacingLength);
      const y = startY + (row * rowSpacing);
      
      positions.push({
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
        row,
        column: col
      });
    }
  }

  return positions;
};

export const calculateCircularPositions = (
  bed: Bed,
  config: BulkPlacementConfig
): PlacementPosition[] => {
  const positions: PlacementPosition[] = [];
  const radius = bed.dimensions.radius || 0;
  const { spacing, marginFromEdge } = config;
  
  const usableRadius = radius - marginFromEdge;
  if (usableRadius <= 0) return positions;

  // Use a simple spiral pattern for circular beds
  let currentRadius = 0;
  let layer = 0;

  while (currentRadius <= usableRadius) {
    if (layer === 0) {
      // Center plant
      positions.push({
        x: 0,
        y: 0,
        row: 0,
        column: 0
      });
    } else {
      // Calculate plants in this ring
      const circumference = 2 * Math.PI * currentRadius;
      const plantsInRing = Math.floor(circumference / spacing);
      
      for (let i = 0; i < plantsInRing; i++) {
        const angle = (2 * Math.PI * i) / plantsInRing;
        const x = currentRadius * Math.cos(angle);
        const y = currentRadius * Math.sin(angle);
        
        positions.push({
          x: Math.round(x * 100) / 100,
          y: Math.round(y * 100) / 100,
          row: layer,
          column: i
        });
      }
    }
    
    layer++;
    currentRadius = layer * spacing;
  }

  return positions;
};

export const calculateBulkPlacement = (
  bed: Bed,
  species: PlantSpecies,
  config: BulkPlacementConfig,
  existingPlacements: PlantPlacement[] = []
): BulkPlacementPreview => {
  const pattern = calculateOptimalPattern(bed, species, config);
  
  let positions: PlacementPosition[] = [];
  
  switch (pattern) {
    case 'grid':
      positions = calculateGridPositions(bed, config);
      break;
    case 'staggered':
      positions = calculateStaggeredPositions(bed, config);
      break;
    case 'rows':
      positions = calculateRowPositions(bed, config);
      break;
    default:
      positions = calculateGridPositions(bed, config);
  }

  // Check for conflicts with existing plants
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

  const bedArea = calculateBedArea(bed);
  const usedArea = availablePositions.length * (config.spacing * config.spacing);
  
  return {
    positions: availablePositions,
    totalCount: availablePositions.length,
    pattern,
    spacing: config.spacing,
    conflicts,
    coverage: {
      usedArea,
      totalArea: bedArea,
      efficiency: bedArea > 0 ? (usedArea / bedArea) * 100 : 0
    }
  };
};
