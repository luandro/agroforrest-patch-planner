
import React from 'react';
import { BedConfirmationPanel } from './BedConfirmationPanel';
import { CanvasTool } from '../types/bed.types';

interface CanvasOverlaysProps {
  tool: CanvasTool;
  isCreating: boolean;
  showConfirmation: boolean;
  placementBed: any;
  bedConfig: any;
  multiCreationMode: boolean;
  setMultiCreationMode: (enabled: boolean) => void;
  handleConfirmPlacement: () => void;
  handleCancelPlacement: () => void;
  isMobile?: boolean;
}

export const CanvasOverlays: React.FC<CanvasOverlaysProps> = ({
  tool,
  isCreating,
  showConfirmation,
  placementBed,
  bedConfig,
  multiCreationMode,
  setMultiCreationMode,
  handleConfirmPlacement,
  handleCancelPlacement,
  isMobile = false
}) => {
  return (
    <>
      {/* Creation Mode Indicator */}
      {(isCreating || tool === 'create-rectangle' || tool === 'create-circle') && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-full text-sm font-medium animate-fade-in">
            Modo Criação • {tool === 'create-rectangle' ? 'Retângulo' : 'Círculo'}
          </div>
        </div>
      )}

      {/* Bed Confirmation Panel */}
      {showConfirmation && placementBed && (
        <BedConfirmationPanel
          bed={placementBed}
          bedConfig={bedConfig}
          multiCreationMode={multiCreationMode}
          onMultiCreationToggle={setMultiCreationMode}
          onConfirm={handleConfirmPlacement}
          onCancel={handleCancelPlacement}
          className={isMobile ? '' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'}
        />
      )}
    </>
  );
};
