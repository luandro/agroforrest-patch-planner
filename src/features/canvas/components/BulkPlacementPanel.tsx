
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BulkPlacementConfig, BulkPlacementPreview } from '../types/bulkPlacement.types';
import { PlantSpecies } from '../types/species.types';
import { Bed } from '../types/bed.types';
import { Eye, Grid3X3, Rows, Triangle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkPlacementPanelProps {
  className?: string;
  selectedSpecies: PlantSpecies | null;
  selectedBed: Bed | null;
  config: BulkPlacementConfig | null;
  preview: BulkPlacementPreview | null;
  showPreview: boolean;
  isCalculating: boolean;
  canExecute: boolean;
  hasConflicts: boolean;
  updateConfig: (updates: Partial<BulkPlacementConfig>) => void;
  executeBulkPlacement: () => boolean;
  cancelBulkPlacement: () => void;
  setShowPreview: (show: boolean) => void;
}

export const BulkPlacementPanel: React.FC<BulkPlacementPanelProps> = ({
  className,
  selectedSpecies,
  selectedBed,
  config,
  preview,
  showPreview,
  isCalculating,
  canExecute,
  hasConflicts,
  updateConfig,
  executeBulkPlacement,
  cancelBulkPlacement,
  setShowPreview,
}) => {
  if (!selectedSpecies || !selectedBed || !config) {
    return null;
  }

  const handlePatternChange = (pattern: string) => {
    updateConfig({ 
      pattern: pattern as BulkPlacementConfig['pattern'] 
    });
  };

  const handleSpacingChange = (spacing: string) => {
    const numericSpacing = parseFloat(spacing);
    if (!isNaN(numericSpacing) && numericSpacing > 0) {
      updateConfig({ spacing: numericSpacing });
    }
  };

  const handleMarginChange = (margin: string) => {
    const numericMargin = parseFloat(margin);
    if (!isNaN(numericMargin) && numericMargin >= 0) {
      updateConfig({ marginFromEdge: numericMargin });
    }
  };

  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'grid': return <Grid3X3 className="w-4 h-4" />;
      case 'rows': return <Rows className="w-4 h-4" />;
      case 'staggered': return <Triangle className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-green-600" />
          Plantio em Massa
        </CardTitle>
        <p className="text-sm text-gray-600">
          {selectedSpecies.commonName} • {selectedBed.shape === 'rectangle' 
            ? `${selectedBed.dimensions.length}×${selectedBed.dimensions.width}m`
            : `⌀${(selectedBed.dimensions.radius || 0) * 2}m`
          }
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pattern Selection */}
        <div className="space-y-2">
          <Label htmlFor="pattern">Padrão de Plantio</Label>
          <Select value={config.pattern} onValueChange={handlePatternChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Automático (Recomendado)
                </div>
              </SelectItem>
              <SelectItem value="grid">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  Grade Regular
                </div>
              </SelectItem>
              <SelectItem value="rows">
                <div className="flex items-center gap-2">
                  <Rows className="w-4 h-4" />
                  Fileiras
                </div>
              </SelectItem>
              <SelectItem value="staggered">
                <div className="flex items-center gap-2">
                  <Triangle className="w-4 h-4" />
                  Escalonado
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Spacing Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="spacing">Espaçamento (m)</Label>
            <Input
              id="spacing"
              type="number"
              min="0.05"
              max="10"
              step="0.05"
              value={config.spacing}
              onChange={(e) => handleSpacingChange(e.target.value)}
              className="text-center"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="margin">Margem (m)</Label>
            <Input
              id="margin"
              type="number"
              min="0"
              max="2"
              step="0.05"
              value={config.marginFromEdge}
              onChange={(e) => handleMarginChange(e.target.value)}
              className="text-center"
            />
          </div>
        </div>

        <Separator />

        {/* Preview Results */}
        {isCalculating ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full mr-2" />
            <span className="text-sm text-gray-600">Calculando...</span>
          </div>
        ) : preview ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total de Plantas:</span>
              <Badge variant="secondary" className="text-lg px-3">
                {preview.totalCount}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Padrão:</span>
              <div className="flex items-center gap-1 text-sm">
                {getPatternIcon(preview.pattern)}
                {preview.pattern.charAt(0).toUpperCase() + preview.pattern.slice(1)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Eficiência:</span>
              <span className={cn("text-sm font-medium", getEfficiencyColor(preview.coverage.efficiency))}>
                {preview.coverage.efficiency.toFixed(1)}%
              </span>
            </div>

            {hasConflicts && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
                <p className="text-sm text-yellow-800">
                  ⚠️ {preview.conflicts} posição(ões) bloqueada(s) por plantas existentes
                </p>
              </div>
            )}

            {preview.totalCount === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-2">
                <p className="text-sm text-red-800">
                  ❌ Espaçamento muito grande para este canteiro
                </p>
              </div>
            )}
          </div>
        ) : null}

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="w-full"
            disabled={!preview || preview.totalCount === 0 || isCalculating}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Ocultar Visualização' : 'Visualizar Arranjo'}
          </Button>

          <Button
            onClick={executeBulkPlacement}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={!canExecute || isCalculating}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Plantar Todas ({preview?.totalCount || 0})
          </Button>

          <Button
            onClick={cancelBulkPlacement}
            variant="ghost"
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
