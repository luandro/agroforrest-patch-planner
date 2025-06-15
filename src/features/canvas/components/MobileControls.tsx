
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CanvasTool, BedConfig } from '../types/bed.types';
import { FABContentMove } from './mobile/FABContentMove';
import { FABContentRectangle } from './mobile/FABContentRectangle';
import { FABContentSelect } from './mobile/FABContentSelect';
import { FABIcon } from './mobile/FABIcon';
import { SaveStatus } from './mobile/SaveStatus';

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
  onEnterFocus?: (bedId: string) => void;
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
  isVisible,
  onToggle,
  isSaving = false,
  showConfirmation = false,
  onEnterFocus,
  isInFocusMode = false
}) => {
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

  const shouldShowFAB = activeTool !== 'pan' || canUndo || canRedo;
  const isFABHidden = showConfirmation;

  return (
    <>
      {/* Context-sensitive FAB - Hide during confirmation */}
      {shouldShowFAB && (
        <div className={cn(
          "fixed bottom-6 right-6 z-50 transition-all duration-200",
          isVisible && !isFABHidden && "translate-y-0 opacity-100",
          isVisible && isFABHidden && "translate-y-0 opacity-0 pointer-events-none",
          !isVisible && !isFABHidden && "translate-y-2 opacity-90",
          !isVisible && isFABHidden && "translate-y-2 opacity-0 pointer-events-none"
        )}>
          {/* FAB Content Panel */}
          {isVisible && !isFABHidden && (
            <div className="mb-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 min-w-[280px] max-w-[320px]">
              {getFABContent()}
            </div>
          )}

          {/* FAB Button */}
          <Button
            className={cn(
              "w-14 h-14 rounded-full shadow-lg border-2 border-white transition-all duration-200 touch-manipulation",
              activeTool === 'create-rectangle' && "bg-green-600 hover:bg-green-700",
              activeTool === 'select' && selectedCount > 0 && "bg-orange-600 hover:bg-orange-700",
              activeTool === 'select' && selectedCount === 0 && "bg-gray-500 hover:bg-gray-600",
              activeTool === 'pan' && "bg-blue-600 hover:bg-blue-700",
              isVisible && !isFABHidden && "scale-110",
              isFABHidden && "pointer-events-none"
            )}
            onClick={() => !isFABHidden && onToggle(!isVisible)}
            disabled={isFABHidden}
            aria-label="Abrir controles contextuais"
          >
            <FABIcon activeTool={activeTool} selectedCount={selectedCount} />
          </Button>
        </div>
      )}

      {/* Save Status */}
      <SaveStatus isSaving={isSaving} />

      {/* Backdrop - Only show when FAB panel is visible and not during confirmation */}
      {isVisible && !isFABHidden && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => onToggle(false)}
        />
      )}
    </>
  );
};
