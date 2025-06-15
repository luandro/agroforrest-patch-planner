
import { PlantSpecies } from '../../types/species.types';
import { useTimelineStore } from '../../stores/timelineStore';

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

  // Get current timeline month if not provided
  const timelineMonth = useTimelineStore.getState().currentMonth;
  const currentMonth = growthMonth !== undefined ? growthMonth : timelineMonth;

  // Calculate dynamic plant size based on species and time
  const baseRadius = species ? getSpeciesBaseRadius(species) : 6;
  const maxRadius = species ? getSpeciesMaxRadius(species) : 18;
  const growthProgress = calculateGrowthProgress(species, currentMonth);
  const currentRadius = baseRadius + (maxRadius - baseRadius) * growthProgress;

  // Apply environmental stress
  const stressMultiplier = 1 - (environmentalStress * 0.3);
  const finalRadius = Math.max(3, currentRadius * stressMultiplier); // Minimum 3px radius

  // Plant colors based on species and health
  const healthColor = environmentalStress > 0.5 ? '#8B4513' : '#228B22';
  const plantColor = species?.category === 'trees' ? '#2D5B3D' : 
                    species?.category === 'shrubs' ? '#4A7C59' : '#6B8E5A';

  // Draw shadow if needed
  if (shadowIntensity > 0) {
    ctx.beginPath();
    ctx.arc(screenX + 2, screenY + 2, finalRadius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowIntensity * 0.3})`;
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
    ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
    ctx.fill();
  } else {
    // Apply growth-based color changes
    const growthColorAdjustment = Math.min(0.3, growthProgress * 0.3);
    const adjustedColor = adjustColorBrightness(plantColor, growthColorAdjustment);
    
    ctx.fillStyle = isSelected ? '#3B82F6' : adjustedColor;
    ctx.fill();
    
    if (isSelected || isHovered) {
      ctx.strokeStyle = isSelected ? '#1D4ED8' : '#374151';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();
    }

    // Add growth rings for older trees
    if (currentMonth > 24 && species?.category === 'trees' && finalRadius > 8) {
      const ringCount = Math.floor(currentMonth / 12);
      for (let i = 1; i <= Math.min(ringCount, 3); i++) {
        ctx.beginPath();
        ctx.arc(screenX, screenY, finalRadius * (0.3 + i * 0.2), 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(139, 69, 19, ${0.3 - i * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // Add growth stage indicator for mature plants
  if (currentMonth > 60 && species?.category === 'trees' && finalRadius > 12) {
    ctx.beginPath();
    ctx.arc(screenX, screenY, finalRadius * 0.25, 0, 2 * Math.PI);
    ctx.fillStyle = '#8B4513'; // Tree trunk color
    ctx.fill();
  }

  // Species label for development
  if (process.env.NODE_ENV === 'development' && species && finalRadius > 8) {
    ctx.fillStyle = '#000';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    const label = `${species.commonName.substring(0, 3)} ${currentMonth}m`;
    ctx.fillText(label, screenX, screenY + 2);
  }

  ctx.restore();
};

// Helper functions for species-specific growth
const getSpeciesBaseRadius = (species: PlantSpecies): number => {
  switch (species.category) {
    case 'trees': return 4;
    case 'shrubs': return 3;
    case 'ground-cover': return 2;
    case 'herbs': return 2.5;
    default: return 3;
  }
};

const getSpeciesMaxRadius = (species: PlantSpecies): number => {
  // Larger maximum sizes for better visual growth
  switch (species.category) {
    case 'trees': return 35; // Increased from 20
    case 'shrubs': return 20; // Increased from 12
    case 'ground-cover': return 8; // Increased from 6
    case 'herbs': return 12; // Increased from 8
    default: return 15;
  }
};

const calculateGrowthProgress = (species: PlantSpecies | null, currentMonth: number): number => {
  if (!species || currentMonth <= 0) return 0;

  // Species-specific maturity times (in months) - more realistic
  const maturityMonths = {
    'trees': 240, // 20 years for full maturity
    'shrubs': 120,  // 10 years
    'ground-cover': 36, // 3 years
    'herbs': 48    // 4 years
  }[species.category] || 120;

  // Growth rate modifier
  const rateMultiplier = {
    'fast': 0.6,    // Faster growth
    'medium': 1.0,
    'slow': 1.5     // Slower growth
  }[species.growthRate || 'medium'] || 1.0;

  const adjustedMaturity = maturityMonths * rateMultiplier;
  const progress = Math.min(currentMonth / adjustedMaturity, 1);

  // Use sigmoid curve for realistic growth with earlier visible changes
  const sigmoidProgress = 1 / (1 + Math.exp(-8 * (progress - 0.4)));
  
  // Ensure some visible growth even in early months
  return Math.max(progress * 0.3, sigmoidProgress);
};

// Helper function to adjust color brightness
const adjustColorBrightness = (hex: string, factor: number): string => {
  // Convert hex to RGB
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  
  // Adjust brightness
  r = Math.min(255, Math.round(r * (1 + factor)));
  g = Math.min(255, Math.round(g * (1 + factor)));
  b = Math.min(255, Math.round(b * (1 + factor)));
  
  return `rgb(${r}, ${g}, ${b})`;
};
