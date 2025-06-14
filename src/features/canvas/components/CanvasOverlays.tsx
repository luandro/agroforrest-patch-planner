
import React, { useEffect, useState } from 'react';
import { BedConfirmationPanel } from './BedConfirmationPanel';
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
  const [showCollisionAlert, setShowCollisionAlert] = useState(false);
  const [alertTimeout, setAlertTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle collision alert timing
  useEffect(() => {
    if (hasCollision && (isCreating || showConfirmation)) {
      // Clear any existing timeout
      if (alertTimeout) {
        clearTimeout(alertTimeout);
      }
      
      // Show alert immediately
      setShowCollisionAlert(true);
      
      // Auto-hide after 1.5 seconds
      const timeout = setTimeout(() => {
        setShowCollisionAlert(false);
      }, 1500);
      
      setAlertTimeout(timeout);
    } else {
      // Hide alert immediately when collision is resolved
      setShowCollisionAlert(false);
      if (alertTimeout) {
        clearTimeout(alertTimeout);
        setAlertTimeout(null);
      }
    }

    // Cleanup timeout on unmount
    return () => {
      if (alertTimeout) {
        clearTimeout(alertTimeout);
      }
    };
  }, [hasCollision, isCreating, showConfirmation]);

  return (
    <>
      {/* Creation Mode Indicator */}
      {(isCreating || tool === 'create-rectangle' || tool === 'create-circle') && !showCollisionAlert && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-full text-sm font-medium animate-fade-in">
            Modo Criação • {tool === 'create-rectangle' ? 'Retângulo' : 'Círculo'}
          </div>
        </div>
      )}

      {/* Collision Alert - with improved timing and positioning */}
      {showCollisionAlert && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-50">
          <div 
            className="bg-red-500 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg animate-fade-in max-w-xs mx-auto"
            style={{
              animation: 'fadeInOut 1.5s ease-in-out'
            }}
          >
            ❌ Posição inválida - sobreposição detectada
          </div>
        </div>
      )}

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

      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
};
