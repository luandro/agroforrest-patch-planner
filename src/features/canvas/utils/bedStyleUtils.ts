
export const setBedStyles = (
  ctx: CanvasRenderingContext2D,
  isSelected: boolean,
  isPreview: boolean,
  isPlacement: boolean
) => {
  if (isPreview) {
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.9)'; // Brighter green preview
    ctx.fillStyle = 'rgba(34, 197, 94, 0.4)'; // 40% opacity for preview
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.shadowColor = 'rgba(34, 197, 94, 0.4)';
    ctx.shadowBlur = 8;
  } else if (isPlacement) {
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = '#16A34A'; // Solid green for placement
    ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    // Add stronger glow effect
    ctx.shadowColor = '#16A34A';
    ctx.shadowBlur = 12;
  } else {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FEF3C7'; // Light yellow-brown for beds
    ctx.strokeStyle = isSelected ? '#0EA5E9' : '#92400E'; // Blue if selected, dark brown otherwise
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.setLineDash([]);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }
};
