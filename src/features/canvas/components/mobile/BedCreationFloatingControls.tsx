
import React from 'react';
import { CanvasTool } from '../../types/bed.types';
import { MobileFloatingZoom } from './MobileFloatingZoom';
import { MobileBedConfigButton } from './MobileBedConfigButton';

interface BedCreationFloatingControlsProps {
  activeTool: CanvasTool;
  bedConfig: any;
  viewport: any;
  beds: any[];
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitAll: () => void;
  onOpenBedConfig: () => void;
}

export const BedCreationFloatingControls: React.FC<BedCreationFloatingControlsProps> = ({
  activeTool,
  bedConfig,
  viewport,
  beds,
  onZoomIn,
  onZoomOut,
  onFitAll,
  onOpenBedConfig
}) => {
  return (
    <>
      {/* Floating Zoom Controls */}
      <MobileFloatingZoom
        zoom={viewport.zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFitAll={onFitAll}
        bedsCount={beds.length}
      />

      {/* Bed Configuration Button - Only show when Canteiro tool is selected */}
      {activeTool === 'create-rectangle' && (
        <MobileBedConfigButton
          onOpenConfig={onOpenBedConfig}
          bedConfig={bedConfig}
        />
      )}
    </>
  );
};
