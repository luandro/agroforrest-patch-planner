
import React from 'react';
import { SaveStatus } from './SaveStatus';
import { MobileMiniMap } from './MobileMiniMap';

interface BedCreationStatusBarProps {
  isSaving: boolean;
  viewport: any;
  beds: any[];
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

      {/* Minimap - Top left */}
      <div className="fixed top-20 left-4 z-30">
        <MobileMiniMap
          viewport={viewport}
          beds={beds}
          onNavigate={onNavigate}
        />
      </div>
    </>
  );
};
