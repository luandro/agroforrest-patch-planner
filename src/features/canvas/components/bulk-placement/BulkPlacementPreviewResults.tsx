
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BulkPlacementPreview } from '../../types/bulkPlacement.types';
import { Grid3X3, Rows, Triangle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkPlacementPreviewResultsProps {
  isCalculating: boolean;
  preview: BulkPlacementPreview | null;
  hasConflicts: boolean;
}

export const BulkPlacementPreviewResults: React.FC<BulkPlacementPreviewResultsProps> = ({
  isCalculating,
  preview,
  hasConflicts,
}) => {
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

  if (isCalculating) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full mr-2" />
        <span className="text-sm text-gray-600">Calculando...</span>
      </div>
    );
  }

  if (!preview) {
    return null;
  }

  return (
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
  );
};
