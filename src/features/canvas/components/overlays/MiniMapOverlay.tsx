
import React from 'react';
import { MiniMap } from '../MiniMap';
import { MobileMiniMap } from '../mobile/MobileMiniMap';
import { useIsMobile } from '@/hooks/use-mobile';
import type { CanvasViewport } from '../../types/canvas.types';
import type { Bed } from '../../types/bed.types';

interface MiniMapOverlayProps {
  viewport: CanvasViewport;
  beds: Bed[];
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

  // Always show minimap on mobile - it's handled in MobileLayout
  if (isMobile) {
    return null; // Handled by MobileLayout
  }

  if (!isVisible) {
    return null;
  }

  return (
    <MiniMap
      viewport={viewport}
      className="fixed bottom-4 left-4 z-30"
    />
  );
};
