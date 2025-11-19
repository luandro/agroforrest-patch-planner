
import React from 'react';
import { Edit, Copy, Move, Trash2, Eye } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuShortcut
} from '@/components/ui/context-menu';
import { PlantPlacement } from '../stores/plantPlacementStore';

interface PlantContextMenuProps {
  children: React.ReactNode;
  placement: PlantPlacement;
  isSelected: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSelect: () => void;
  onMove: () => void;
}

export const PlantContextMenu: React.FC<PlantContextMenuProps> = ({
  children,
  placement: _placement,
  isSelected,
  onEdit,
  onDuplicate,
  onDelete,
  onSelect,
  onMove
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={onEdit} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          Editar Planta
          <ContextMenuShortcut>F2</ContextMenuShortcut>
        </ContextMenuItem>
        
        <ContextMenuItem onClick={onSelect} className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" />
          {isSelected ? 'Desselecionar' : 'Selecionar'}
          <ContextMenuShortcut>Click</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={onDuplicate} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Duplicar
          <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={onMove} className="cursor-pointer">
          <Move className="mr-2 h-4 w-4" />
          Mover para...
          <ContextMenuShortcut>Ctrl+M</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem 
          onClick={onDelete} 
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
