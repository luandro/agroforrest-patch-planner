
import React from 'react';
import { PatchCanvasProps } from '../types/canvas.types';
import { CanvasLayout } from './CanvasLayout';
import { usePatchCanvasOrchestrator } from '../hooks/usePatchCanvasOrchestrator';

export const PatchCanvas: React.FC<PatchCanvasProps> = (props) => {
  const { canvasRef, isCollapsed, onToggleCollapse, layoutProps } = usePatchCanvasOrchestrator(props);

  return (
    <CanvasLayout
      {...layoutProps}
      canvasRef={canvasRef}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
    />
  );
};

export default React.memo(PatchCanvas);
