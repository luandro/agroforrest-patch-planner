
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CanvasTool, BedConfig } from '../types/bed.types';
import { 
  Undo,
  Redo,
  Trash2,
  Settings
} from 'lucide-react';

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
  // Determine FAB content based on active tool and selection
  const getFABContent = () => {
    // Default state (Move tool) - show undo/redo
    if (activeTool === 'pan') {
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1 h-12 touch-manipulation bg-white/95 backdrop-blur-sm"
            title="Desfazer"
          >
            <Undo className="w-5 h-5 mr-2" />
            Desfazer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1 h-12 touch-manipulation bg-white/95 backdrop-blur-sm"
            title="Refazer"
          >
            <Redo className="w-5 h-5 mr-2" />
            Refazer
          </Button>
        </div>
      );
    }

    // Rectangle tool active - show bed settings
    if (activeTool === 'create-rectangle') {
      return (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 text-center">
            Configurações do Canteiro
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Comprimento</label>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBedConfigChange({ length: Math.max(0.5, bedConfig.length - 0.5) })}
                  className="w-8 h-8 p-0"
                >
                  -
                </Button>
                <span className="text-sm w-12 text-center font-medium">{bedConfig.length}m</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBedConfigChange({ length: Math.min(20, bedConfig.length + 0.5) })}
                  className="w-8 h-8 p-0"
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Largura</label>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBedConfigChange({ width: Math.max(0.2, bedConfig.width - 0.2) })}
                  className="w-8 h-8 p-0"
                >
                  -
                </Button>
                <span className="text-sm w-12 text-center font-medium">{bedConfig.width}m</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBedConfigChange({ width: Math.min(5, bedConfig.width + 0.2) })}
                  className="w-8 h-8 p-0"
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Quantidade</label>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBedConfigChange({ quantity: Math.max(1, bedConfig.quantity - 1) })}
                  className="w-8 h-8 p-0"
                >
                  -
                </Button>
                <span className="text-sm w-12 text-center font-medium">{bedConfig.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBedConfigChange({ quantity: Math.min(10, bedConfig.quantity + 1) })}
                  className="w-8 h-8 p-0"
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Espaçamento</label>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBedConfigChange({ spacing: Math.max(0, bedConfig.spacing - 0.1) })}
                  className="w-8 h-8 p-0"
                >
                  -
                </Button>
                <span className="text-sm w-12 text-center font-medium">{bedConfig.spacing.toFixed(1)}m</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBedConfigChange({ spacing: Math.min(2, bedConfig.spacing + 0.1) })}
                  className="w-8 h-8 p-0"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Select tool with selection - show edit controls
    if (activeTool === 'select' && selectedCount > 0) {
      return (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 text-center">
            Editar Canteiro Selecionado
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            className="w-full h-12 touch-manipulation"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Deletar ({selectedCount})
          </Button>
        </div>
      );
    }

    // Select tool without selection - show hint
    if (activeTool === 'select') {
      return (
        <div className="text-center py-4 opacity-75">
          <div className="text-sm text-gray-600">
            Toque em um canteiro para editar
          </div>
        </div>
      );
    }

    return null;
  };

  const getFABIcon = () => {
    if (activeTool === 'create-rectangle') return <Settings className="w-6 h-6" />;
    if (activeTool === 'select' && selectedCount > 0) return <span className="text-lg">✏️</span>;
    if (activeTool === 'select') return <span className="text-lg">👆</span>;
    return <span className="text-lg">⚡</span>; // Default for move tool
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
            {getFABIcon()}
          </Button>
        </div>
      )}

      {/* Save Status */}
      {isSaving && (
        <div className="fixed bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200 z-40">
          <div className="flex items-center text-sm text-gray-600">
            <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full mr-2" />
            Salvando...
          </div>
        </div>
      )}

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
