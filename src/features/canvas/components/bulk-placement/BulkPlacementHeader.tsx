
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Grid3X3 } from 'lucide-react';
import { PlantSpecies } from '../../types/species.types';
import { Bed } from '../../types/bed.types';

interface BulkPlacementHeaderProps {
  selectedSpecies: PlantSpecies;
  selectedBed: Bed;
}

export const BulkPlacementHeader: React.FC<BulkPlacementHeaderProps> = ({
  selectedSpecies,
  selectedBed,
}) => {
  return (
    <CardHeader className="pb-3">
      <CardTitle className="text-lg flex items-center gap-2">
        <Grid3X3 className="w-5 h-5 text-green-600" />
        Plantio em Massa
      </CardTitle>
      <p className="text-sm text-gray-600">
        {selectedSpecies.commonName} •{' '}
        {selectedBed.shape === 'rectangle'
          ? `${selectedBed.dimensions.length}×${selectedBed.dimensions.width}m`
          : `⌀${(selectedBed.dimensions.radius || 0) * 2}m`}
      </p>
    </CardHeader>
  );
};
