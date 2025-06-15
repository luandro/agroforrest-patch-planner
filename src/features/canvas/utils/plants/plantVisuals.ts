
import { PlantSpecies } from '../../types/species.types';

export interface PlantVisuals {
  color: string;
  radius: number;
  symbol: string;
}

export const getPlantVisuals = (species: any): PlantVisuals => {
  if (!species) {
    return { color: '#10B981', radius: 8, symbol: '?' };
  }

  switch (species.category) {
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
