
import React, { useState } from 'react';
import { ChevronDown, Plus, Copy, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePatchStore } from '../stores/patchStore';
import { PatchCreationDialog } from './PatchCreationDialog';
import { PatchCreationData } from '../types/patch.types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PatchSelectorProps {
  onPatchSwitch?: (patchId: string) => void;
}

export const PatchSelector: React.FC<PatchSelectorProps> = ({ onPatchSwitch }) => {
  const { 
    patches, 
    currentPatchId, 
    setCurrentPatch, 
    createPatch, 
    duplicatePatch,
    getCurrentPatch 
  } = usePatchStore();
  
  const [isCreationDialogOpen, setIsCreationDialogOpen] = useState(false);
  const [duplicateFromPatchId, setDuplicateFromPatchId] = useState<string | undefined>();
  
  const currentPatch = getCurrentPatch();

  const handlePatchSelect = (patchId: string) => {
    if (patchId !== currentPatchId) {
      setCurrentPatch(patchId);
      onPatchSwitch?.(patchId);
    }
  };

  const handleCreatePatch = async (data: PatchCreationData) => {
    if (data.duplicateFrom) {
      await duplicatePatch(data.duplicateFrom, data.name);
    } else {
      await createPatch(data);
    }
  };

  const handleDuplicatePatch = (patchId: string) => {
    setDuplicateFromPatchId(patchId);
    setIsCreationDialogOpen(true);
  };

  const handleCreateNew = () => {
    setDuplicateFromPatchId(undefined);
    setIsCreationDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[200px] justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <MapPin size={16} className="text-green-600 flex-shrink-0" />
              <span className="truncate">
                {currentPatch?.name || 'Selecionar Canteiro'}
              </span>
            </div>
            <ChevronDown size={16} className="flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-[300px]" align="start">
          <DropdownMenuLabel>Meus Canteiros</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Current Patches */}
          {patches.map((patch) => (
            <DropdownMenuItem
              key={patch.id}
              onClick={() => handlePatchSelect(patch.id)}
              className={`p-3 ${patch.id === currentPatchId ? 'bg-green-50 border-l-2 border-l-green-500' : ''}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium truncate">{patch.name}</span>
                    {patch.id === currentPatchId && (
                      <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded flex-shrink-0">
                        Ativo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                    <span>{patch.size.width}×{patch.size.height}m</span>
                    <span className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{formatDistanceToNow(patch.createdAt, { locale: ptBR, addSuffix: true })}</span>
                    </span>
                  </div>
                  {patch.location && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">{patch.location}</p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-6 w-6 p-0 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicatePatch(patch.id);
                  }}
                >
                  <Copy size={12} />
                </Button>
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          {/* Create New */}
          <DropdownMenuItem onClick={handleCreateNew} className="p-3 text-green-700">
            <div className="flex items-center space-x-2">
              <Plus size={16} />
              <span className="font-medium">Criar Novo Canteiro</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PatchCreationDialog
        isOpen={isCreationDialogOpen}
        onClose={() => setIsCreationDialogOpen(false)}
        onCreatePatch={handleCreatePatch}
        duplicateFromPatchId={duplicateFromPatchId}
        duplicateFromName={duplicateFromPatchId ? patches.find(p => p.id === duplicateFromPatchId)?.name : undefined}
      />
    </>
  );
};
