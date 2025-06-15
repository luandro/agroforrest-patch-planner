
import React, { useState } from 'react';
import { usePatchStore } from '../stores/patchStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { useBedStore } from '../stores/bedStore';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';

interface PatchSwitcherDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const PatchSwitcherDialog: React.FC<PatchSwitcherDialogProps> = ({ isOpen, onOpenChange }) => {
  const { patches, activePatchId, setActivePatchId, addPatch, removePatch } = usePatchStore();
  const { removeBedsForPatch } = useBedStore();
  const { clearPlacementsForPatch } = usePlantPlacementStore.getState();
  const [newPatchName, setNewPatchName] = useState('');

  const handleCreatePatch = () => {
    if (newPatchName.trim()) {
      const newPatchId = addPatch({ name: newPatchName.trim() });
      setActivePatchId(newPatchId);
      setNewPatchName('');
      onOpenChange(false);
    }
  };

  const handleSelectPatch = (patchId: string) => {
    setActivePatchId(patchId);
    onOpenChange(false);
  };
  
  const handleDeletePatch = (patchId: string, patchName: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o canteiro "${patchName}"? Essa ação não pode ser desfeita.`)) {
      if (activePatchId === patchId) {
        // If deleting active patch, switch to another one or null
        const otherPatch = patches.find(p => p.id !== patchId);
        setActivePatchId(otherPatch?.id ?? null);
      }
      removePatch(patchId);
      removeBedsForPatch(patchId);
      clearPlacementsForPatch(patchId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Canteiros</DialogTitle>
          <DialogDescription>
            Crie um novo canteiro ou selecione um para editar.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Canteiros existentes</h3>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {patches.length > 0 ? patches.map(patch => (
                <div key={patch.id} className="flex items-center justify-between gap-2">
                  <Button
                    variant={patch.id === activePatchId ? 'default' : 'outline'}
                    className="flex-grow justify-start"
                    onClick={() => handleSelectPatch(patch.id)}
                  >
                    {patch.name}
                  </Button>
                   <Button variant="ghost" size="icon" onClick={() => handleDeletePatch(patch.id, patch.name)} disabled={patches.length <= 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum canteiro encontrado.</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Criar novo canteiro</h3>
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Nome do novo canteiro"
                value={newPatchName}
                onChange={(e) => setNewPatchName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreatePatch()}
              />
              <Button onClick={handleCreatePatch} disabled={!newPatchName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Criar
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
