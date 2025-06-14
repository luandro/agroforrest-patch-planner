
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  className?: string;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  className
}) => {
  return (
    <div className={cn(
      "absolute top-4 right-4 flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg",
      className
    )}>
      {/* Zoom Level Indicator */}
      <div className="text-xs text-gray-600 text-center px-2 py-1">
        {zoom.toFixed(1)}x
      </div>
      
      {/* Zoom In */}
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        className="w-10 h-10 p-0 touch-manipulation"
        aria-label="Aumentar zoom"
      >
        <span className="text-lg font-bold">+</span>
      </Button>
      
      {/* Zoom Out */}
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        className="w-10 h-10 p-0 touch-manipulation"
        aria-label="Diminuir zoom"
      >
        <span className="text-lg font-bold">−</span>
      </Button>
      
      {/* Reset View */}
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="w-10 h-10 p-0 text-xs touch-manipulation"
        aria-label="Resetar visualização"
      >
        ⌂
      </Button>
    </div>
  );
};
