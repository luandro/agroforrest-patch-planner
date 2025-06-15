
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CompatibilityLevel } from '../types/species.types';

interface PlantCompatibilityFilterProps {
  selected: CompatibilityLevel | 'all';
  onSelect: (compatibility: CompatibilityLevel | 'all') => void;
}

export const PlantCompatibilityFilter: React.FC<PlantCompatibilityFilterProps> = ({
  selected,
  onSelect
}) => {
  const compatibilities: Array<{ 
    value: CompatibilityLevel | 'all'; 
    label: string; 
    color: string;
    dotColor: string;
  }> = [
    { 
      value: 'all', 
      label: 'Todas', 
      color: 'text-gray-700',
      dotColor: 'bg-gray-400'
    },
    { 
      value: 'high', 
      label: 'Alta', 
      color: 'text-green-700',
      dotColor: 'bg-green-500'
    },
    { 
      value: 'medium', 
      label: 'Média', 
      color: 'text-yellow-700',
      dotColor: 'bg-yellow-500'
    },
    { 
      value: 'low', 
      label: 'Baixa', 
      color: 'text-red-700',
      dotColor: 'bg-red-500'
    }
  ];

  return (
    <div>
      <label className="text-xs font-medium text-gray-700 mb-2 block">
        Compatibilidade
      </label>
      <div className="flex flex-wrap gap-1">
        {compatibilities.map(compatibility => (
          <Button
            key={compatibility.value}
            variant={selected === compatibility.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(compatibility.value)}
            className={cn(
              "text-xs h-8 px-3 flex items-center gap-1.5",
              selected === compatibility.value && "ring-2 ring-blue-500 ring-offset-1"
            )}
          >
            {compatibility.value !== 'all' && (
              <div className={`w-2 h-2 rounded-full ${compatibility.dotColor}`} />
            )}
            <span className={compatibility.color}>
              {compatibility.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
