
import React from 'react';
import { cn } from '@/lib/utils';
import { PlantSpecies } from '../types/species.types';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
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

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div className={cn(
        "fixed top-16 right-0 h-[calc(100vh-4rem)] w-96 bg-white/95 backdrop-blur-sm shadow-xl border-l border-gray-200 z-50",
        "flex flex-col",
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
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
