
import React from 'react';

interface PlantSelectionResultsProps {
  count: number;
}

export const PlantSelectionResults: React.FC<PlantSelectionResultsProps> = ({
  count
}) => {
  return (
    <div className="px-4 py-2 text-sm text-gray-600 bg-gray-50">
      {count} espécie{count !== 1 ? 's' : ''} encontrada{count !== 1 ? 's' : ''}
    </div>
  );
};
