
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CanvasTool, BedConfig, Bed } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';
import { 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BedConfigurationPanel } from './desktop/BedConfigurationPanel';
import { StatisticsPanel } from './desktop/StatisticsPanel';
import { ActionsPanel } from './desktop/ActionsPanel';

interface DesktopSidebarProps {
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
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  isSaving?: boolean;
  beds: Bed[];
  viewport: CanvasViewport;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
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
  isCollapsed,
  onToggleCollapse,
  isSaving = false,
  beds,
  viewport
}) => {
  return (
    <div className={cn(
      "fixed top-16 right-0 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-sm border-l border-gray-200 shadow-xl z-40",
      "transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleCollapse(!isCollapsed)}
        className="absolute -left-8 top-4 w-8 h-8 p-0 bg-white border border-gray-200 shadow-sm rounded-l-md"
      >
        {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>

      {isCollapsed ? (
        /* Collapsed State - Minimal */
        <div className="p-2 text-center">
          <div className="text-xs text-gray-500 rotate-90 mt-8">
            Controles
          </div>
        </div>
      ) : (
        /* Expanded State - Full Controls */
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Controles do Canvas</h2>
            <p className="text-sm text-gray-600 mt-1">Ferramenta ativa: {
              activeTool === 'pan' ? 'Mover' :
              activeTool === 'create-rectangle' ? 'Retângulo' :
              activeTool === 'select' ? 'Selecionar' : activeTool
            }</p>
          </div>

          {/* Bed Configuration - only show for rectangle tool */}
          {activeTool === 'create-rectangle' && (
            <BedConfigurationPanel
              bedConfig={bedConfig}
              onBedConfigChange={onBedConfigChange}
            />
          )}

          {/* Actions */}
          <ActionsPanel
            onUndo={onUndo}
            onRedo={onRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            onDeleteSelected={onDeleteSelected}
            selectedCount={selectedCount}
          />

          {/* Statistics */}
          <StatisticsPanel
            beds={beds}
            selectedCount={selectedCount}
            viewport={viewport}
          />

          {/* Save Status */}
          {isSaving && (
            <div className="flex items-center text-sm text-gray-600">
              <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full mr-2" />
              Salvando automaticamente...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
