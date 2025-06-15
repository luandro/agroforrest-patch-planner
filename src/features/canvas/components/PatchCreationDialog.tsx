
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PatchCreationData } from '../types/patch.types';

interface PatchCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePatch: (data: PatchCreationData) => Promise<void>;
  duplicateFromPatchId?: string;
  duplicateFromName?: string;
}

const PRESET_SIZES = [
  { label: 'Pequeno (10x10m)', width: 10, height: 10 },
  { label: 'Médio (20x20m)', width: 20, height: 20 },
  { label: 'Grande (50x50m)', width: 50, height: 50 },
  { label: 'Personalizado', width: 0, height: 0 }
];

export const PatchCreationDialog: React.FC<PatchCreationDialogProps> = ({
  isOpen,
  onClose,
  onCreatePatch,
  duplicateFromPatchId,
  duplicateFromName
}) => {
  const [formData, setFormData] = useState<PatchCreationData>({
    name: duplicateFromName ? `${duplicateFromName} (Cópia)` : '',
    description: '',
    size: { width: 20, height: 20 },
    location: '',
    duplicateFrom: duplicateFromPatchId
  });
  const [selectedSizePreset, setSelectedSizePreset] = useState('Médio (20x20m)');
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleSizePresetChange = (preset: string) => {
    setSelectedSizePreset(preset);
    const presetData = PRESET_SIZES.find(p => p.label === preset);
    if (presetData) {
      if (preset === 'Personalizado') {
        setIsCustomSize(true);
      } else {
        setIsCustomSize(false);
        setFormData(prev => ({
          ...prev,
          size: { width: presetData.width, height: presetData.height }
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      await onCreatePatch(formData);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        size: { width: 20, height: 20 },
        location: ''
      });
      setSelectedSizePreset('Médio (20x20m)');
      setIsCustomSize(false);
    } catch (error) {
      console.error('Failed to create patch:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {duplicateFromPatchId ? 'Duplicar Canteiro' : 'Criar Novo Canteiro'}
          </DialogTitle>
          <DialogDescription>
            {duplicateFromPatchId 
              ? 'Crie uma cópia do canteiro existente com todas as plantas e configurações.'
              : 'Configure as informações básicas do seu novo canteiro agroflorestal.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Canteiro *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Canteiro Principal"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o propósito deste canteiro..."
              rows={3}
            />
          </div>

          {/* Size Preset */}
          <div className="space-y-2">
            <Label>Tamanho do Canteiro</Label>
            <Select value={selectedSizePreset} onValueChange={handleSizePresetChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRESET_SIZES.map(size => (
                  <SelectItem key={size.label} value={size.label}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Size */}
          {isCustomSize && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="width">Largura (m)</Label>
                <Input
                  id="width"
                  type="number"
                  min="1"
                  max="200"
                  value={formData.size.width}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    size: { ...prev.size, width: Number(e.target.value) }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Comprimento (m)</Label>
                <Input
                  id="height"
                  type="number"
                  min="1"
                  max="200"
                  value={formData.size.height}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    size: { ...prev.size, height: Number(e.target.value) }
                  }))}
                />
              </div>
            </div>
          )}

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Ex: Fazenda São João, Quadra A"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.name.trim() || isCreating}>
              {isCreating ? 'Criando...' : (duplicateFromPatchId ? 'Duplicar' : 'Criar Canteiro')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
