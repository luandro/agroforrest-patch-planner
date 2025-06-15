
import React from 'react';
import { Search } from 'lucide-react';

interface PlantSelectionResultsProps {
  count: number;
}

export const PlantSelectionResults: React.FC<PlantSelectionResultsProps> = ({
  count
}) => {
  return (
    <div className="px-4 py-3 text-sm bg-gray-50 border-b border-gray-200 flex items-center gap-2">
      <Search className="w-4 h-4 text-gray-400" />
      <span className="text-gray-600">
        {count} espécie{count !== 1 ? 's' : ''} encontrada{count !== 1 ? 's' : ''}
      </span>
      {count === 0 && (
        <span className="text-gray-400 ml-2">
          • Tente ajustar os filtros
        </span>
      )}
    </div>
  );
};
