
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Copy, Move } from 'lucide-react';
import { usePlantEditorActions } from '../../hooks/usePlantEditorActions';

interface DesktopPlantEditorProps {
  selectedPlacementIds: string[];
  onClose: () => void;
  focusedBedId: string;
}

export const DesktopPlantEditor: React.FC<DesktopPlantEditorProps> = ({
  selectedPlacementIds,
  onClose,
  focusedBedId: _focusedBedId
}) => {
  const {
    speciesGroups,
    selectedCount,
    handleDelete,
    handleDuplicate,
    handleEdit,
    handleMove,
    handleSelectSameSpecies,
    handleAdjustSpacing,
    getDeleteLabel,
    getSelectionLabel
  } = usePlantEditorActions({
    selectedPlacementIds,
    onClose
  });

  const handleDeleteWithConfirm = () => {
    if (confirm(`Deletar ${selectedCount} planta${selectedCount > 1 ? 's' : ''}?`)) {
      handleDelete();
    }
  };

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
            {getSelectionLabel()}:
          </div>
          <div className="space-y-1">
            {Object.values(speciesGroups).map(({ species, count }) => (
              <div key={species.id} className="flex justify-between items-center">
                <span className="text-sm">{species.commonName}</span>
                <Badge variant="secondary">{count.toString()}</Badge>
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
          {selectedCount > 1 && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleSelectSameSpecies}
              >
                Mesma Espécie
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleAdjustSpacing}
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
          onClick={handleDeleteWithConfirm}
          className="w-full flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {getDeleteLabel()}
        </Button>
      </CardContent>
    </Card>
  );
};
