
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TemplatePreview } from '../types/template.types';
import { PlantSpecies } from '../types/species.types';
import { cn } from '@/lib/utils';

interface TemplatePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  preview: TemplatePreview | null;
}

export const TemplatePreviewDialog: React.FC<TemplatePreviewDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  preview
}) => {
  if (!preview) return null;

  const { template, scaledPlants, compatibility, warnings } = preview;

  const getCompatibilityColor = () => {
    switch (compatibility.bedSizeMatch) {
      case 'perfect': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'tight': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'too-small': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const canApply = compatibility.bedSizeMatch !== 'too-small';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>🌟</span>
            Aplicar Modelo: {template.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Info */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {scaledPlants.length} plantas incluídas
              </span>
              <Badge variant="outline" className="text-xs">
                {template.difficulty === 'beginner' ? 'Iniciante' : 
                 template.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </Badge>
            </div>
            
          <div className="text-xs text-gray-600 space-y-1">
              {scaledPlants.reduce<Array<{ species?: PlantSpecies; quantity: number }>>((acc, plant) => {
                const existing = acc.find(p => p.species?.commonName === plant.species?.commonName);
                if (existing) {
                  existing.quantity += plant.quantity;
                } else {
                  acc.push({
                    species: plant.species,
                    quantity: plant.quantity
                  });
                }
                return acc;
              }, []).map((plantGroup, index) => (
                <div key={index} className="flex justify-between">
                  <span>{plantGroup.quantity}x {plantGroup.species?.commonName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compatibility Status */}
          <div className={cn(
            "border rounded-lg p-3",
            getCompatibilityColor()
          )}>
            <div className="flex items-start gap-2">
              <span className="text-lg">
                {compatibility.bedSizeMatch === 'perfect' ? '✅' :
                 compatibility.bedSizeMatch === 'good' ? '👍' :
                 compatibility.bedSizeMatch === 'tight' ? '⚠️' : '❌'}
              </span>
              <div className="flex-1">
                <div className="font-medium text-sm">
                  Compatibilidade: {compatibility.scaleRatio >= 1 ? '100%' : `${Math.round(compatibility.scaleRatio * 100)}%`}
                </div>
                <div className="text-sm mt-1">
                  {compatibility.message}
                </div>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-sm font-medium text-yellow-800 mb-1">
                ⚠️ Avisos importantes:
              </div>
              <ul className="text-xs text-yellow-700 space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {template.benefits.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Benefícios:</div>
              <div className="flex flex-wrap gap-1">
                {template.benefits.map((benefit, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Harvest Schedule */}
          {template.harvestSchedule && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm font-medium text-blue-800 mb-1">
                📅 Cronograma de Colheita:
              </div>
              <div className="text-xs text-blue-700">
                {template.harvestSchedule}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={!canApply}
            className={cn(
              canApply ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"
            )}
          >
            {canApply ? 'Aplicar Modelo' : 'Canteiro Muito Pequeno'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
