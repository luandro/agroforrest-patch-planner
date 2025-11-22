import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Grid as GridIcon,
  Download,
  Save,
  Upload,
  Trash2,
  Menu,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface UnifiedToolbarProps {
  // App Info
  appName?: string;
  onMenuClick?: () => void;

  // Stats
  totalArea?: number;
  totalPlants?: number;
  terrainSize?: number;

  // Tool Controls
  gridEnabled?: boolean;
  onToggleGrid?: () => void;
  onExport?: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  onClear?: () => void;

  // Canvas Controls
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitAll?: () => void;
  zoom?: number;

  // Saving state
  isSaving?: boolean;
}

export const UnifiedToolbar: React.FC<UnifiedToolbarProps> = ({
  appName = 'Croqui SAF',
  onMenuClick,
  totalArea = 0,
  totalPlants = 0,
  terrainSize = 50,
  gridEnabled = true,
  onToggleGrid,
  onExport,
  onSave,
  onLoad,
  onClear,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onZoomIn,
  onZoomOut,
  onFitAll,
  zoom = 1,
  isSaving = false
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full flex items-center justify-between gap-4">
      {/* Left Section - App Name/Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-lg font-semibold text-gray-900 hidden sm:inline">
          🌱 {appName}
        </span>
        <span className="text-lg font-semibold text-gray-900 sm:hidden">
          🌱
        </span>
      </div>

      {/* Center Section - Main Controls */}
      {!isMobile && (
        <div className="flex items-center gap-2">
          {/* Grid Toggle */}
          {onToggleGrid && (
            <Button
              variant={gridEnabled ? "default" : "outline"}
              size="sm"
              onClick={onToggleGrid}
              className={cn(
                "h-9 gap-2",
                gridEnabled && "bg-green-600 hover:bg-green-700"
              )}
              title="Alternar grade"
            >
              <GridIcon size={16} />
              <span className="hidden lg:inline">Grade</span>
            </Button>
          )}

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            {onUndo && (
              <Button
                variant="outline"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
                className="h-9 w-9 p-0"
                title="Desfazer"
              >
                <Undo size={16} />
              </Button>
            )}
            {onRedo && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo}
                className="h-9 w-9 p-0"
                title="Refazer"
              >
                <Redo size={16} />
              </Button>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border-l pl-2">
            {onZoomOut && (
              <Button
                variant="outline"
                size="sm"
                onClick={onZoomOut}
                className="h-9 w-9 p-0"
                title="Diminuir zoom"
              >
                <ZoomOut size={16} />
              </Button>
            )}
            <span className="text-xs text-gray-600 min-w-[3rem] text-center">
              {zoom.toFixed(1)}x
            </span>
            {onZoomIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={onZoomIn}
                className="h-9 w-9 p-0"
                title="Aumentar zoom"
              >
                <ZoomIn size={16} />
              </Button>
            )}
            {onFitAll && (
              <Button
                variant="outline"
                size="sm"
                onClick={onFitAll}
                className="h-9 w-9 p-0"
                title="Ajustar visualização"
              >
                <Maximize2 size={16} />
              </Button>
            )}
          </div>

          {/* File Operations */}
          <div className="flex items-center gap-1 border-l pl-2">
            {onSave && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                className="h-9 gap-2"
                title="Salvar"
                disabled={isSaving}
              >
                <Save size={16} />
                <span className="hidden xl:inline">
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </span>
              </Button>
            )}
            {onLoad && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLoad}
                className="h-9 gap-2"
                title="Carregar"
              >
                <Upload size={16} />
                <span className="hidden xl:inline">Carregar</span>
              </Button>
            )}
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="h-9 gap-2"
                title="Exportar"
              >
                <Download size={16} />
                <span className="hidden xl:inline">Exportar</span>
              </Button>
            )}
            {onClear && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
                className="h-9 gap-2 text-red-600 hover:bg-red-50"
                title="Limpar"
              >
                <Trash2 size={16} />
                <span className="hidden xl:inline">Limpar</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Right Section - Stats & User Menu */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Statistics */}
        {!isMobile && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">TERRENO:</span>
              <span className="font-semibold text-gray-900">{terrainSize} × {terrainSize}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">ÁREA:</span>
              <span className="font-semibold text-green-600">{totalArea.toFixed(0)}m²</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">PLANTAS:</span>
              <span className="font-semibold text-green-600">{totalPlants}</span>
            </div>
          </div>
        )}

        {/* User Menu Button */}
        {onMenuClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="h-9 w-9 p-0"
            title="Menu do usuário"
          >
            <Menu size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};
