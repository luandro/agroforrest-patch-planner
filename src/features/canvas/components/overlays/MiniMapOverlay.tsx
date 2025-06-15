
import React from 'react';
import { MiniMap } from '../MiniMap';
import { MobileMiniMap } from '../mobile/MobileMiniMap';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  if (!isVisible) {
    return null;
  }

  if (isMobile) {
    return (
      <MobileMiniMap
        viewport={viewport}
        beds={beds}
        onNavigate={onNavigate}
        className="fixed bottom-6 left-4 z-30"
      />
    );
  }

  return (
    <MiniMap
      viewport={viewport}
      className="fixed bottom-4 left-4 z-30"
    />
  );
};
