
import React from 'react';
import { BedConfirmationPanel } from './BedConfirmationPanel';
import { CollisionAlert } from './CollisionAlert';
import { CanvasTool } from '../types/bed.types';

interface CanvasOverlaysProps {
  tool: CanvasTool;
  isCreating: boolean;
  showConfirmation: boolean;
  placementBed: any;
  placementBeds?: any[];
  bedConfig: any;
  multiCreationMode: boolean;
  setMultiCreationMode: (enabled: boolean) => void;
  handleConfirmPlacement: () => void;
  handleCancelPlacement: () => void;
  hasCollision?: boolean;
  isMobile?: boolean;
}

export const CanvasOverlays: React.FC<CanvasOverlaysProps> = ({
  tool,
  isCreating,
  showConfirmation,
  placementBed,
  placementBeds,
  bedConfig,
  multiCreationMode,
  setMultiCreationMode,
  handleConfirmPlacement,
  handleCancelPlacement,
  hasCollision = false,
  isMobile = false
}) => {
  return (
    <>
      {/* Creation Mode Indicator */}
      {(isCreating || tool === 'create-rectangle' || tool === 'create-circle') && !hasCollision && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-full text-sm font-medium animate-fade-in">
            Modo Criação • {tool === 'create-rectangle' ? 'Retângulo' : 'Círculo'}
          </div>
        </div>
      )}

      {/* Collision Alert */}
      <CollisionAlert hasCollision={hasCollision} />

      {/* Multi-bed indicator */}
      {(isCreating || showConfirmation) && bedConfig.quantity > 1 && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-blue-100 border border-blue-300 text-blue-800 px-3 py-1 rounded-full text-sm font-medium animate-fade-in">
            📐 {bedConfig.quantity} canteiros • Espaçamento: {bedConfig.spacing}m
          </div>
        </div>
      )}

      {/* Bed Confirmation Panel */}
      {showConfirmation && placementBed && (
        <BedConfirmationPanel
          bed={placementBed}
          beds={placementBeds}
          bedConfig={bedConfig}
          multiCreationMode={multiCreationMode}
          onMultiCreationToggle={setMultiCreationMode}
          onConfirm={handleConfirmPlacement}
          onCancel={handleCancelPlacement}
          hasCollision={hasCollision}
          className={isMobile ? '' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'}
        />
      )}
    </>
  );
};
