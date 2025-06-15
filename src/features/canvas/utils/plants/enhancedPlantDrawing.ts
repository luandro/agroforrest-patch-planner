
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

  // Use provided growth month (don't access store directly in renderer)
  const currentMonth = growthMonth || 0;

  // Calculate dynamic plant size based on species and time
  const baseRadius = species ? getSpeciesBaseRadius(species) : 6;
  const maxRadius = species ? getSpeciesMaxRadius(species) : 18;
  const growthProgress = calculateGrowthProgress(species, currentMonth);
  const currentRadius = baseRadius + (maxRadius - baseRadius) * growthProgress;

  // Apply environmental stress
  const stressMultiplier = 1 - (environmentalStress * 0.3);
  const finalRadius = Math.max(3, currentRadius * stressMultiplier);

  // Debug logging for plant rendering
  if (process.env.NODE_ENV === 'development' && currentMonth > 0 && species) {
    console.debug('[Plant Render]', {
      species: species.commonName,
      month: currentMonth,
      baseRadius,
      maxRadius,
      growthProgress,
      finalRadius
    });
  }

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
    if (currentMonth > 24 && species?.category === 'trees' && finalRadius > 12) {
      const ringCount = Math.floor(currentMonth / 12);
      for (let i = 1; i <= Math.min(ringCount, 4); i++) {
        ctx.beginPath();
        ctx.arc(screenX, screenY, finalRadius * (0.2 + i * 0.15), 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(139, 69, 19, ${0.4 - i * 0.08})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // Add trunk for mature trees
  if (currentMonth > 36 && species?.category === 'trees' && finalRadius > 15) {
    ctx.beginPath();
    ctx.arc(screenX, screenY, finalRadius * 0.2, 0, 2 * Math.PI);
    ctx.fillStyle = '#8B4513'; // Tree trunk color
    ctx.fill();
  }

  // Development label with timeline info
  if (process.env.NODE_ENV === 'development' && species && finalRadius > 10) {
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    const label = `${species.commonName.substring(0, 4)} ${currentMonth}m`;
    ctx.fillText(label, screenX, screenY + 2);
  }

  ctx.restore();
};

// Enhanced helper functions for species-specific growth
const getSpeciesBaseRadius = (species: PlantSpecies): number => {
  switch (species.category) {
    case 'trees': return 6;
    case 'shrubs': return 4;
    case 'ground-cover': return 3;
    case 'herbs': return 3.5;
    default: return 4;
  }
};

const getSpeciesMaxRadius = (species: PlantSpecies): number => {
  switch (species.category) {
    case 'trees': return 45; // Much larger for dramatic timeline effect
    case 'shrubs': return 28;
    case 'ground-cover': return 12;
    case 'herbs': return 16;
    default: return 20;
  }
};

const calculateGrowthProgress = (species: PlantSpecies | null, currentMonth: number): number => {
  if (!species || currentMonth <= 0) return 0;

  // Enhanced maturity times for better timeline visualization
  const maturityMonths = {
    'trees': 180, // 15 years for full size
    'shrubs': 96,  // 8 years
    'ground-cover': 24, // 2 years
    'herbs': 36    // 3 years
  }[species.category] || 96;

  // Growth rate modifier
  const rateMultiplier = {
    'fast': 0.6,    // Faster growth
    'medium': 1.0,
    'slow': 1.4     // Slower growth
  }[species.growthRate || 'medium'] || 1.0;

  const adjustedMaturity = maturityMonths * rateMultiplier;
  const progress = Math.min(currentMonth / adjustedMaturity, 1);

  // Enhanced sigmoid curve with earlier visible changes
  const sigmoidProgress = 1 / (1 + Math.exp(-10 * (progress - 0.2)));
  
  // Ensure some visible growth even in early months
  return Math.max(progress * 0.2, sigmoidProgress);
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
