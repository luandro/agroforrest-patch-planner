
import React, { useEffect, useRef } from 'react';
import { Bed } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';

interface BedRendererProps {
  beds: Bed[];
  selectedBedIds: string[];
  viewport: CanvasViewport;
  previewBed?: Bed | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const BedRenderer: React.FC<BedRendererProps> = ({
  beds,
  selectedBedIds,
  viewport,
  previewBed,
  canvasRef
}) => {
  const animationRef = useRef<number>();

  const drawBed = (
    ctx: CanvasRenderingContext2D, 
    bed: Bed, 
    isSelected: boolean = false,
    isPreview: boolean = false
  ) => {
    const pixelsPerMeter = 50 * viewport.zoom;
    const canvasWidth = ctx.canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = ctx.canvas.height / (window.devicePixelRatio || 1);
    
    // Convert world coordinates to screen coordinates
    const screenX = (canvasWidth / 2) + (bed.position.x - viewport.centerX) * pixelsPerMeter;
    const screenY = (canvasHeight / 2) - (bed.position.y - viewport.centerY) * pixelsPerMeter;

    ctx.save();

    // Set styles
    if (isPreview) {
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = '#3B82F6';
      ctx.fillStyle = '#DBEAFE';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
    } else {
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#D4A574'; // Light brown for beds
      ctx.strokeStyle = isSelected ? '#0EA5E9' : '#92400E'; // Blue if selected, dark brown otherwise
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.setLineDash([]);
    }

    if (bed.shape === 'rectangle') {
      const length = (bed.dimensions.length || 0) * pixelsPerMeter;
      const width = (bed.dimensions.width || 0) * pixelsPerMeter;
      
      ctx.fillRect(screenX - length / 2, screenY - width / 2, length, width);
      ctx.strokeRect(screenX - length / 2, screenY - width / 2, length, width);
      
      // Draw resize handles if selected
      if (isSelected && !isPreview) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#0EA5E9';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        
        const handleSize = 8;
        const handles = [
          { x: screenX - length / 2, y: screenY - width / 2 }, // Top-left
          { x: screenX + length / 2, y: screenY - width / 2 }, // Top-right
          { x: screenX - length / 2, y: screenY + width / 2 }, // Bottom-left
          { x: screenX + length / 2, y: screenY + width / 2 }  // Bottom-right
        ];
        
        handles.forEach(handle => {
          ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
          ctx.strokeRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
        });
      }
    } else {
      const radius = (bed.dimensions.radius || 0) * pixelsPerMeter;
      
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Draw resize handle if selected
      if (isSelected && !isPreview) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#0EA5E9';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        
        const handleSize = 8;
        ctx.fillRect(screenX + radius - handleSize / 2, screenY - handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(screenX + radius - handleSize / 2, screenY - handleSize / 2, handleSize, handleSize);
      }
    }

    ctx.restore();
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the beds layer (preserve grid)
    const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
    
    // Only clear the area where beds are drawn
    // We'll overlay beds on top of the existing grid
    
    // Draw all beds
    beds.forEach(bed => {
      const isSelected = selectedBedIds.includes(bed.id);
      drawBed(ctx, bed, isSelected);
    });

    // Draw preview bed if it exists
    if (previewBed) {
      drawBed(ctx, previewBed, false, true);
    }
  };

  useEffect(() => {
    const scheduleRender = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(render);
    };

    scheduleRender();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [beds, selectedBedIds, viewport, previewBed]);

  return null; // This component only renders to canvas
};
