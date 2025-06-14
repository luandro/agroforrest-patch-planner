
import React from 'react';
import { CanvasContainer } from './CanvasContainer';

interface CanvasViewportProps {
  viewport: any;
  tool: string;
  isCreating: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoomTo: (zoom: number) => void;
  beds: any[];
  selectedBedIds: string[];
  previewBed: any;
  placementBed?: any;
  gridSize?: number;
  bedConfig?: any;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = (props) => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <CanvasContainer
        {...props}
      />
    </div>
  );
};
