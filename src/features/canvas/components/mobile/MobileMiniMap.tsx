
import React from 'react';
import { CanvasViewport } from '../../types/canvas.types';
import { cn } from '@/lib/utils';

interface MobileMiniMapProps {
  viewport: CanvasViewport;
  beds: any[];
  onNavigate: (x: number, y: number) => void;
  className?: string;
}

export const MobileMiniMap: React.FC<MobileMiniMapProps> = ({ 
  viewport, 
  beds,
  onNavigate,
  className 
}) => {
  const mapSize = 60; // Smaller on mobile
  const totalArea = 100;
  
  const scale = mapSize / totalArea;
  const rectWidth = Math.max(3, viewport.width * scale);
  const rectHeight = Math.max(3, viewport.height * scale);
  
  const rectX = (viewport.centerX + totalArea / 2 - viewport.width / 2) * scale;
  const rectY = (viewport.centerY + totalArea / 2 - viewport.height / 2) * scale;

  const handleMapClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const worldX = (clickX / scale) - totalArea / 2;
    const worldY = (clickY / scale) - totalArea / 2;
    
    onNavigate(worldX, worldY);
  };

  return (
    <div className={cn(
      "bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200",
      className
    )}>
      <div className="text-xs text-gray-600 mb-1">Área</div>
      <div 
        className="relative border border-gray-300 bg-gray-50 cursor-pointer touch-manipulation"
        style={{ width: mapSize, height: mapSize }}
        onClick={handleMapClick}
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
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
          className="absolute border-2 border-blue-500 bg-blue-200/30 pointer-events-none"
          style={{
            left: Math.max(0, Math.min(mapSize - rectWidth, rectX)),
            top: Math.max(0, Math.min(mapSize - rectHeight, rectY)),
            width: rectWidth,
            height: rectHeight,
          }}
        />
        
        {/* Bed indicators */}
        {beds.map((bed, index) => {
          const bedX = (bed.position.x + totalArea / 2) * scale;
          const bedY = (bed.position.y + totalArea / 2) * scale;
          
          if (bedX < 0 || bedX > mapSize || bedY < 0 || bedY > mapSize) return null;
          
          return (
            <div
              key={bed.id || index}
              className="absolute w-1 h-1 bg-green-500 rounded-full pointer-events-none"
              style={{
                left: bedX - 0.5,
                top: bedY - 0.5,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
