
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3X3, Rows, Triangle, Zap } from 'lucide-react';
import { BulkPlacementConfig } from '../../types/bulkPlacement.types';

interface BulkPlacementConfigPanelProps {
  config: BulkPlacementConfig;
  updateConfig: (updates: Partial<BulkPlacementConfig>) => void;
}

export const BulkPlacementConfigPanel: React.FC<BulkPlacementConfigPanelProps> = ({
  config,
  updateConfig,
}) => {
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

  return (
    <div className="space-y-4">
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
    </div>
  );
};
