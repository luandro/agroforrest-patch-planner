import { drawEnhancedPlant } from './enhancedPlantDrawing';
import { getEnhancedPlantVisuals } from './enhancedPlantVisuals';
import { PlantSpecies } from '../../types/species.types';

// Manter a função original para compatibilidade, mas redirecionar para a versão aprimorada
export const drawPlant = (
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
  drawEnhancedPlant(
    ctx,
    screenX,
    screenY,
    species,
    isSelected,
    isPreview,
    isHovered,
    growthMonth,
    environmentalStress,
    shadowIntensity
  );
};

// Enhanced selection area rectangle with better visual feedback
export const drawSelectionArea = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  ctx.save();
  
  // Selection rectangle with enhanced styling
  ctx.strokeStyle = '#0EA5E9';
  ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 4]);
  
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
  
  // Add corner indicators for better UX
  const cornerSize = 8;
  ctx.setLineDash([]);
  ctx.fillStyle = '#0EA5E9';
  
  // Draw corner squares
  const corners = [
    { x, y },
    { x: x + width - cornerSize, y },
    { x, y: y + height - cornerSize },
    { x: x + width - cornerSize, y: y + height - cornerSize }
  ];
  
  corners.forEach(corner => {
    ctx.fillRect(corner.x, corner.y, cornerSize, cornerSize);
  });
  
  ctx.restore();
};
