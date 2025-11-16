
import React, { useState, useCallback } from 'react';
import { X, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import type { PlantPlacement } from '../stores/plantPlacementStore';
import { PlantSpecies } from '../types/species.types';

interface PlantEditingPanelProps {
  focusedBedId: string;
  selectedPlacementIds: string[];
  onClose: () => void;
  onDelete: () => void;
}

interface PlantEditForm {
  maturity: 'seed' | 'seedling' | 'young' | 'adult';
  spacing: number;
  variety: string;
  plantingDate: string;
  notes: string;
}

export const PlantEditingPanel: React.FC<PlantEditingPanelProps> = ({
  focusedBedId,
  selectedPlacementIds,
  onClose,
  onDelete
}) => {
  const {
    placements,
    updatePlacement,
    getPlacementsForBed
  } = usePlantPlacementStore();

  const selectedPlacements = placements.filter(p => selectedPlacementIds.includes(p.id));
  const [editForm, setEditForm] = useState<PlantEditForm>(() => {
    const firstPlacement = selectedPlacements[0];
    return {
      maturity: 'seedling',
      spacing: 2.0,
      variety: 'Padrão',
      plantingDate: new Date().toISOString().split('T')[0],
      notes: firstPlacement?.notes || ''
    };
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Group selected plants by species
  type SpeciesGroup = { species: PlantSpecies; count: number; placements: PlantPlacement[] };

  const speciesGroups = selectedPlacements.reduce<Record<string, SpeciesGroup>>((acc, placement) => {
    const speciesId = placement.species.id;
    if (!acc[speciesId]) {
      acc[speciesId] = {
        species: placement.species,
        count: 0,
        placements: []
      };
    }
    acc[speciesId].count++;
    acc[speciesId].placements.push(placement);
    return acc;
  }, {});

  const handleFormChange = useCallback(<K extends keyof PlantEditForm>(field: K, value: PlantEditForm[K]) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  }, []);

  const handleApplyChanges = useCallback(() => {
    selectedPlacementIds.forEach(placementId => {
      updatePlacement(placementId, {
        notes: editForm.notes
        // Add other fields as they're implemented in the placement store
      });
    });
    setHasUnsavedChanges(false);
  }, [selectedPlacementIds, editForm, updatePlacement]);

  const getMaturityLabel = (maturity: string) => {
    switch (maturity) {
      case 'seed': return 'Semente';
      case 'seedling': return 'Muda';
      case 'young': return 'Jovem';
      case 'adult': return 'Adulta';
      default: return 'Muda';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'trees': return 'bg-green-700 text-white';
      case 'shrubs': return 'bg-green-500 text-white';
      case 'ground-cover': return 'bg-green-300 text-green-800';
      case 'herbs': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  if (selectedPlacementIds.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Editar Planta{selectedPlacementIds.length > 1 ? 's' : ''}
          </h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Selection Summary */}
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            {selectedPlacementIds.length} planta{selectedPlacementIds.length > 1 ? 's' : ''} selecionada{selectedPlacementIds.length > 1 ? 's' : ''}
          </div>
          
          {/* Species breakdown */}
          <div className="space-y-1">
            {Object.values(speciesGroups).map(({ species, count }) => (
              <div key={species.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{species.commonName}</span>
                  <Badge className={getCategoryBadgeColor(species.category)}>
                    {species.category === 'trees' ? 'Árvore' :
                     species.category === 'shrubs' ? 'Arbusto' :
                     species.category === 'ground-cover' ? 'Cobertura' : 'Erva'}
                  </Badge>
                </div>
                <span className="text-gray-600 font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Edit Form */}
        <div className="space-y-4">
          {/* Maturity */}
          <div className="space-y-2">
            <Label htmlFor="maturity" className="text-sm font-medium">Maturidade</Label>
            <Select
              value={editForm.maturity}
              onValueChange={(value: PlantEditForm['maturity']) => handleFormChange('maturity', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seed">Semente</SelectItem>
                <SelectItem value="seedling">Muda</SelectItem>
                <SelectItem value="young">Jovem</SelectItem>
                <SelectItem value="adult">Adulta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Spacing */}
          <div className="space-y-2">
            <Label htmlFor="spacing" className="text-sm font-medium">Espaçamento (m)</Label>
            <Input
              id="spacing"
              type="number"
              step="0.1"
              min="0.1"
              max="10"
              value={editForm.spacing}
              onChange={(e) => handleFormChange('spacing', parseFloat(e.target.value) || 0)}
              className="text-sm"
            />
          </div>

          {/* Variety */}
          <div className="space-y-2">
            <Label htmlFor="variety" className="text-sm font-medium">Variedade</Label>
            <Select
              value={editForm.variety}
              onValueChange={(value: PlantEditForm['variety']) => handleFormChange('variety', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Padrão">Padrão</SelectItem>
                <SelectItem value="Híbrida">Híbrida</SelectItem>
                <SelectItem value="Nativa">Nativa</SelectItem>
                <SelectItem value="Melhorada">Melhorada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Planting Date */}
          <div className="space-y-2">
            <Label htmlFor="plantingDate" className="text-sm font-medium">Data de Plantio</Label>
            <Input
              id="plantingDate"
              type="date"
              value={editForm.plantingDate}
              onChange={(e) => handleFormChange('plantingDate', e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Observações</Label>
            <Textarea
              id="notes"
              value={editForm.notes}
              onChange={(e) => handleFormChange('notes', e.target.value)}
              placeholder="Adicione observações sobre estas plantas..."
              className="text-sm resize-none"
              rows={3}
            />
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={handleApplyChanges}
            disabled={!hasUnsavedChanges}
            className="w-full"
            size="sm"
          >
            Aplicar Mudanças
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={onDelete}
              variant="destructive"
              size="sm"
              className="flex-1 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Deletar{selectedPlacementIds.length > 1 ? ` (${selectedPlacementIds.length})` : ''}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                // TODO: Implement duplicate functionality
                console.log('Duplicate plants');
              }}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Quick Actions for Multi-Select */}
        {selectedPlacementIds.length > 1 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="text-xs text-gray-500 font-medium">Ações Rápidas</div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs flex-1"
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
                  className="text-xs flex-1"
                  onClick={() => {
                    // TODO: Adjust spacing proportionally
                    console.log('Adjust spacing');
                  }}
                >
                  Espaçar
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Status indicator */}
        {hasUnsavedChanges && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            Alterações não salvas
          </div>
        )}
      </div>
    </div>
  );
};
