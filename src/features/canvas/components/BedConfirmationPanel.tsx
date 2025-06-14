
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Bed, BedConfig } from '../types/bed.types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Check, X, Lock, Unlock } from 'lucide-react';

interface BedConfirmationPanelProps {
  bed: Bed;
  bedConfig: BedConfig;
  multiCreationMode: boolean;
  onMultiCreationToggle: (enabled: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

export const BedConfirmationPanel: React.FC<BedConfirmationPanelProps> = ({
  bed,
  bedConfig,
  multiCreationMode,
  onMultiCreationToggle,
  onConfirm,
  onCancel,
  className
}) => {
  const isMobile = useIsMobile();

  const formatDimensions = () => {
    if (bed.shape === 'rectangle') {
      return `${bed.dimensions.length}m × ${bed.dimensions.width}m`;
    } else {
      return `⌀ ${bed.dimensions.radius! * 2}m`;
    }
  };

  const getShapeLabel = () => {
    return bed.shape === 'rectangle' ? 'Canteiro Retangular' : 'Canteiro Circular';
  };

  if (isMobile) {
    return (
      <div className={`fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-200 shadow-lg animate-slide-in-bottom ${className}`}>
        <div className="p-4">
          {/* Handle bar */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Criar Canteiro?</h3>
              <p className="text-sm text-gray-600 mt-1">{getShapeLabel()}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Dimensões:</span>
                <span className="text-sm text-gray-900">{formatDimensions()}</span>
              </div>
              {bedConfig.quantity > 1 && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium text-gray-700">Quantidade:</span>
                  <span className="text-sm text-gray-900">{bedConfig.quantity}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="multi-mode"
                checked={multiCreationMode}
                onCheckedChange={onMultiCreationToggle}
              />
              <label htmlFor="multi-mode" className="text-sm text-gray-700 flex items-center">
                {multiCreationMode ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
                Modo criação contínua
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onCancel}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={onConfirm}
              >
                <Check className="w-4 h-4 mr-2" />
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version - floating panel
  return (
    <Card className={`absolute z-50 w-80 bg-white shadow-lg animate-scale-in ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Criar Canteiro?</CardTitle>
        <p className="text-sm text-gray-600">{getShapeLabel()}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Dimensões:</span>
            <span className="text-sm text-gray-900">{formatDimensions()}</span>
          </div>
          {bedConfig.quantity > 1 && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Quantidade:</span>
              <span className="text-sm text-gray-900">{bedConfig.quantity}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="multi-mode-desktop"
            checked={multiCreationMode}
            onCheckedChange={onMultiCreationToggle}
          />
          <label htmlFor="multi-mode-desktop" className="text-sm text-gray-700 flex items-center">
            {multiCreationMode ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
            Shift+Click para múltiplos
          </label>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onCancel}
          >
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={onConfirm}
          >
            <Check className="w-4 h-4 mr-1" />
            Confirmar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
