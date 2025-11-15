
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { OverlayContainer } from './overlays/OverlayContainer';
import type { CanvasLayoutSharedProps } from '../types/layout.types';

interface CanvasOverlaysProps extends CanvasLayoutSharedProps {
  isMobile?: boolean;
}

export const CanvasOverlays: React.FC<CanvasOverlaysProps> = (props) => {
  const isMobile = useIsMobile();

  return (
    <OverlayContainer
      {...props}
      isMobile={isMobile}
    />
  );
};
