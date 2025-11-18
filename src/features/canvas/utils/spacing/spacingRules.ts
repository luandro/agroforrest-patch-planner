
import { PlantSpecies } from '../../types/species.types';
import { PlantSpacingRules } from '../../types/bulkPlacement.types';
import { BulkPlacementConfig } from '../../types/bulkPlacement.types';

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
  bedLength: number,
  bedWidth: number,
  _species: PlantSpecies,
  config: BulkPlacementConfig
): string => {
  if (config.pattern !== 'auto') {
    return config.pattern;
  }

  // Auto-select based on spacing and bed dimensions
  if (config.spacing <= 0.2) {
    return 'grid'; // Dense vegetables/ground cover
  } else if (config.spacing <= 1.0) {
    return bedWidth >= config.spacing * 2 ? 'staggered' : 'rows'; // Shrubs/herbs
  } else {
    return bedLength >= config.spacing * 3 ? 'rows' : 'grid'; // Trees
  }
};
