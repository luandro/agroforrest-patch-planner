
import React from 'react';
import { cn } from '@/lib/utils';
import { PlantSpecies } from '../types/species.types';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { PlantSelectionHeader } from './PlantSelectionHeader';
import { PlantSelectionPanelContent } from './PlantSelectionPanelContent';

interface PlantSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSpecies: (species: PlantSpecies) => void;
  selectedBedId?: string;
}

export const PlantSelectionPanel: React.FC<PlantSelectionPanelProps> = ({
  isOpen,
  onClose,
  onSelectSpecies,
  selectedBedId
}) => {
  const { selectedSpecies, isPlacing } = usePlantPlacementStore();
  const isMobile = useIsMobile();

  // Don't render anything if not open
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop - only render when open */}
      <div 
        className="fixed inset-0 bg-black/30 z-[49]"
        onClick={onClose}
      />

      {/* Panel - Mobile responsive */}
      <div className={cn(
        "fixed z-50 bg-white/95 backdrop-blur-sm shadow-xl",
        "flex flex-col transition-transform duration-300 ease-in-out",
        // Mobile: Full screen style
        isMobile && [
          "inset-0",
          "pt-[env(safe-area-inset-top)]",
          "pb-[env(safe-area-inset-bottom)]",
        ],
        // Desktop: Right sidebar
        !isMobile && [
          "top-16 right-0 h-[calc(100vh-4rem)] w-96 border-l border-gray-200",
          "translate-x-0"
        ]
      )}>
        <PlantSelectionHeader
          onClose={onClose}
          isPlacing={isPlacing}
          selectedSpecies={selectedSpecies}
          selectedBedId={selectedBedId}
        />

        <PlantSelectionPanelContent
          onSelectSpecies={onSelectSpecies}
        />
      </div>
    </>
  );
};
