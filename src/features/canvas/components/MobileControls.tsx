
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CanvasTool, BedConfig } from '../types/bed.types';
import { FABContentMove } from './mobile/FABContentMove';
import { FABContentRectangle } from './mobile/FABContentRectangle';
import { FABContentSelect } from './mobile/FABContentSelect';
import { FABIcon } from './mobile/FABIcon';

interface MobileControlsProps {
  activeTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  bedConfig: BedConfig;
  onBedConfigChange: (updates: Partial<BedConfig>) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDeleteSelected: () => void;
  selectedCount: number;
  isVisible: boolean;
  onToggle: (visible: boolean) => void;
  isSaving?: boolean;
  showConfirmation?: boolean;
  isInFocusMode?: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  activeTool,
  onToolChange,
  bedConfig,
  onBedConfigChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onDeleteSelected,
  selectedCount,
  isSaving = false,
  showConfirmation = false,
  isInFocusMode = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't render in focus mode
  if (isInFocusMode) {
    return null;
  }

  const getFABContent = () => {
    if (activeTool === 'pan') {
      return (
        <FABContentMove
          onUndo={onUndo}
          onRedo={onRedo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      );
    }

    if (activeTool === 'create-rectangle') {
      return (
        <FABContentRectangle
          bedConfig={bedConfig}
          onBedConfigChange={onBedConfigChange}
        />
      );
    }

    if (activeTool === 'select') {
      return (
        <FABContentSelect
          selectedCount={selectedCount}
          onDeleteSelected={onDeleteSelected}
        />
      );
    }

    return null;
  };

  // Only show FAB when there's contextual content or actions available
  const shouldShowFAB = (activeTool !== 'pan' || canUndo || canRedo) && !showConfirmation;

  if (!shouldShowFAB) {
    return null;
  }

  return (
    <>
      {/* Context Panel - Bottom sheet style */}
      {isMenuOpen && (
        <div className="fixed inset-x-4 bottom-24 z-40 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 p-4 max-w-sm mx-auto">
          {getFABContent()}
        </div>
      )}

      {/* FAB Button - Fixed bottom right */}
      <Button
        className={cn(
          "fixed bottom-6 right-6 z-40 rounded-full shadow-lg border-2 border-white",
          "w-16 h-16 touch-manipulation active:scale-95 transition-all duration-200",
          // Tool-specific colors
          activeTool === 'create-rectangle' && "bg-green-600 hover:bg-green-700",
          activeTool === 'select' && selectedCount > 0 && "bg-orange-600 hover:bg-orange-700",
          activeTool === 'select' && selectedCount === 0 && "bg-gray-500 hover:bg-gray-600",
          activeTool === 'pan' && "bg-blue-600 hover:bg-blue-700"
        )}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Abrir controles contextuais"
      >
        <FABIcon activeTool={activeTool} selectedCount={selectedCount} />
      </Button>

      {/* Backdrop for menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[39] touch-manipulation"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};
