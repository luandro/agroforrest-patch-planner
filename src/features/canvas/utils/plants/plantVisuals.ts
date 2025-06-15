import { PlantSpecies } from '../../types/species.types';

export interface PlantVisuals {
  color: string;
  radius: number;
  symbol: string;
}

export const getPlantVisuals = (species: any, growthMonth?: number): PlantVisuals => {
  if (!species) {
    return { color: '#10B981', radius: 8, symbol: '?' };
  }

  // Base visuals
  const baseVisuals = getBaseVisuals(species.category);
  
  // If no growth month specified, return base visuals
  if (growthMonth === undefined) {
    return baseVisuals;
  }

  // Calculate growth-adjusted radius
  const growthRadius = calculateGrowthRadius(species, growthMonth);
  
  return {
    ...baseVisuals,
    radius: growthRadius
  };
};

const getBaseVisuals = (category: string) => {
  switch (category) {
    case 'trees':
      return { color: '#059669', radius: 12, symbol: '🌳' };
    case 'shrubs':
      return { color: '#34D399', radius: 10, symbol: '🌿' };
    case 'ground-cover':
      return { color: '#6EE7B7', radius: 6, symbol: '🍀' };
    case 'herbs':
      return { color: '#A7F3D0', radius: 8, symbol: '🌱' };
    default:
      return { color: '#10B981', radius: 8, symbol: '🌿' };
  }
};

const calculateGrowthRadius = (species: any, months: number): number => {
  const baseSize = getBaseSize(species.category);
  const maxSize = getMaxSize(species.category);
  
  // Growth curve based on species growth rate
  const growthMultiplier = getGrowthMultiplier(species.growthRate);
  const maturityMonths = getMaturityMonths(species.category, species.growthRate);
  
  // Sigmoid growth curve for more realistic growth pattern
  const progress = Math.min(months / maturityMonths, 1);
  const sigmoidProgress = 1 / (1 + Math.exp(-6 * (progress - 0.5)));
  
  return Math.max(baseSize, baseSize + (maxSize - baseSize) * sigmoidProgress * growthMultiplier);
};

const getBaseSize = (category: string): number => {
  switch (category) {
    case 'trees': return 8;
    case 'shrubs': return 6;
    case 'ground-cover': return 4;
    case 'herbs': return 5;
    default: return 6;
  }
};

const getMaxSize = (category: string): number => {
  switch (category) {
    case 'trees': return 24;
    case 'shrubs': return 16;
    case 'ground-cover': return 8;
    case 'herbs': return 12;
    default: return 12;
  }
};

const getGrowthMultiplier = (growthRate: string): number => {
  switch (growthRate) {
    case 'fast': return 1.2;
    case 'medium': return 1.0;
    case 'slow': return 0.8;
    default: return 1.0;
  }
};

const getMaturityMonths = (category: string, growthRate: string): number => {
  const baseMonths = {
    'trees': 120,
    'shrubs': 60,
    'ground-cover': 24,
    'herbs': 36
  }[category] || 60;

  const rateMultiplier = {
    'fast': 0.7,
    'medium': 1.0,
    'slow': 1.4
  }[growthRate] || 1.0;

  return baseMonths * rateMultiplier;
};

export const getBulkPreviewVisuals = (species: any): { color: string; radius: number } => {
  if (!species) {
    return { color: '#10B981', radius: 6 };
  }

  switch (species.category) {
    case 'trees':
      return { color: '#059669', radius: 8 };
    case 'shrubs':
      return { color: '#34D399', radius: 7 };
    case 'ground-cover':
      return { color: '#6EE7B7', radius: 4 };
    case 'herbs':
      return { color: '#A7F3D0', radius: 5 };
    default:
      return { color: '#10B981', radius: 6 };
  }
};
