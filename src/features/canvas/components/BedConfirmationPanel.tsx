
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Bed, BedConfig } from '../types/bed.types';
import { BedConfirmationPanelDesktop } from './BedConfirmationPanelDesktop';
import { BedConfirmationPanelMobile } from './BedConfirmationPanelMobile';

interface BedConfirmationPanelProps {
  bed: Bed;
  beds?: Bed[];
  bedConfig: BedConfig;
  multiCreationMode: boolean;
  onMultiCreationToggle: (enabled: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  hasCollision?: boolean;
  className?: string;
  isEditingDimensions?: boolean;
  setIsEditingDimensions?: (isEditing: boolean) => void;
}

export const BedConfirmationPanel: React.FC<BedConfirmationPanelProps> = (props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <BedConfirmationPanelMobile {...props} />;
  }

  return <BedConfirmationPanelDesktop {...props} />;
};
