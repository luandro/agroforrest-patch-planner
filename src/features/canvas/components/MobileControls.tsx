
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CanvasTool, BedConfig } from '../types/bed.types';
import { 
  Square, 
  Circle, 
  ArrowUp,
  ArrowDown
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
  const tools = [
    {
      id: 'pan' as CanvasTool,
      icon: '👋',
      label: 'Mover',
      color: 'blue'
    },
    {
      id: 'create-rectangle' as CanvasTool,
      icon: Square,
      label: 'Retângulo',
      color: 'green'
    },
    {
      id: 'create-circle' as CanvasTool,
      icon: Circle,
      label: 'Círculo',
      color: 'purple'
    },
    {
      id: 'select' as CanvasTool,
      icon: '🎯',
      label: 'Selecionar',
      color: 'orange'
    }
  ];

  return (
    <>
      {/* FAB - Always visible */}
      <Button
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 touch-manipulation",
          "bg-green-600 hover:bg-green-700 text-white border-2 border-white",
          "transition-all duration-200",
          isVisible && "scale-110"
        )}
        onClick={() => onToggle(!isVisible)}
        aria-label="Abrir controles"
      >
        {isVisible ? <ArrowDown className="w-6 h-6" /> : <ArrowUp className="w-6 h-6" />}
      </Button>

      {/* Bottom Sheet */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-xl z-40",
        "transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}>
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-4 pb-6 space-y-4">
          {/* Tools Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Ferramentas</h3>
            <div className="grid grid-cols-4 gap-2">
              {tools.map((tool) => {
                const isActive = activeTool === tool.id;
                
                return (
                  <Button
                    key={tool.id}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onToolChange(tool.id)}
                    className={cn(
                      "h-12 p-2 flex flex-col items-center gap-1 touch-manipulation",
                      isActive && "ring-2 ring-offset-1",
                      tool.color === 'blue' && isActive && "ring-blue-500 bg-blue-600",
                      tool.color === 'green' && isActive && "ring-green-500 bg-green-600",
                      tool.color === 'purple' && isActive && "ring-purple-500 bg-purple-600",
                      tool.color === 'orange' && isActive && "ring-orange-500 bg-orange-600"
                    )}
                  >
                    {typeof tool.icon === 'string' ? (
                      <span className="text-lg">{tool.icon}</span>
                    ) : (
                      <tool.icon className="w-4 h-4" />
                    )}
                    <span className="text-xs">{tool.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Bed Configuration */}
          {(activeTool === 'create-rectangle' || activeTool === 'create-circle') && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Configuração do Canteiro</h3>
              <div className="grid grid-cols-2 gap-3">
                {activeTool === 'create-rectangle' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-600">Comprimento</label>
                      <div className="flex items-center gap-1 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onBedConfigChange({ length: Math.max(0.5, bedConfig.length - 0.5) })}
                          className="w-8 h-8 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm w-12 text-center">{bedConfig.length}m</span>
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
                      <label className="text-xs text-gray-600">Largura</label>
                      <div className="flex items-center gap-1 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onBedConfigChange({ width: Math.max(0.2, bedConfig.width - 0.2) })}
                          className="w-8 h-8 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm w-12 text-center">{bedConfig.width}m</span>
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
                  </>
                )}
                
                <div>
                  <label className="text-xs text-gray-600">Quantidade</label>
                  <div className="flex items-center gap-1 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onBedConfigChange({ quantity: Math.max(1, bedConfig.quantity - 1) })}
                      className="w-8 h-8 p-0"
                    >
                      -
                    </Button>
                    <span className="text-sm w-12 text-center">{bedConfig.quantity}</span>
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
                  <label className="text-xs text-gray-600">Espaçamento</label>
                  <div className="flex items-center gap-1 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onBedConfigChange({ spacing: Math.max(0, bedConfig.spacing - 0.1) })}
                      className="w-8 h-8 p-0"
                    >
                      -
                    </Button>
                    <span className="text-sm w-12 text-center">{bedConfig.spacing}m</span>
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
          )}

          {/* Actions */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Ações</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
                className="flex-1 touch-manipulation"
              >
                ↶ Desfazer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo}
                className="flex-1 touch-manipulation"
              >
                ↷ Refazer
              </Button>
              {selectedCount > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onDeleteSelected}
                  className="flex-1 touch-manipulation"
                >
                  🗑️ Deletar ({selectedCount})
                </Button>
              )}
            </div>
          </div>

          {/* Save Status */}
          {isSaving && (
            <div className="flex items-center justify-center text-sm text-gray-600">
              <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full mr-2" />
              Salvando automaticamente...
            </div>
          )}
        </div>

        {/* Safe area padding for iOS */}
        <div className="h-safe-area-inset-bottom" />
      </div>

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
