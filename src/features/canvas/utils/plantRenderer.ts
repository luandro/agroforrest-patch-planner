
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { PlantPlacement } from '../stores/plantPlacementStore';

export const drawPlantPlacements = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  placements: PlantPlacement[],
  viewport: CanvasViewport,
  selectedPlacementIds: string[] = [],
  placementPreview?: { x: number; y: number } | null
) => {
  const canvas = ctx.canvas;
  const pixelsPerMeter = 50 * viewport.zoom;
  
  // Calculate display dimensions
  const displayWidth = canvas.width / (window.devicePixelRatio || 1);
  const displayHeight = canvas.height / (window.devicePixelRatio || 1);
  
  // Calculate bed screen position
  const bedScreenX = (displayWidth / 2) + (bed.position.x - viewport.centerX) * pixelsPerMeter;
  const bedScreenY = (displayHeight / 2) - (bed.position.y - viewport.centerY) * pixelsPerMeter;

  // Create clipping path for bed shape
  ctx.save();
  ctx.beginPath();
  
  if (bed.shape === 'rectangle') {
    const length = (bed.dimensions.length || 1) * pixelsPerMeter;
    const width = (bed.dimensions.width || 1) * pixelsPerMeter;
    ctx.rect(
      bedScreenX - length / 2, 
      bedScreenY - width / 2, 
      length, 
      width
    );
  } else {
    const radius = (bed.dimensions.radius || 0.5) * pixelsPerMeter;
    ctx.arc(bedScreenX, bedScreenY, radius, 0, 2 * Math.PI);
  }
  
  ctx.clip();

  // Draw existing placements
  placements.forEach(placement => {
    const plantScreenX = bedScreenX + (placement.position.x * pixelsPerMeter);
    const plantScreenY = bedScreenY - (placement.position.y * pixelsPerMeter);
    
    const isSelected = selectedPlacementIds.includes(placement.id);
    
    drawPlant(ctx, plantScreenX, plantScreenY, placement.species, isSelected, false);
  });

  // Draw placement preview
  if (placementPreview) {
    const previewScreenX = bedScreenX + (placementPreview.x * pixelsPerMeter);
    const previewScreenY = bedScreenY - (placementPreview.y * pixelsPerMeter);
    
    drawPlant(ctx, previewScreenX, previewScreenY, null, false, true);
  }

  ctx.restore();
};

const drawPlant = (
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  species: any = null,
  isSelected: boolean = false,
  isPreview: boolean = false
) => {
  ctx.save();

  if (isPreview) {
    ctx.globalAlpha = 0.7;
  }

  // Determine plant appearance based on category
  const getPlantVisuals = (species: any) => {
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

  const { color, radius, symbol } = getPlantVisuals(species);

  // Draw plant circle
  ctx.fillStyle = isSelected ? '#0EA5E9' : color;
  ctx.strokeStyle = isSelected ? '#0284C7' : '#065F46';
  ctx.lineWidth = isSelected ? 3 : 2;
  
  if (isPreview) {
    ctx.setLineDash([3, 3]);
  }

  ctx.beginPath();
  ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  // Draw plant symbol/emoji
  ctx.font = `${radius}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  
  if (symbol.startsWith('�')) {
    // For emoji, make them slightly smaller
    ctx.font = `${radius * 0.8}px sans-serif`;
    ctx.fillText(symbol, screenX, screenY);
  } else {
    // For text symbols
    ctx.fillText(symbol, screenX, screenY);
  }

  // Draw selection highlight
  if (isSelected) {
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 2;
    ctx.setLineDash([2, 2]);
    ctx.stroke();
  }

  ctx.restore();
};

export const getPlantAtPosition = (
  placements: PlantPlacement[],
  bedRelativePos: { x: number; y: number },
  tolerance: number = 0.1
): PlantPlacement | null => {
  return placements.find(placement => 
    Math.abs(placement.position.x - bedRelativePos.x) < tolerance &&
    Math.abs(placement.position.y - bedRelativePos.y) < tolerance
  ) || null;
};
