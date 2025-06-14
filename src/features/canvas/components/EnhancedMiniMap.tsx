
import React, { useCallback } from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { cn } from '@/lib/utils';

interface EnhancedMiniMapProps {
  viewport: CanvasViewport;
  beds: Bed[];
  onNavigate: (x: number, y: number) => void;
  className?: string;
}

export const EnhancedMiniMap: React.FC<EnhancedMiniMapProps> = ({ 
  viewport, 
  beds, 
  onNavigate, 
  className 
}) => {
  const mapSize = 150; // Larger size for better visibility
  const totalArea = 100; // Total area we can navigate (100m x 100m)
  const scale = mapSize / totalArea;
  
  // Calculate viewport rectangle position and size
  const rectWidth = Math.max(6, viewport.width * scale);
  const rectHeight = Math.max(6, viewport.height * scale);
  
  const rectX = (viewport.centerX + totalArea / 2 - viewport.width / 2) * scale;
  const rectY = (viewport.centerY + totalArea / 2 - viewport.height / 2) * scale;

  // Handle click/tap to navigate
  const handleMapClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Convert click position to world coordinates
    const worldX = (clickX / scale) - totalArea / 2;
    const worldY = (clickY / scale) - totalArea / 2;
    
    onNavigate(worldX, worldY);
  }, [scale, totalArea, onNavigate]);

  // Render beds on minimap
  const renderBeds = () => {
    return beds.map(bed => {
      const bedX = (bed.position.x + totalArea / 2) * scale;
      const bedY = (bed.position.y + totalArea / 2) * scale;
      
      if (bed.shape === 'rectangle') {
        const length = (bed.dimensions.length || 1) * scale;
        const width = (bed.dimensions.width || 1) * scale;
        
        return (
          <rect
            key={bed.id}
            x={bedX - length / 2}
            y={bedY - width / 2}
            width={length}
            height={width}
            fill="#FEF3C7"
            stroke="#D97706"
            strokeWidth={0.5}
            opacity={0.8}
          />
        );
      } else {
        const radius = (bed.dimensions.radius || 0.5) * scale;
        
        return (
          <circle
            key={bed.id}
            cx={bedX}
            cy={bedY}
            r={radius}
            fill="#FEF3C7"
            stroke="#D97706"
            strokeWidth={0.5}
            opacity={0.8}
          />
        );
      }
    });
  };

  return (
    <div className={cn(
      "bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200",
      "transition-opacity duration-200 hover:opacity-100 opacity-80",
      className
    )}>
      <div className="text-xs text-gray-600 mb-2 font-medium">Mapa da Área</div>
      <div 
        className="relative border-2 border-gray-300 bg-gray-50 cursor-pointer rounded-sm overflow-hidden"
        style={{ width: mapSize, height: mapSize }}
        onClick={handleMapClick}
        title="Clique para navegar"
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
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
          
          {/* Render beds */}
          {renderBeds()}
        </svg>
        
        {/* Viewport indicator */}
        <div
          className="absolute border-2 border-blue-500 bg-blue-200/30 pointer-events-none rounded-sm"
          style={{
            left: Math.max(0, Math.min(mapSize - rectWidth, rectX)),
            top: Math.max(0, Math.min(mapSize - rectHeight, rectY)),
            width: rectWidth,
            height: rectHeight,
          }}
        />
        
        {/* Center crosshair */}
        <div 
          className="absolute w-1 h-1 bg-blue-600 rounded-full pointer-events-none"
          style={{
            left: mapSize / 2 - 2,
            top: mapSize / 2 - 2,
          }}
        />
      </div>
      
      {/* Stats */}
      <div className="mt-2 text-xs text-gray-500 space-y-1">
        <div>Canteiros: {beds.length}</div>
        <div>Zoom: {viewport.zoom.toFixed(1)}x</div>
      </div>
    </div>
  );
};
