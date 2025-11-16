
import React from 'react';
import { SaveStatus } from './SaveStatus';
import { MobileMiniMap } from './MobileMiniMap';
import { CanvasViewport } from '../../types/canvas.types';
import { Bed } from '../../types/bed.types';

interface BedCreationStatusBarProps {
  isSaving: boolean;
  viewport: CanvasViewport;
  beds: Bed[];
  onNavigate: (x: number, y: number) => void;
}

export const BedCreationStatusBar: React.FC<BedCreationStatusBarProps> = ({
  isSaving,
  viewport,
  beds,
  onNavigate
}) => {
  return (
    <>
      {/* Save Status - Top right */}
      <div className="fixed top-20 right-4 z-30">
        <SaveStatus isSaving={isSaving} />
      </div>

      {/* Minimap - Top right, below save status */}
      <div className="fixed top-32 right-4 z-30">
        <MobileMiniMap
          viewport={viewport}
          beds={beds}
          onNavigate={onNavigate}
        />
      </div>
    </>
  );
};
