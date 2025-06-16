import React, { useRef, useEffect, useState } from 'react';
import { Patch } from '../types/patch.types';
import { Bed } from '../types/bed.types';
import { PlantPlacement } from '../stores/plantPlacementStore';
import { useGrowthTimelineContext } from '../providers/GrowthTimelineProvider';
import { renderOrchestrator } from '../utils/renderOrchestrator';

interface PatchPreviewCanvasProps {
  patch: Patch;
  beds: Bed[];
  placements: PlantPlacement[];
}

export const PatchPreviewCanvas: React.FC<PatchPreviewCanvasProps> = ({
  patch,
  beds,
  placements
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({
    zoom: 1,
    centerX: 0,
    centerY: 0,
    width: 800,
    height: 600
  });

  const { currentMonth } = useGrowthTimelineContext();

  // Initialize viewport to fit all content
  useEffect(() => {
    if (!containerRef.current || beds.length === 0) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Calculate bounds of all beds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    beds.forEach(bed => {
      const { x, y } = bed.position;
      let width, height;

      if (bed.shape === 'rectangle') {
        width = bed.dimensions.length || 0;
        height = bed.dimensions.width || 0;
      } else {
        const radius = bed.dimensions.radius || 0;
        width = height = radius * 2;
      }

      minX = Math.min(minX, x - width / 2);
      minY = Math.min(minY, y - height / 2);
      maxX = Math.max(maxX, x + width / 2);
      maxY = Math.max(maxY, y + height / 2);
    });

    // Add padding
    const padding = 2; // 2 meters padding
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    // Calculate zoom to fit content
    const zoomX = containerWidth / contentWidth;
    const zoomY = containerHeight / contentHeight;
    const zoom = Math.min(zoomX, zoomY, 2); // Max zoom of 2x

    // Center the content
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setViewport({
      zoom,
      centerX,
      centerY,
      width: containerWidth,
      height: containerHeight
    });
  }, [beds, containerRef.current?.clientWidth, containerRef.current?.clientHeight]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      setViewport(prev => ({
        ...prev,
        width: container.clientWidth,
        height: container.clientHeight
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewport.width * dpr;
    canvas.height = viewport.height * dpr;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, viewport.width, viewport.height);

    // Setup transform
    ctx.save();
    ctx.translate(viewport.width / 2, viewport.height / 2);
    ctx.scale(viewport.zoom, viewport.zoom);
    ctx.translate(-viewport.centerX, -viewport.centerY);

    // Render using the existing render orchestrator
    renderOrchestrator.renderFrame(ctx, {
      beds,
      placements,
      selectedBedIds: [],
      tool: 'select',
      isCreating: false,
      previewBed: null,
      placementBed: null,
      hasCollision: false,
      viewport,
      gridSize: 1,
      showGrid: false, // Hide grid for cleaner preview
      focusedBed: null,
      currentMonth
    });

    ctx.restore();
  }, [viewport, beds, placements, currentMonth]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-green-50 relative overflow-hidden print:bg-white"
      style={{ minHeight: '400px' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-default"
        style={{ 
          imageRendering: 'crisp-edges'
        }}
      />
      
      {/* Canvas watermark for print */}
      <div className="hidden print:block absolute bottom-2 right-2 text-xs text-gray-400">
        AgroForrest Patch Planner
      </div>
      
      {/* Loading state */}
      {beds.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-lg font-medium mb-2">Patch Vazio</div>
            <div className="text-sm">Nenhum canteiro foi criado ainda</div>
          </div>
        </div>
      )}
    </div>
  );
};
