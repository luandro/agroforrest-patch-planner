
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Copy, Move, Eye } from 'lucide-react';
import { usePlantPlacementStore } from '../../stores/plantPlacementStore';

interface DesktopPlantEditorProps {
  selectedPlacementIds: string[];
  onClose: () => void;
  focusedBedId: string;
}

export const DesktopPlantEditor: React.FC<DesktopPlantEditorProps> = ({
  selectedPlacementIds,
  onClose,
  focusedBedId
}) => {
  const { 
    placements, 
    removePlacements, 
    updatePlacement,
    getPlacementsForBed 
  } = usePlantPlacementStore();

  const selectedPlacements = placements.filter(p => 
    selectedPlacementIds.includes(p.id)
  );

  const handleDelete = () => {
    if (confirm(`Deletar ${selectedPlacements.length} planta${selectedPlacements.length > 1 ? 's' : ''}?`)) {
      removePlacements(selectedPlacementIds);
      onClose();
    }
  };

  const handleDuplicate = () => {
    // TODO: Implement duplication logic
    console.log('Duplicate plants:', selectedPlacementIds);
  };

  const handleEdit = () => {
    // TODO: Open detailed editing panel
    console.log('Edit plants:', selectedPlacementIds);
  };

  const handleMove = () => {
    // TODO: Implement move to different bed
    console.log('Move plants:', selectedPlacementIds);
  };

  // Group by species for display
  const speciesGroups = selectedPlacements.reduce((acc, placement) => {
    const speciesName = placement.species.commonName;
    acc[speciesName] = (acc[speciesName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (selectedPlacementIds.length === 0) {
    return null;
  }

  return (
    <Card className="fixed top-20 right-4 w-80 z-30 bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Plantas Selecionadas
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Selection Summary */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-gray-900 mb-2">
            {selectedPlacementIds.length} planta{selectedPlacementIds.length > 1 ? 's' : ''} selecionada{selectedPlacementIds.length > 1 ? 's' : ''}:
          </div>
          <div className="space-y-1">
            {Object.entries(speciesGroups).map(([speciesName, count]) => (
              <div key={speciesName} className="flex justify-between items-center">
                <span className="text-sm">{speciesName}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Duplicar
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMove}
            className="w-full flex items-center gap-2"
          >
            <Move className="w-4 h-4" />
            Mover para Outro Canteiro
          </Button>

          {/* Quick Selection Actions */}
          {selectedPlacementIds.length > 1 && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  // TODO: Select all same species
                  console.log('Select same species');
                }}
              >
                Mesma Espécie
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  // TODO: Adjust spacing
                  console.log('Adjust spacing');
                }}
              >
                Ajustar Espaço
              </Button>
            </div>
          )}
        </div>

        {/* Delete Action */}
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="w-full flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Deletar {selectedPlacementIds.length > 1 ? `${selectedPlacementIds.length} Plantas` : 'Planta'}
        </Button>
      </CardContent>
    </Card>
  );
};
