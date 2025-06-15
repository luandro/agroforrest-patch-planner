
import React from 'react';
import { EnhancedMiniMap } from '../EnhancedMiniMap';

interface MiniMapOverlayProps {
  viewport: any;
  beds: any[];
  onNavigate: (x: number, y: number) => void;
  isVisible: boolean;
}

export const MiniMapOverlay: React.FC<MiniMapOverlayProps> = ({
  viewport,
  beds,
  onNavigate,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <EnhancedMiniMap
      viewport={viewport}
      beds={beds}
      onNavigate={onNavigate}
      className="fixed bottom-4 left-4 z-30"
    />
  );
};
