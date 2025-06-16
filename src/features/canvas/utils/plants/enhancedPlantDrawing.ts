
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

  // Use provided growth month with improved initialization
  const currentMonth = growthMonth !== undefined ? growthMonth : 0;

  // Calculate dynamic plant size based on species and time with better scaling
  const baseRadius = species ? getSpeciesBaseRadius(species) : 4; // Smaller initial size
  const maxRadius = species ? getSpeciesMaxRadius(species) : 20;
  const growthProgress = calculateGrowthProgress(species, currentMonth);
  const currentRadius = baseRadius + (maxRadius - baseRadius) * growthProgress;

  // Apply environmental stress
  const stressMultiplier = 1 - (environmentalStress * 0.3);
  const finalRadius = Math.max(2, currentRadius * stressMultiplier); // Ensure minimum visibility

  // Enhanced debug logging for plant rendering
  if (process.env.NODE_ENV === 'development' && species) {
    console.debug('[Plant Render]', {
      species: species.commonName,
      month: currentMonth,
      baseRadius,
      maxRadius,
      growthProgress: growthProgress.toFixed(2),
      finalRadius: finalRadius.toFixed(1),
      isVisible: finalRadius > 2
    });
  }

  // Ensure plants are always visible with minimum size
  const visibleRadius = Math.max(3, finalRadius);

  // Plant colors based on species and health with better contrast
  const healthColor = environmentalStress > 0.5 ? '#8B4513' : '#228B22';
  const plantColor = species?.category === 'trees' ? '#2D5B3D' : 
                    species?.category === 'shrubs' ? '#4A7C59' : '#6B8E5A';

  // Draw shadow if needed
  if (shadowIntensity > 0) {
    ctx.beginPath();
    ctx.arc(screenX + 1, screenY + 1, visibleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowIntensity * 0.3})`;
    ctx.fill();
  }

  // Main plant circle with enhanced visibility
  ctx.beginPath();
  ctx.arc(screenX, screenY, visibleRadius, 0, 2 * Math.PI);
  
  if (isPreview) {
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
    ctx.fill();
  } else {
    // Apply growth-based color changes with better progression
    const growthColorAdjustment = Math.min(0.4, growthProgress * 0.4);
    const adjustedColor = adjustColorBrightness(plantColor, growthColorAdjustment);
    
    ctx.fillStyle = isSelected ? '#3B82F6' : adjustedColor;
    ctx.fill();
    
    // Enhanced outline for better visibility
    if (isSelected || isHovered) {
      ctx.strokeStyle = isSelected ? '#1D4ED8' : '#374151';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();
    } else {
      // Always show a subtle outline for visibility
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Add growth rings for older trees with better visibility
    if (currentMonth > 24 && species?.category === 'trees' && visibleRadius > 10) {
      const ringCount = Math.floor(currentMonth / 12);
      for (let i = 1; i <= Math.min(ringCount, 4); i++) {
        ctx.beginPath();
        ctx.arc(screenX, screenY, visibleRadius * (0.2 + i * 0.15), 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(139, 69, 19, ${0.5 - i * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // Add trunk for mature trees with better scaling
  if (currentMonth > 24 && species?.category === 'trees' && visibleRadius > 8) {
    const trunkRadius = Math.max(2, visibleRadius * 0.15);
    ctx.beginPath();
    ctx.arc(screenX, screenY, trunkRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#8B4513'; // Tree trunk color
    ctx.fill();
  }

  // Development label with timeline info - improved visibility
  if (process.env.NODE_ENV === 'development' && species && visibleRadius > 6) {
    ctx.fillStyle = '#000';
    ctx.font = 'bold 10px Arial';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    const label = `${currentMonth.toFixed(0)}m`;
    ctx.strokeText(label, screenX, screenY + 2);
    ctx.fillText(label, screenX, screenY + 2);
  }

  ctx.restore();
};

// Enhanced helper functions for species-specific growth
const getSpeciesBaseRadius = (species: PlantSpecies): number => {
  switch (species.category) {
    case 'trees': return 3; // Start smaller for better growth effect
    case 'shrubs': return 2.5;
    case 'ground-cover': return 2;
    case 'herbs': return 2.5;
    default: return 2.5;
  }
};

const getSpeciesMaxRadius = (species: PlantSpecies): number => {
  switch (species.category) {
    case 'trees': return 50; // Larger for dramatic timeline effect
    case 'shrubs': return 32;
    case 'ground-cover': return 15;
    case 'herbs': return 20;
    default: return 25;
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

  // Enhanced sigmoid curve with more dramatic early growth
  const sigmoidProgress = 1 / (1 + Math.exp(-8 * (progress - 0.3))); // Earlier visible changes
  
  // Ensure visible growth starts immediately but progresses naturally
  return Math.max(progress * 0.1, sigmoidProgress);
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
