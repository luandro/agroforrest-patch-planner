
import React, { useCallback } from 'react';
import { Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { storeLogger } from '@/lib/logger';

interface PlantEditFormActionsProps {
  selectedCount: number;
  hasUnsavedChanges: boolean;
  onApplyChanges: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onSelectSameSpecies?: () => void;
  onAdjustSpacing?: () => void;
}

export const PlantEditFormActions: React.FC<PlantEditFormActionsProps> = ({
  selectedCount,
  hasUnsavedChanges,
  onApplyChanges,
  onDelete,
  onDuplicate,
  onSelectSameSpecies,
  onAdjustSpacing
}) => {
  // Safe wrapper for callbacks with error handling
  const safeCall = useCallback((fn: (() => void) | undefined, actionName: string) => {
    if (!fn) return;
    try {
      fn();
    } catch (error) {
      storeLogger.error(`[PlantEditFormActions] ${actionName} failed:`, error);
    }
  }, []);

  return (
    <>
      {/* Actions */}
      <div className="space-y-2">
        <Button
          onClick={() => safeCall(onApplyChanges, 'Apply changes')}
          disabled={!hasUnsavedChanges}
          className="w-full"
          size="sm"
        >
          Aplicar Mudanças
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={() => safeCall(onDelete, 'Delete')}
            variant="destructive"
            size="sm"
            className="flex-1 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Deletar{selectedCount > 1 ? ` (${selectedCount})` : ''}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => safeCall(onDuplicate, 'Duplicate')}
            disabled={!onDuplicate}
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Quick Actions for Multi-Select */}
      {selectedCount > 1 && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="text-xs text-gray-500 font-medium">Ações Rápidas</div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex-1"
                onClick={() => safeCall(onSelectSameSpecies, 'Select same species')}
                disabled={!onSelectSameSpecies}
              >
                Mesma Espécie
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex-1"
                onClick={() => safeCall(onAdjustSpacing, 'Adjust spacing')}
                disabled={!onAdjustSpacing}
              >
                Espaçar
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Status indicator */}
      {hasUnsavedChanges && (
        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
          Alterações não salvas
        </div>
      )}
    </>
  );
};
