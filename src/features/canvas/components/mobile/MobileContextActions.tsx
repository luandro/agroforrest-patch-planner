
import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo, Redo } from 'lucide-react';

interface MobileContextActionsProps {
  canUndo: boolean;
  canRedo: boolean;
  selectedCount: number;
  onUndo: () => void;
  onRedo: () => void;
  onDeleteSelected: () => void;
}

export const MobileContextActions: React.FC<MobileContextActionsProps> = ({
  canUndo,
  canRedo,
  selectedCount,
  onUndo,
  onRedo,
  onDeleteSelected
}) => {
  // Only show when there are actions available
  if (!canUndo && !canRedo && selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 z-30">
      <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 p-2 flex gap-2">
        {/* Undo */}
        {canUndo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            className="w-10 h-10 p-0 rounded-full"
            title="Desfazer"
          >
            <Undo className="w-4 h-4" />
          </Button>
        )}
        
        {/* Redo */}
        {canRedo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            className="w-10 h-10 p-0 rounded-full"
            title="Refazer"
          >
            <Redo className="w-4 h-4" />
          </Button>
        )}

        {/* Delete Selected */}
        {selectedCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteSelected}
            className="w-10 h-10 p-0 rounded-full hover:bg-red-50 hover:border-red-300"
            title={`Excluir ${selectedCount} canteiro${selectedCount > 1 ? 's' : ''}`}
          >
            <span className="text-lg text-red-600">🗑️</span>
          </Button>
        )}
      </div>
    </div>
  );
};
