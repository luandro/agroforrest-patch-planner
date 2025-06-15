
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlantCategory } from '../types/species.types';

interface PlantCategoryFilterProps {
  selected: PlantCategory | 'all';
  onSelect: (category: PlantCategory | 'all') => void;
}

export const PlantCategoryFilter: React.FC<PlantCategoryFilterProps> = ({
  selected,
  onSelect
}) => {
  const categories: Array<{ value: PlantCategory | 'all'; label: string; icon: string }> = [
    { value: 'all', label: 'Todas', icon: '🌿' },
    { value: 'trees', label: 'Árvores', icon: '🌳' },
    { value: 'shrubs', label: 'Arbustos', icon: '🌲' },
    { value: 'ground-cover', label: 'Cobertura', icon: '🍀' },
    { value: 'herbs', label: 'Ervas', icon: '🌱' }
  ];

  return (
    <div>
      <label className="text-xs font-medium text-gray-700 mb-2 block">
        Categoria
      </label>
      <div className="flex flex-wrap gap-1">
        {categories.map(category => (
          <Button
            key={category.value}
            variant={selected === category.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(category.value)}
            className={cn(
              "text-xs h-8 px-3",
              selected === category.value && "ring-2 ring-blue-500 ring-offset-1"
            )}
          >
            <span className="mr-1">{category.icon}</span>
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
