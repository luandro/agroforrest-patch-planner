
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Bed, BedConfig } from '../types/bed.types';
import { Check, X, Lock, Unlock, AlertTriangle } from 'lucide-react';

interface BedConfirmationPanelProps {
  bed: Bed;
  beds?: Bed[];
  bedConfig: BedConfig;
  multiCreationMode: boolean;
  onMultiCreationToggle: (enabled: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  hasCollision?: boolean;
  className?: string;
}

export const BedConfirmationPanelDesktop: React.FC<BedConfirmationPanelProps> = ({
  bed,
  beds = [],
  bedConfig,
  multiCreationMode,
  onMultiCreationToggle,
  onConfirm,
  onCancel,
  hasCollision = false,
  className
}) => {
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

  const actualBedsCount = beds.length > 0 ? beds.length : bedConfig.quantity;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onCancel} />
      <Card className={`fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white shadow-lg animate-scale-in ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            {hasCollision && <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />}
            {hasCollision ? 'Posição Inválida' : 'Criar Canteiro?'}
          </CardTitle>
          <p className="text-sm text-gray-600">{getShapeLabel()}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {hasCollision && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                Sobreposição detectada. Mova para uma posição com espaçamento adequado.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Dimensões:</span>
              <span className="text-sm text-gray-900">{formatDimensions()}</span>
            </div>
            {actualBedsCount > 1 && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Quantidade:</span>
                  <span className="text-sm text-gray-900">{actualBedsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Espaçamento:</span>
                  <span className="text-sm text-gray-900">{bedConfig.spacing}m</span>
                </div>
              </>
            )}
          </div>

          {!hasCollision && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="multi-mode-desktop"
                checked={multiCreationMode}
                onCheckedChange={onMultiCreationToggle}
              />
              <label htmlFor="multi-mode-desktop" className="text-sm text-gray-700 flex items-center">
                {multiCreationMode ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
                Modo criação contínua
              </label>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onCancel}
            >
              <X className="w-4 h-4 mr-1" />
              {hasCollision ? 'Fechar' : 'Cancelar'}
            </Button>
            {!hasCollision && (
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={onConfirm}
              >
                <Check className="w-4 h-4 mr-1" />
                Confirmar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
