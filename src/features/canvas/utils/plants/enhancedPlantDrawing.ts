
import { PlantSpecies } from '../../types/species.types';

export const drawEnhancedPlant = (
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  species: PlantSpecies | null = null,
  isSelected: boolean = false,
  isPreview: boolean = false,
  isHovered: boolean = false,
  growthMonth?: number,
  environmentalStress: number = 0,
  shadowIntensity: number = 0
) => {
  ctx.save();

  // Ensure plants are always visible with minimum base size
  const currentMonth = growthMonth !== undefined ? Math.max(0, growthMonth) : 0;
  
  // Calculate dynamic plant size with guaranteed visibility
  const baseRadius = species ? getSpeciesBaseRadius(species) : 5;
  const maxRadius = species ? getSpeciesMaxRadius(species) : 20;
  const growthProgress = calculateGrowthProgress(species, currentMonth);
  const currentRadius = baseRadius + (maxRadius - baseRadius) * growthProgress;

  // Apply environmental stress but ensure minimum visibility
  const stressMultiplier = Math.max(0.5, 1 - (environmentalStress * 0.3));
  const finalRadius = Math.max(4, currentRadius * stressMultiplier);

  // Plant colors with better contrast
  const healthColor = environmentalStress > 0.5 ? '#8B4513' : '#228B22';
  const plantColor = species?.category === 'trees' ? '#2D5B3D' : 
                    species?.category === 'shrubs' ? '#4A7C59' : '#6B8E5A';

  // Draw shadow if needed
  if (shadowIntensity > 0) {
    ctx.beginPath();
    ctx.arc(screenX + 2, screenY + 2, finalRadius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowIntensity * 0.4})`;
    ctx.fill();
  }

  // Main plant circle
  ctx.beginPath();
  ctx.arc(screenX, screenY, finalRadius, 0, 2 * Math.PI);
  
  if (isPreview) {
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.fillStyle = 'rgba(79, 70, 229, 0.3)';
    ctx.fill();
  } else {
    // Growth-based color progression
    const growthColorAdjustment = Math.min(0.3, growthProgress * 0.3);
    const adjustedColor = adjustColorBrightness(plantColor, growthColorAdjustment);
    
    ctx.fillStyle = isSelected ? '#3B82F6' : adjustedColor;
    ctx.fill();
    
    // Enhanced outline for visibility
    if (isSelected || isHovered) {
      ctx.strokeStyle = isSelected ? '#1D4ED8' : '#374151';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();
    } else {
      // Always show outline for better visibility
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Growth rings for mature trees
    if (currentMonth > 24 && species?.category === 'trees' && finalRadius > 12) {
      const ringCount = Math.floor(currentMonth / 12);
      for (let i = 1; i <= Math.min(ringCount, 5); i++) {
        ctx.beginPath();
        ctx.arc(screenX, screenY, finalRadius * (0.15 + i * 0.12), 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(139, 69, 19, ${0.6 - i * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // Trunk for mature trees
  if (currentMonth > 18 && species?.category === 'trees' && finalRadius > 10) {
    const trunkRadius = Math.max(2, finalRadius * 0.12);
    ctx.beginPath();
    ctx.arc(screenX, screenY, trunkRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#8B4513';
    ctx.fill();
  }

  // Development label - improved visibility
  if (import.meta.env.DEV && species && finalRadius > 8) {
    ctx.fillStyle = '#000';
    ctx.font = 'bold 10px Arial';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    const label = `${currentMonth.toFixed(1)}m`;
    ctx.strokeText(label, screenX, screenY - finalRadius - 5);
    ctx.fillText(label, screenX, screenY - finalRadius - 5);
  }

  ctx.restore();
};

// Enhanced species-specific growth calculations
const getSpeciesBaseRadius = (species: PlantSpecies): number => {
  switch (species.category) {
    case 'trees': return 4; // Larger base for visibility
    case 'shrubs': return 3;
    case 'ground-cover': return 2.5;
    case 'herbs': return 3;
    default: return 3;
  }
};

const getSpeciesMaxRadius = (species: PlantSpecies): number => {
  switch (species.category) {
    case 'trees': return 45; // Larger for dramatic effect
    case 'shrubs': return 28;
    case 'ground-cover': return 15;
    case 'herbs': return 20;
    default: return 25;
  }
};

const calculateGrowthProgress = (species: PlantSpecies | null, currentMonth: number): number => {
  if (!species || currentMonth <= 0) return 0;

  const maturityMonths = {
    'trees': 180,
    'shrubs': 96,
    'ground-cover': 24,
    'herbs': 36
  }[species.category] || 96;

  const rateMultiplier = {
    'fast': 0.7,
    'medium': 1.0,
    'slow': 1.3
  }[species.growthRate || 'medium'] || 1.0;

  const adjustedMaturity = maturityMonths * rateMultiplier;
  const progress = Math.min(currentMonth / adjustedMaturity, 1);

  // Enhanced sigmoid with immediate visible growth
  const sigmoidProgress = 1 / (1 + Math.exp(-6 * (progress - 0.25)));
  
  // Ensure minimum growth is visible from the start
  return Math.max(progress * 0.05, sigmoidProgress);
};

// Color adjustment helper
const adjustColorBrightness = (hex: string, factor: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  
  r = Math.min(255, Math.round(r * (1 + factor)));
  g = Math.min(255, Math.round(g * (1 + factor)));
  b = Math.min(255, Math.round(b * (1 + factor)));
  
  return `rgb(${r}, ${g}, ${b})`;
};
