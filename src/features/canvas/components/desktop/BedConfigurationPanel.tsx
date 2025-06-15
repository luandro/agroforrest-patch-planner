
import React from 'react';
import { Button } from '@/components/ui/button';
import { BedConfig } from '../../types/bed.types';

interface BedConfigurationPanelProps {
  bedConfig: BedConfig;
  onBedConfigChange: (updates: Partial<BedConfig>) => void;
}

export const BedConfigurationPanel: React.FC<BedConfigurationPanelProps> = ({
  bedConfig,
  onBedConfigChange
}) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Configuração do Canteiro</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-2 block">Comprimento</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ length: Math.max(0.5, bedConfig.length - 0.5) })}
              className="w-8 h-8 p-0"
            >
              -
            </Button>
            <div className="flex-1 text-center font-medium">{bedConfig.length}m</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ length: Math.min(20, bedConfig.length + 0.5) })}
              className="w-8 h-8 p-0"
            >
              +
            </Button>
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600 mb-2 block">Largura</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ width: Math.max(0.2, bedConfig.width - 0.2) })}
              className="w-8 h-8 p-0"
            >
              -
            </Button>
            <div className="flex-1 text-center font-medium">{bedConfig.width}m</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ width: Math.min(5, bedConfig.width + 0.2) })}
              className="w-8 h-8 p-0"
            >
              +
            </Button>
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600 mb-2 block">Quantidade</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ quantity: Math.max(1, bedConfig.quantity - 1) })}
              className="w-8 h-8 p-0"
            >
              -
            </Button>
            <div className="flex-1 text-center font-medium">{bedConfig.quantity}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ quantity: Math.min(10, bedConfig.quantity + 1) })}
              className="w-8 h-8 p-0"
            >
              +
            </Button>
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600 mb-2 block">Espaçamento</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ spacing: Math.max(0, bedConfig.spacing - 0.1) })}
              className="w-8 h-8 p-0"
            >
              -
            </Button>
            <div className="flex-1 text-center font-medium">{bedConfig.spacing.toFixed(1)}m</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBedConfigChange({ spacing: Math.min(2, bedConfig.spacing + 0.1) })}
              className="w-8 h-8 p-0"
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
