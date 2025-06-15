
import React from 'react';
import { Button } from '@/components/ui/button';
import { BedConfig } from '../../types/bed.types';

interface FABContentRectangleProps {
  bedConfig: BedConfig;
  onBedConfigChange: (updates: Partial<BedConfig>) => void;
}

export const FABContentRectangle: React.FC<FABContentRectangleProps> = ({
  bedConfig,
  onBedConfigChange
}) => {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700 text-center">
        Configurações do Canteiro
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600 block mb-1">Comprimento</label>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ length: Math.max(0.5, bedConfig.length - 0.5) })}
              className="w-9 h-9 p-0 touch-manipulation active:scale-95"
            >
              -
            </Button>
            <span className="text-sm w-12 text-center font-medium">{bedConfig.length}m</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ length: Math.min(20, bedConfig.length + 0.5) })}
              className="w-9 h-9 p-0 touch-manipulation active:scale-95"
            >
              +
            </Button>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-600 block mb-1">Largura</label>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ width: Math.max(0.2, bedConfig.width - 0.2) })}
              className="w-9 h-9 p-0 touch-manipulation active:scale-95"
            >
              -
            </Button>
            <span className="text-sm w-12 text-center font-medium">{bedConfig.width}m</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ width: Math.min(5, bedConfig.width + 0.2) })}
              className="w-9 h-9 p-0 touch-manipulation active:scale-95"
            >
              +
            </Button>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-600 block mb-1">Quantidade</label>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ quantity: Math.max(1, bedConfig.quantity - 1) })}
              className="w-9 h-9 p-0 touch-manipulation active:scale-95"
            >
              -
            </Button>
            <span className="text-sm w-12 text-center font-medium">{bedConfig.quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ quantity: Math.min(10, bedConfig.quantity + 1) })}
              className="w-9 h-9 p-0 touch-manipulation active:scale-95"
            >
              +
            </Button>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-600 block mb-1">Espaçamento</label>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ spacing: Math.max(0, bedConfig.spacing - 0.1) })}
              className="w-9 h-9 p-0 touch-manipulation active:scale-95"
            >
              -
            </Button>
            <span className="text-sm w-12 text-center font-medium">{bedConfig.spacing.toFixed(1)}m</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ spacing: Math.min(2, bedConfig.spacing + 0.1) })}
              className="w-9 h-9 p-0 touch-manipulation active:scale-95"
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
