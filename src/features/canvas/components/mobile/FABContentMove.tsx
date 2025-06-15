
import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo, Redo } from 'lucide-react';

interface FABContentMoveProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const FABContentMove: React.FC<FABContentMoveProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        className="flex-1 h-12 touch-manipulation bg-white/95 backdrop-blur-sm"
        title="Desfazer"
      >
        <Undo className="w-5 h-5 mr-2" />
        Desfazer
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        className="flex-1 h-12 touch-manipulation bg-white/95 backdrop-blur-sm"
        title="Refazer"
      >
        <Redo className="w-5 h-5 mr-2" />
        Refazer
      </Button>
    </div>
  );
};
