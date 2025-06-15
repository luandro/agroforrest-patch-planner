
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
  const finalRadius = currentRadius * stressMultiplier;

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
    ctx.fillStyle = isSelected ? '#3B82F6' : plantColor;
    ctx.fill();
    
    if (isSelected || isHovered) {
      ctx.strokeStyle = isSelected ? '#1D4ED8' : '#374151';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();
    }
  }

  // Add growth stage indicator for mature plants
  if (currentMonth > 60 && species?.category === 'trees') {
    ctx.beginPath();
    ctx.arc(screenX, screenY, finalRadius * 0.3, 0, 2 * Math.PI);
    ctx.fillStyle = '#8B4513'; // Tree trunk color
    ctx.fill();
  }

  // Species label for development
  if (process.env.NODE_ENV === 'development' && species && finalRadius > 10) {
    ctx.fillStyle = '#000';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      species.commonName.substring(0, 3), 
      screenX, 
      screenY + 2
    );
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
  switch (species.category) {
    case 'trees': return 20;
    case 'shrubs': return 12;
    case 'ground-cover': return 6;
    case 'herbs': return 8;
    default: return 10;
  }
};

const calculateGrowthProgress = (species: PlantSpecies | null, currentMonth: number): number => {
  if (!species || currentMonth <= 0) return 0;

  // Species-specific maturity times (in months)
  const maturityMonths = {
    'trees': 120, // 10 years
    'shrubs': 60,  // 5 years
    'ground-cover': 24, // 2 years
    'herbs': 36    // 3 years
  }[species.category] || 60;

  // Growth rate modifier
  const rateMultiplier = {
    'fast': 0.7,
    'medium': 1.0,
    'slow': 1.4
  }[species.growthRate || 'medium'] || 1.0;

  const adjustedMaturity = maturityMonths * rateMultiplier;
  const progress = Math.min(currentMonth / adjustedMaturity, 1);

  // Use sigmoid curve for realistic growth
  return 1 / (1 + Math.exp(-6 * (progress - 0.5)));
};
