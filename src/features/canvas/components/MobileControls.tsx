
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
  isSaving = false
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

  return (
    <>
      {/* Context-sensitive FAB */}
      {shouldShowFAB && (
        <div className={cn(
          "fixed bottom-6 right-6 z-50 transition-all duration-300",
          isVisible && "translate-y-0 opacity-100",
          !isVisible && "translate-y-2 opacity-90"
        )}>
          {/* FAB Content Panel */}
          {isVisible && (
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
              isVisible && "scale-110"
            )}
            onClick={() => onToggle(!isVisible)}
            aria-label="Abrir controles contextuais"
          >
            <FABIcon activeTool={activeTool} selectedCount={selectedCount} />
          </Button>
        </div>
      )}

      {/* Save Status */}
      <SaveStatus isSaving={isSaving} />

      {/* Backdrop */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => onToggle(false)}
        />
      )}
    </>
  );
};
