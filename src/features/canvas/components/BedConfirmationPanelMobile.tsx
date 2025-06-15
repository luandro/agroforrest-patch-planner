
import React from 'react';
import { Button } from '@/components/ui/button';
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

export const BedConfirmationPanelMobile: React.FC<BedConfirmationPanelProps> = ({
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
      <div className={`fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-200 shadow-lg animate-slide-in-bottom ${className}`}>
        <div className="p-4">
          {/* Handle bar */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {hasCollision ? 'Posição Inválida' : 'Criar Canteiro?'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{getShapeLabel()}</p>
            </div>

            {hasCollision && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">
                  Não é possível criar aqui - sobreposição com canteiro existente ou espaçamento insuficiente.
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Dimensões:</span>
                <span className="text-sm text-gray-900">{formatDimensions()}</span>
              </div>
              {actualBedsCount > 1 && (
                <>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-gray-700">Quantidade:</span>
                    <span className="text-sm text-gray-900">{actualBedsCount}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-gray-700">Espaçamento:</span>
                    <span className="text-sm text-gray-900">{bedConfig.spacing}m</span>
                  </div>
                </>
              )}
            </div>

            {!hasCollision && (
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
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onCancel}
              >
                <X className="w-4 h-4 mr-2" />
                {hasCollision ? 'Fechar' : 'Cancelar'}
              </Button>
              {!hasCollision && (
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={onConfirm}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};
