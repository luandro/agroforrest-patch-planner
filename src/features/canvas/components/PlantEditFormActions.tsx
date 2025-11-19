
import React from 'react';
import { Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
  return (
    <>
      {/* Actions */}
      <div className="space-y-2">
        <Button
          onClick={onApplyChanges}
          disabled={!hasUnsavedChanges}
          className="w-full"
          size="sm"
        >
          Aplicar Mudanças
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={onDelete}
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
            onClick={onDuplicate}
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
                onClick={onSelectSameSpecies}
                disabled={!onSelectSameSpecies}
              >
                Mesma Espécie
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex-1"
                onClick={onAdjustSpacing}
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
