
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
      {/* Context-sensitive FAB - Fixed positioning for mobile */}
      {shouldShowFAB && (
        <div className={cn(
          "fixed z-40 transition-all duration-200",
          // Better mobile positioning - ensure it doesn't overlap with other controls
          "bottom-20 right-4",
          // Responsive adjustments
          "sm:bottom-6 sm:right-6",
          isVisible && !isFABHidden && "translate-y-0 opacity-100",
          isVisible && isFABHidden && "translate-y-0 opacity-0 pointer-events-none",
          !isVisible && !isFABHidden && "translate-y-2 opacity-90",
          !isVisible && isFABHidden && "translate-y-2 opacity-0 pointer-events-none"
        )}>
          {/* FAB Content Panel - Improved mobile layout */}
          {isVisible && !isFABHidden && (
            <div className={cn(
              "mb-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200",
              // Better mobile sizing and positioning
              "p-3 sm:p-4",
              "min-w-[260px] max-w-[300px]",
              "sm:min-w-[280px] sm:max-w-[320px]"
            )}>
              {getFABContent()}
            </div>
          )}

          {/* FAB Button - Enhanced touch targets */}
          <Button
            className={cn(
              "rounded-full shadow-lg border-2 border-white transition-all duration-200",
              // Larger touch targets for mobile
              "w-16 h-16 sm:w-14 sm:h-14",
              "touch-manipulation",
              // Ensure proper tap behavior
              "active:scale-95",
              activeTool === 'create-rectangle' && "bg-green-600 hover:bg-green-700 active:bg-green-800",
              activeTool === 'select' && selectedCount > 0 && "bg-orange-600 hover:bg-orange-700 active:bg-orange-800",
              activeTool === 'select' && selectedCount === 0 && "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
              activeTool === 'pan' && "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
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

      {/* Save Status - Better mobile positioning */}
      <div className="fixed top-20 right-4 z-30">
        <SaveStatus isSaving={isSaving} />
      </div>

      {/* Backdrop - Proper z-index and mobile optimization */}
      {isVisible && !isFABHidden && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 touch-manipulation"
          onClick={() => onToggle(false)}
        />
      )}
    </>
  );
};
