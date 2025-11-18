
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BedConfig } from '../types/bed.types';
import { SliderControl } from './SliderControl';
import { BedShapeSelector } from './BedShapeSelector';

interface BedConfigPanelProps {
  config: BedConfig;
  onConfigChange: (updates: Partial<BedConfig>) => void;
  onClose: () => void;
  className?: string;
}

export const BedConfigPanel: React.FC<BedConfigPanelProps> = ({
  config,
  onConfigChange,
  onClose,
  className
}) => {
  return (
    <div className={cn(
      "absolute bottom-4 left-4 right-4 md:right-auto md:w-80",
      "bg-white rounded-lg shadow-lg border border-gray-200 p-4",
      "transform transition-transform duration-200 ease-in-out",
      className
    )}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Configurar Canteiro</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
          aria-label="Fechar painel"
        >
          ×
        </Button>
      </div>

      {/* Shape Selection */}
      <BedShapeSelector
        selectedShape={config.shape}
        onShapeChange={(shape) => onConfigChange({ shape })}
      />

      {/* Dimensions */}
      <div className="space-y-4">
        {config.shape === 'rectangle' ? (
          <>
            <SliderControl
              label="Comprimento"
              value={config.length}
              onChange={(length) => onConfigChange({ length })}
              min={0.5}
              max={20}
              step={0.5}
              unit="m"
            />

            <SliderControl
              label="Largura"
              value={config.width}
              onChange={(width) => onConfigChange({ width })}
              min={0.2}
              max={5}
              step={0.1}
              unit="m"
            />
          </>
        ) : (
          <SliderControl
            label="Raio"
            value={config.length}
            onChange={(length) => onConfigChange({ length })}
            min={0.5}
            max={10}
            step={0.5}
            unit="m"
          />
        )}

        {/* Spacing (only for multiple beds) */}
        {config.quantity > 1 && (
          <SliderControl
            label="Espaçamento"
            value={config.spacing}
            onChange={(spacing) => onConfigChange({ spacing })}
            min={0.1}
            max={2}
            step={0.1}
            unit="m"
          />
        )}

        {/* Quantity */}
        <SliderControl
          label="Quantidade"
          value={config.quantity}
          onChange={(quantity) => onConfigChange({ quantity: Math.max(1, quantity) })}
          min={1}
          max={10}
          step={1}
          showInput={true}
          formatValue={(v) => v.toString()}
        />
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          {config.shape === 'rectangle'
            ? 'Toque e arraste no canvas para criar canteiros retangulares'
            : 'Toque no centro e arraste para definir o raio do canteiro circular'
          }
        </p>
      </div>
    </div>
  );
};
