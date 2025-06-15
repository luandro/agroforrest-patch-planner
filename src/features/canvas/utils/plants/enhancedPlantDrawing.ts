
import { getEnhancedPlantVisuals, calculateShadowEffects } from './enhancedPlantVisuals';
import { PlantPlacement } from '../../stores/plantPlacementStore';

export const drawEnhancedPlant = (
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  species: any = null,
  isSelected: boolean = false,
  isPreview: boolean = false,
  isHovered: boolean = false,
  growthMonth?: number,
  environmentalStress: number = 0,
  shadowIntensity: number = 0
) => {
  ctx.save();

  const visuals = getEnhancedPlantVisuals(species, growthMonth, environmentalStress);

  if (isPreview) {
    ctx.globalAlpha = 0.7;
  } else {
    ctx.globalAlpha = visuals.opacity;
  }

  // Desenhar sombra no solo se a planta projeta sombra
  if (shadowIntensity > 0.1 && !isPreview) {
    drawGroundShadow(ctx, screenX, screenY, visuals.radius, shadowIntensity);
  }

  // Efeito de seleção melhorado
  if (isSelected) {
    ctx.shadowColor = '#0EA5E9';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  } else if (isHovered) {
    ctx.shadowColor = '#64748B';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // Desenhar círculo da planta com gradiente para simular volume
  drawPlantCircleWithGradient(
    ctx,
    screenX,
    screenY,
    visuals.radius,
    visuals.color,
    isSelected,
    isHovered,
    isPreview,
    visuals.lightPenetration
  );

  // Reset shadow para símbolo
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Desenhar símbolo/emoji da planta
  drawPlantSymbol(ctx, screenX, screenY, visuals.radius, visuals.symbol, isSelected, visuals.color);

  // Indicador de stress se houver
  if (environmentalStress > 0.3 && !isPreview) {
    drawStressIndicator(ctx, screenX, screenY, visuals.radius, environmentalStress);
  }

  // Handles de seleção melhorados
  if (isSelected) {
    drawEnhancedSelectionHandles(ctx, screenX, screenY, visuals.radius);
  }

  // Anel de hover melhorado
  if (isHovered && !isSelected) {
    drawHoverRing(ctx, screenX, screenY, visuals.radius);
  }

  ctx.restore();
};

const drawGroundShadow = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  plantRadius: number,
  intensity: number
) => {
  ctx.save();
  
  const shadowRadius = plantRadius * 1.2;
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, shadowRadius
  );
  
  gradient.addColorStop(0, `rgba(0, 0, 0, ${intensity * 0.3})`);
  gradient.addColorStop(0.7, `rgba(0, 0, 0, ${intensity * 0.1})`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, shadowRadius, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.restore();
};

const drawPlantCircleWithGradient = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  color: string,
  isSelected: boolean,
  isHovered: boolean,
  isPreview: boolean,
  lightPenetration: number
) => {
  // Criar gradiente radial para simular volume da copa
  const gradient = ctx.createRadialGradient(
    centerX - radius * 0.3, centerY - radius * 0.3, 0,
    centerX, centerY, radius
  );
  
  // Cor mais clara no topo (luz solar)
  const lightColor = lightenColor(color, 20);
  const shadowColor = darkenColor(color, 15);
  
  gradient.addColorStop(0, lightColor);
  gradient.addColorStop(0.6, color);
  gradient.addColorStop(1, shadowColor);

  // Configurar estilos baseado no estado
  if (isSelected) {
    ctx.fillStyle = '#0EA5E9';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 4;
  } else if (isHovered) {
    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3;
  } else {
    ctx.fillStyle = gradient;
    ctx.strokeStyle = darkenColor(color, 30);
    ctx.lineWidth = 2;
  }
  
  if (isPreview) {
    ctx.setLineDash([4, 4]);
  }

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Desenhar indicador de penetração de luz se relevante
  if (lightPenetration < 50 && !isPreview) {
    drawLightPenetrationIndicator(ctx, centerX, centerY, radius, lightPenetration);
  }
};

const drawPlantSymbol = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  symbol: string,
  isSelected: boolean,
  color: string
) => {
  ctx.font = `${Math.max(12, radius * 0.8)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isSelected ? 'white' : (isLightColor(color) ? '#000' : 'white');
  
  if (symbol.match(/[\u{1F300}-\u{1F9FF}]/u)) {
    // Para emojis, fazer ligeiramente menor
    ctx.font = `${Math.max(10, radius * 0.7)}px sans-serif`;
  }
  
  ctx.fillText(symbol, centerX, centerY);
};

const drawStressIndicator = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  stress: number
) => {
  const indicatorSize = 6;
  const offsetX = radius * 0.7;
  const offsetY = -radius * 0.7;
  
  ctx.beginPath();
  ctx.arc(centerX + offsetX, centerY + offsetY, indicatorSize, 0, 2 * Math.PI);
  
  // Cor baseada no nível de stress
  if (stress > 0.7) {
    ctx.fillStyle = '#EF4444'; // Vermelho para stress alto
  } else if (stress > 0.4) {
    ctx.fillStyle = '#F59E0B'; // Amarelo para stress médio
  } else {
    ctx.fillStyle = '#F97316'; // Laranja para stress baixo
  }
  
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Adicionar símbolo de alerta
  ctx.fillStyle = 'white';
  ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', centerX + offsetX, centerY + offsetY);
};

const drawLightPenetrationIndicator = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  lightPenetration: number
) => {
  // Desenhar pequenos pontos para mostrar densidade da folhagem
  const density = (100 - lightPenetration) / 100;
  const numDots = Math.floor(density * 8);
  
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  
  for (let i = 0; i < numDots; i++) {
    const angle = (i / numDots) * 2 * Math.PI;
    const distance = radius * 0.5 * Math.random();
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  ctx.restore();
};

const drawEnhancedSelectionHandles = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) => {
  const handleSize = 6;
  const handleOffset = radius + 10;
  
  ctx.fillStyle = '#0EA5E9';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.setLineDash([]);

  // Handles nos pontos cardeais
  const positions = [
    { x: centerX - handleOffset, y: centerY },
    { x: centerX + handleOffset, y: centerY },
    { x: centerX, y: centerY - handleOffset },
    { x: centerX, y: centerY + handleOffset }
  ];

  positions.forEach(pos => {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, handleSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  });
  
  // Badge de seleção no canto superior direito
  ctx.beginPath();
  ctx.arc(centerX + radius - 4, centerY - radius + 4, 8, 0, 2 * Math.PI);
  ctx.fillStyle = '#0EA5E9';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Checkmark no badge
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(centerX + radius - 8, centerY - radius + 4);
  ctx.lineTo(centerX + radius - 5, centerY - radius + 7);
  ctx.lineTo(centerX + radius - 1, centerY - radius + 1);
  ctx.stroke();
};

const drawHoverRing = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) => {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  
  // Segundo anel mais sutil
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.stroke();
};

// Funções auxiliares de cor
const lightenColor = (color: string, percent: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const newR = Math.min(255, Math.round(r + (255 - r) * percent / 100));
  const newG = Math.min(255, Math.round(g + (255 - g) * percent / 100));
  const newB = Math.min(255, Math.round(b + (255 - b) * percent / 100));
  
  return `rgb(${newR}, ${newG}, ${newB})`;
};

const darkenColor = (color: string, percent: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const newR = Math.round(r * (1 - percent / 100));
  const newG = Math.round(g * (1 - percent / 100));
  const newB = Math.round(b * (1 - percent / 100));
  
  return `rgb(${newR}, ${newG}, ${newB})`;
};

const isLightColor = (color: string): boolean => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};
