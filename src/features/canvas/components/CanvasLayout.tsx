
import React from 'react';
import { CanvasLayoutProvider } from './CanvasLayoutProvider';
import { CanvasViewport } from './CanvasViewport';
import { CanvasOverlays } from './CanvasOverlays';
import type { CanvasLayoutSharedProps } from '../types/layout.types';

export const CanvasLayout: React.FC<CanvasLayoutSharedProps> = (props) => {
  // DEBUG: Log focusedBed and focus mode props
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[CanvasLayout] focusedBedId", props.focusedBedId, "focusedBed", props.focusedBed);
  }

  return (
    <CanvasLayoutProvider {...props}>
      <CanvasViewport 
        viewport={props.viewport}
        beds={props.beds}
        selectedBedIds={props.selectedBedIds}
        tool={props.tool}
        isCreating={props.isCreating}
        previewBed={props.previewBed}
        placementBed={props.placementBed}
        previewBeds={props.previewBeds}
        placementBeds={props.placementBeds}
        hasCollision={props.hasCollision}
        handlePointerDown={props.handlePointerDown}
        handlePointerMove={props.handlePointerMove}
        handlePointerUp={props.handlePointerUp}
        handleDoubleClick={props.handleDoubleClick}
        pan={props.pan}
        zoomTo={props.zoomTo}
        bedConfig={props.bedConfig}
        gridSize={props.gridSize}
        canvasRef={props.canvasRef}
        focusedBed={props.focusedBed}
      />
      <CanvasOverlays {...props} />
    </CanvasLayoutProvider>
  );
};
