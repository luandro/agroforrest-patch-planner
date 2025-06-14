
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { BedConfig } from '../types/bed.types';
import { Plus, Minus, Square, Circle } from 'lucide-react';

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
  const incrementValue = (field: keyof BedConfig, step: number) => {
    const currentValue = config[field] as number;
    const newValue = Math.max(0.1, currentValue + step);
    onConfigChange({ [field]: newValue });
  };

  const handleSliderChange = (field: keyof BedConfig, values: number[]) => {
    onConfigChange({ [field]: values[0] });
  };

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
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Formato
        </label>
        <div className="flex gap-2">
          <Button
            variant={config.shape === 'rectangle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onConfigChange({ shape: 'rectangle' })}
            className="flex-1 flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Retângulo
          </Button>
          <Button
            variant={config.shape === 'circle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onConfigChange({ shape: 'circle' })}
            className="flex-1 flex items-center gap-2"
          >
            <Circle className="w-4 h-4" />
            Círculo
          </Button>
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-4">
        {config.shape === 'rectangle' ? (
          <>
            {/* Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comprimento: {config.length.toFixed(1)}m
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementValue('length', -0.5)}
                  className="h-8 w-8 p-0 touch-manipulation"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <Slider
                  value={[config.length]}
                  onValueChange={(values) => handleSliderChange('length', values)}
                  min={0.5}
                  max={20}
                  step={0.5}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementValue('length', 0.5)}
                  className="h-8 w-8 p-0 touch-manipulation"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Largura: {config.width.toFixed(1)}m
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementValue('width', -0.1)}
                  className="h-8 w-8 p-0 touch-manipulation"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <Slider
                  value={[config.width]}
                  onValueChange={(values) => handleSliderChange('width', values)}
                  min={0.2}
                  max={5}
                  step={0.1}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementValue('width', 0.1)}
                  className="h-8 w-8 p-0 touch-manipulation"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Radius for circles */
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raio: {config.length.toFixed(1)}m
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => incrementValue('length', -0.5)}
                className="h-8 w-8 p-0 touch-manipulation"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Slider
                value={[config.length]}
                onValueChange={(values) => handleSliderChange('length', values)}
                min={0.5}
                max={10}
                step={0.5}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => incrementValue('length', 0.5)}
                className="h-8 w-8 p-0 touch-manipulation"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Spacing (only for multiple beds) */}
        {config.quantity > 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Espaçamento: {config.spacing.toFixed(1)}m
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => incrementValue('spacing', -0.1)}
                className="h-8 w-8 p-0 touch-manipulation"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Slider
                value={[config.spacing]}
                onValueChange={(values) => handleSliderChange('spacing', values)}
                min={0.1}
                max={2}
                step={0.1}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => incrementValue('spacing', 0.1)}
                className="h-8 w-8 p-0 touch-manipulation"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantidade: {config.quantity}
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => incrementValue('quantity', -1)}
              className="h-8 w-8 p-0 touch-manipulation"
              disabled={config.quantity <= 1}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <Input
              type="number"
              value={config.quantity}
              onChange={(e) => onConfigChange({ quantity: Math.max(1, parseInt(e.target.value) || 1) })}
              className="text-center flex-1"
              min="1"
              max="10"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => incrementValue('quantity', 1)}
              className="h-8 w-8 p-0 touch-manipulation"
              disabled={config.quantity >= 10}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
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
