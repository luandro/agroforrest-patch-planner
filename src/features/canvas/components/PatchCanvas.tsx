
import React from 'react';
import { PatchCanvasProps } from '../types/canvas.types';
import { CanvasLayout } from './CanvasLayout';
import { usePatchCanvasOrchestrator } from '../hooks/usePatchCanvasOrchestrator';
import { CanvasErrorBoundary } from '@/components/ErrorBoundary';

export const PatchCanvas: React.FC<PatchCanvasProps> = (props) => {
  const { canvasRef, isCollapsed, onToggleCollapse, layoutProps } = usePatchCanvasOrchestrator(props);

  return (
    <CanvasErrorBoundary>
      <CanvasLayout
        {...layoutProps}
        canvasRef={canvasRef}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
    </CanvasErrorBoundary>
  );
};

export default React.memo(PatchCanvas);
