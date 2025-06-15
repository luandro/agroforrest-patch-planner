
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface PlantSelectionResultsProps {
  count: number;
}

export const PlantSelectionResults: React.FC<PlantSelectionResultsProps> = ({
  count
}) => {
  const isMobile = useIsMobile();

  // On mobile, make this very compact or hide it
  if (isMobile) {
    return (
      <div className="px-2 py-1 bg-gray-50 border-b border-gray-100 flex-shrink-0">
        <p className="text-xs text-gray-600">
          {count} espécie{count !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex-shrink-0">
      <p className="text-sm text-gray-600">
        {count} espécie{count !== 1 ? 's' : ''} encontrada{count !== 1 ? 's' : ''}
      </p>
    </div>
  );
};
