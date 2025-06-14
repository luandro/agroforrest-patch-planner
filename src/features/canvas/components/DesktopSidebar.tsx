
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CanvasTool, BedConfig, Bed } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';
import { 
  Square, 
  Circle, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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
  const tools = [
    {
      id: 'pan' as CanvasTool,
      icon: '👋',
      label: 'Navegar',
      description: 'Arrastar para mover o canvas'
    },
    {
      id: 'create-rectangle' as CanvasTool,
      icon: Square,
      label: 'Canteiro Retangular',
      description: 'Criar canteiros retangulares'
    },
    {
      id: 'create-circle' as CanvasTool,
      icon: Circle,
      label: 'Canteiro Circular',
      description: 'Criar canteiros circulares'
    },
    {
      id: 'select' as CanvasTool,
      icon: '🎯',
      label: 'Selecionar',
      description: 'Selecionar e editar canteiros'
    }
  ];

  const totalArea = beds.reduce((total, bed) => {
    if (bed.shape === 'rectangle') {
      return total + ((bed.dimensions.length || 0) * (bed.dimensions.width || 0));
    } else {
      const radius = bed.dimensions.radius || 0;
      return total + (Math.PI * radius * radius);
    }
  }, 0);

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
        /* Collapsed State - Icon Strip */
        <div className="p-2 space-y-2">
          {tools.map((tool) => {
            const isActive = activeTool === tool.id;
            
            return (
              <Button
                key={tool.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToolChange(tool.id)}
                className={cn(
                  "w-12 h-12 p-0",
                  isActive && "ring-2 ring-blue-500 ring-offset-1"
                )}
                title={tool.label}
              >
                {typeof tool.icon === 'string' ? (
                  <span className="text-lg">{tool.icon}</span>
                ) : (
                  <tool.icon className="w-5 h-5" />
                )}
              </Button>
            );
          })}
        </div>
      ) : (
        /* Expanded State - Full Controls */
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Controles do Canvas</h2>
            <p className="text-sm text-gray-600 mt-1">Configure ferramentas e canteiros</p>
          </div>

          {/* Tools Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Ferramentas</h3>
            <div className="space-y-2">
              {tools.map((tool) => {
                const isActive = activeTool === tool.id;
                
                return (
                  <Button
                    key={tool.id}
                    variant={isActive ? 'default' : 'outline'}
                    onClick={() => onToolChange(tool.id)}
                    className={cn(
                      "w-full justify-start h-auto p-3",
                      isActive && "ring-2 ring-blue-500 ring-offset-1"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {typeof tool.icon === 'string' ? (
                        <span className="text-xl">{tool.icon}</span>
                      ) : (
                        <tool.icon className="w-5 h-5" />
                      )}
                      <div className="text-left">
                        <div className="font-medium">{tool.label}</div>
                        <div className="text-xs text-gray-500">{tool.description}</div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Bed Configuration */}
          {(activeTool === 'create-rectangle' || activeTool === 'create-circle') && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Configuração do Canteiro</h3>
              <div className="space-y-4">
                {activeTool === 'create-rectangle' && (
                  <>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Comprimento</label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onBedConfigChange({ length: Math.max(0.5, bedConfig.length - 0.5) })}
                          className="w-8 h-8 p-0"
                        >
                          -
                        </Button>
                        <div className="flex-1 text-center font-medium">{bedConfig.length}m</div>
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
                      <label className="text-sm text-gray-600 mb-2 block">Largura</label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onBedConfigChange({ width: Math.max(0.2, bedConfig.width - 0.2) })}
                          className="w-8 h-8 p-0"
                        >
                          -
                        </Button>
                        <div className="flex-1 text-center font-medium">{bedConfig.width}m</div>
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
                  <label className="text-sm text-gray-600 mb-2 block">Quantidade</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onBedConfigChange({ quantity: Math.max(1, bedConfig.quantity - 1) })}
                      className="w-8 h-8 p-0"
                    >
                      -
                    </Button>
                    <div className="flex-1 text-center font-medium">{bedConfig.quantity}</div>
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
                  <label className="text-sm text-gray-600 mb-2 block">Espaçamento</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onBedConfigChange({ spacing: Math.max(0, bedConfig.spacing - 0.1) })}
                      className="w-8 h-8 p-0"
                    >
                      -
                    </Button>
                    <div className="flex-1 text-center font-medium">{bedConfig.spacing.toFixed(1)}m</div>
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
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Ações</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="w-full"
                >
                  ↶ Desfazer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="w-full"
                >
                  ↷ Refazer
                </Button>
              </div>
              
              {selectedCount > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onDeleteSelected}
                  className="w-full"
                >
                  🗑️ Deletar Selecionados ({selectedCount})
                </Button>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Estatísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Canteiros:</span>
                <span className="font-medium">{beds.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Selecionados:</span>
                <span className="font-medium">{selectedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Área Total:</span>
                <span className="font-medium">{totalArea.toFixed(1)}m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zoom:</span>
                <span className="font-medium">{viewport.zoom.toFixed(1)}x</span>
              </div>
            </div>
          </div>

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
