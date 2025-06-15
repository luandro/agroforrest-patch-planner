
import { PlantSpecies } from '../../types/species.types';
import { getSpeciesGrowthProfile, SPECIES_GROWTH_PROFILES } from '../../data/speciesGrowthData';
import { calculateGrowthAtMonth } from '../growthCalculations';

export interface EnhancedPlantVisuals {
  color: string;
  radius: number;
  symbol: string;
  opacity: number; // Para penetração de luz
  shadowIntensity: number; // Para sombreamento
  height: number; // Para cálculos de sobreposição
  lightPenetration: number; // Porcentagem de luz que passa
}

export const getEnhancedPlantVisuals = (
  species: any,
  growthMonth?: number,
  environmentalStress: number = 0
): EnhancedPlantVisuals => {
  if (!species) {
    return {
      color: '#10B981',
      radius: 8,
      symbol: '?',
      opacity: 1,
      shadowIntensity: 0.2,
      height: 1,
      lightPenetration: 90
    };
  }

  // Obter dados de crescimento da espécie
  const growthProfile = getSpeciesGrowthProfile(species.id) || 
                       getSpeciesGrowthProfile(species.category) ||
                       getDefaultGrowthProfile(species.category);

  // Visuais base da categoria
  const baseVisuals = getBaseVisuals(species.category);
  
  // Se não há dados de crescimento, usar visuais base
  if (growthMonth === undefined || !growthProfile) {
    return {
      ...baseVisuals,
      opacity: 1,
      shadowIntensity: 0.3,
      height: baseVisuals.radius * 0.5,
      lightPenetration: 85
    };
  }

  // Calcular crescimento atual
  const growth = calculateGrowthAtMonth(
    growthProfile.dataPoints,
    growthMonth,
    growthProfile.growthCurveType
  );

  // Aplicar stress ambiental
  const stressMultiplier = 1 - (environmentalStress * 0.3);
  const actualRadius = Math.max(4, growth.canopyRadius * 20 * stressMultiplier); // Converter para pixels
  
  // Calcular intensidade da sombra baseada na penetração de luz
  const shadowIntensity = (100 - growth.lightPenetration) / 100;
  
  // Ajustar cor baseada na saúde da planta (stress)
  const healthColor = adjustColorForHealth(baseVisuals.color, environmentalStress);
  
  return {
    color: healthColor,
    radius: actualRadius,
    symbol: baseVisuals.symbol,
    opacity: Math.max(0.3, 1 - (environmentalStress * 0.4)),
    shadowIntensity: shadowIntensity,
    height: growth.height,
    lightPenetration: growth.lightPenetration
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

const getDefaultGrowthProfile = (category: string) => {
  // Perfis padrão baseados na categoria se não houver dados específicos
  const defaultProfiles = {
    'trees': SPECIES_GROWTH_PROFILES['eucalyptus'],
    'shrubs': SPECIES_GROWTH_PROFILES['acacia'],
    'ground-cover': SPECIES_GROWTH_PROFILES['ground-cover'],
    'herbs': SPECIES_GROWTH_PROFILES['native-herbs']
  };
  
  return defaultProfiles[category as keyof typeof defaultProfiles] || 
         SPECIES_GROWTH_PROFILES['native-herbs'];
};

const adjustColorForHealth = (baseColor: string, stress: number): string => {
  if (stress < 0.2) return baseColor; // Planta saudável
  
  // Converter hex para RGB para manipular
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Reduzir verde e aumentar amarelo/vermelho para indicar stress
  const stressEffect = stress * 0.5;
  const newR = Math.min(255, Math.round(r + (255 - r) * stressEffect));
  const newG = Math.round(g * (1 - stressEffect * 0.3));
  const newB = Math.round(b * (1 - stressEffect * 0.5));
  
  return `rgb(${newR}, ${newG}, ${newB})`;
};

// Função para calcular sombras entre plantas
export const calculateShadowEffects = (
  plants: Array<{
    position: { x: number; y: number };
    visuals: EnhancedPlantVisuals;
  }>
): Array<{
  position: { x: number; y: number };
  shadowIntensity: number;
}> => {
  const shadowAreas: Array<{
    position: { x: number; y: number };
    shadowIntensity: number;
  }> = [];

  plants.forEach((plant, index) => {
    plants.forEach((otherPlant, otherIndex) => {
      if (index === otherIndex) return;
      
      // Calcular se uma planta faz sombra na outra
      const distance = Math.sqrt(
        Math.pow(plant.position.x - otherPlant.position.x, 2) +
        Math.pow(plant.position.y - otherPlant.position.y, 2)
      );
      
      const shadowRadius = plant.visuals.radius * 0.02; // Converter pixels para metros
      
      if (distance < shadowRadius && otherPlant.visuals.height < plant.visuals.height) {
        const shadowStrength = (1 - plant.visuals.lightPenetration / 100) * 
                              (1 - distance / shadowRadius);
        
        shadowAreas.push({
          position: otherPlant.position,
          shadowIntensity: shadowStrength
        });
      }
    });
  });

  return shadowAreas;
};

// Função para visualização em massa (bulk placement)
export const getBulkPreviewVisualsEnhanced = (
  species: any,
  growthMonth?: number
): { color: string; radius: number; opacity: number } => {
  const enhanced = getEnhancedPlantVisuals(species, growthMonth);
  
  return {
    color: enhanced.color,
    radius: Math.max(4, enhanced.radius * 0.8), // Slightly smaller for preview
    opacity: enhanced.opacity * 0.7 // More transparent for preview
  };
};
