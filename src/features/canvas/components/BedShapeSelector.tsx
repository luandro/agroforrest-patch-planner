
import React from 'react';
import { Button } from '@/components/ui/button';
import { Square, Circle } from 'lucide-react';
import { BedShape } from '../types/bed.types';

interface BedShapeSelectorProps {
  selectedShape: BedShape;
  onShapeChange: (shape: BedShape) => void;
}

export const BedShapeSelector: React.FC<BedShapeSelectorProps> = ({
  selectedShape,
  onShapeChange
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Formato
      </label>
      <div className="flex gap-2">
        <Button
          variant={selectedShape === 'rectangle' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onShapeChange('rectangle')}
          className="flex-1 flex items-center gap-2"
        >
          <Square className="w-4 h-4" />
          Retângulo
        </Button>
        <Button
          variant={selectedShape === 'circle' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onShapeChange('circle')}
          className="flex-1 flex items-center gap-2"
        >
          <Circle className="w-4 h-4" />
          Círculo
        </Button>
      </div>
    </div>
  );
};
