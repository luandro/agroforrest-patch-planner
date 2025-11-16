import { getEnhancedPlantVisuals, getBulkPreviewVisualsEnhanced } from './enhancedPlantVisuals';
import { PlantSpecies } from '../../types/species.types';

export interface PlantVisuals {
  color: string;
  radius: number;
  symbol: string;
}

// Manter a função original para compatibilidade, mas usar o sistema aprimorado internamente
export const getPlantVisuals = (species: PlantSpecies | null, growthMonth?: number): PlantVisuals => {
  const enhanced = getEnhancedPlantVisuals(species, growthMonth);
  
  return {
    color: enhanced.color,
    radius: enhanced.radius,
    symbol: enhanced.symbol
  };
};

// Atualizar a função de preview para usar os novos cálculos
export const getBulkPreviewVisuals = (species: PlantSpecies | null): { color: string; radius: number } => {
  const enhanced = getBulkPreviewVisualsEnhanced(species);
  
  return {
    color: enhanced.color,
    radius: enhanced.radius
  };
};
