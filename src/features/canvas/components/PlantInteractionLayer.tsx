
import React from 'react';
import { PlantContextMenu } from './PlantContextMenu';
import { PlantPlacement } from '../stores/plantPlacementStore';

interface PlantInteractionLayerProps {
  placement: PlantPlacement;
  isSelected: boolean;
  isHovered: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSelect: () => void;
  onMove: () => void;
  children: React.ReactNode;
}

export const PlantInteractionLayer: React.FC<PlantInteractionLayerProps> = ({
  placement,
  isSelected,
  isHovered: _isHovered,
  onEdit,
  onDuplicate,
  onDelete,
  onSelect,
  onMove,
  children
}) => {
  return (
    <PlantContextMenu
      placement={placement}
      isSelected={isSelected}
      onEdit={onEdit}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      onSelect={onSelect}
      onMove={onMove}
    >
      {children}
    </PlantContextMenu>
  );
};
