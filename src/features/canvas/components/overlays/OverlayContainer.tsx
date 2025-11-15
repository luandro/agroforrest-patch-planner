
import React from 'react';
import { MiniMapOverlay } from './MiniMapOverlay';
import { FocusModeOverlay } from './FocusModeOverlay';
import { ControlsOverlay } from './ControlsOverlay';
import { ConfigurationOverlay } from './ConfigurationOverlay';
import type { CanvasLayoutSharedProps } from '../../types/layout.types';

interface OverlayContainerProps extends CanvasLayoutSharedProps {
  isMobile?: boolean;
}

export const OverlayContainer: React.FC<OverlayContainerProps> = (props) => {
  const {
    viewport,
    beds,
    pan,
    isInFocusMode,
    focusedBedId,
    onExitFocus,
    onOpenPlantSelection,
    onSelectPlantSpecies,
    onCancelPlantPlacement,
    isMobile = false
  } = props;

  // Navigation handler for mini-map
  const handleMiniMapNavigate = (x: number, y: number) => {
    const deltaX = x - viewport.centerX;
    const deltaY = y - viewport.centerY;
    pan(deltaX, deltaY);
  };

  return (
    <>
      {/* Mini-Map Overlay */}
      <MiniMapOverlay
        viewport={viewport}
        beds={beds}
        onNavigate={handleMiniMapNavigate}
        isVisible={!isInFocusMode}
      />

      {/* Focus Mode Overlay */}
      <FocusModeOverlay
        isVisible={isInFocusMode}
        focusedBedId={focusedBedId}
        onExitFocus={onExitFocus}
        onOpenPlantSelection={onOpenPlantSelection}
        onSelectSpecies={onSelectPlantSpecies}
        onCancelPlacement={onCancelPlantPlacement}
      />

      {/* Controls Overlay */}
      <ControlsOverlay
        {...props}
        isMobile={isMobile}
        isInFocusMode={isInFocusMode}
      />

      {/* Configuration Overlay */}
      <ConfigurationOverlay
        {...props}
        isInFocusMode={isInFocusMode}
      />
    </>
  );
};
