
import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';

interface PlantDeletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedPlacementIds: string[];
}

export const PlantDeletionDialog: React.FC<PlantDeletionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedPlacementIds
}) => {
  const { placements } = usePlantPlacementStore();

  const selectedPlacements = placements.filter(p => selectedPlacementIds.includes(p.id));
  
  // Group by species for summary
  const speciesGroups = selectedPlacements.reduce((acc, placement) => {
    const speciesName = placement.species.commonName;
    acc[speciesName] = (acc[speciesName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalCount = selectedPlacementIds.length;
  const isSingle = totalCount === 1;
  const singlePlacement = isSingle ? selectedPlacements[0] : null;

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'trees': return 'bg-green-700 text-white';
      case 'shrubs': return 'bg-green-500 text-white';
      case 'ground-cover': return 'bg-green-300 text-green-800';
      case 'herbs': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'trees': return 'Árvore';
      case 'shrubs': return 'Arbusto';
      case 'ground-cover': return 'Cobertura';
      case 'herbs': return 'Erva';
      default: return category;
    }
  };

  const formatPosition = (position: { x: number; y: number }) => {
    return `${position.x.toFixed(1)}m, ${position.y.toFixed(1)}m`;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {isSingle ? 'Deletar Planta?' : `Deletar ${totalCount} Plantas?`}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                {isSingle 
                  ? 'Esta ação não pode ser desfeita. A planta será removida permanentemente do canteiro.'
                  : `Esta ação não pode ser desfeita. ${totalCount} plantas serão removidas permanentemente do canteiro.`
                }
              </p>

              {isSingle && singlePlacement ? (
                /* Single plant details */
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {singlePlacement.species.commonName}
                    </span>
                    <Badge className={getCategoryBadgeColor(singlePlacement.species.category)}>
                      {getCategoryLabel(singlePlacement.species.category)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    {singlePlacement.species.scientificName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Posição: {formatPosition(singlePlacement.position)}
                  </p>
                  {singlePlacement.notes && (
                    <p className="text-xs text-gray-500 bg-white p-2 rounded border">
                      Obs: {singlePlacement.notes}
                    </p>
                  )}
                </div>
              ) : (
                /* Multiple plants summary */
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    Plantas selecionadas:
                  </div>
                  <div className="space-y-1">
                    {Object.entries(speciesGroups).map(([speciesName, count]) => (
                      <div key={speciesName} className="flex justify-between items-center text-sm">
                        <span>{speciesName}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>
                  Dica: Use Ctrl+Z para desfazer outras ações, mas a exclusão não pode ser revertida.
                </span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isSingle ? 'Deletar Planta' : `Deletar ${totalCount} Plantas`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
