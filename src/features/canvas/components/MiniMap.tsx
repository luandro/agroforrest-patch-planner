
import React from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { cn } from '@/lib/utils';

interface MiniMapProps {
  viewport: CanvasViewport;
  className?: string;
}

export const MiniMap: React.FC<MiniMapProps> = ({ viewport, className }) => {
  const mapSize = 80; // Size of minimap in pixels
  const totalArea = 100; // Total area we can navigate (100m x 100m)
  
  // Calculate viewport rectangle position and size
  const viewportSize = Math.max(viewport.width, viewport.height);
  const scale = mapSize / totalArea;
  
  const rectWidth = Math.max(4, viewport.width * scale);
  const rectHeight = Math.max(4, viewport.height * scale);
  
  const rectX = (viewport.centerX + totalArea / 2 - viewport.width / 2) * scale;
  const rectY = (viewport.centerY + totalArea / 2 - viewport.height / 2) * scale;

  return (
    <div className={cn(
      "absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg",
      className
    )}>
      <div className="text-xs text-gray-600 mb-1">Área</div>
      <div 
        className="relative border border-gray-300 bg-gray-50"
        style={{ width: mapSize, height: mapSize }}
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Vertical lines every 20m */}
          {[20, 40, 60, 80].map(x => (
            <line
              key={`v-${x}`}
              x1={x * scale}
              y1={0}
              x2={x * scale}
              y2={mapSize}
              stroke="#E5E7EB"
              strokeWidth={0.5}
            />
          ))}
          {/* Horizontal lines every 20m */}
          {[20, 40, 60, 80].map(y => (
            <line
              key={`h-${y}`}
              x1={0}
              y1={y * scale}
              x2={mapSize}
              y2={y * scale}
              stroke="#E5E7EB"
              strokeWidth={0.5}
            />
          ))}
        </svg>
        
        {/* Viewport indicator */}
        <div
          className="absolute border-2 border-blue-500 bg-blue-200/30"
          style={{
            left: Math.max(0, Math.min(mapSize - rectWidth, rectX)),
            top: Math.max(0, Math.min(mapSize - rectHeight, rectY)),
            width: rectWidth,
            height: rectHeight,
          }}
        />
      </div>
    </div>
  );
};
