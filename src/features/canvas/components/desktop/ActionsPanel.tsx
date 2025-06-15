
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionsPanelProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDeleteSelected: () => void;
  selectedCount: number;
}

export const ActionsPanel: React.FC<ActionsPanelProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onDeleteSelected,
  selectedCount
}) => {
  return (
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
  );
};
