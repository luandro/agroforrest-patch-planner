
import React from 'react';
import { MiniMap } from '../MiniMap';
import { useIsMobile } from '@/hooks/use-mobile';
import type { CanvasViewport } from '../../types/canvas.types';

interface MiniMapOverlayProps {
  viewport: CanvasViewport;
  isVisible: boolean;
}

export const MiniMapOverlay: React.FC<MiniMapOverlayProps> = ({
  viewport,
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
