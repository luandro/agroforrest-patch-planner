
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlantSpecies } from '../../types/species.types';
import { mockSpecies } from '../../data/mockSpecies';
import { PlantSpeciesCard } from '../PlantSpeciesCard';

interface MobilePlantSpeciesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpecies?: PlantSpecies;
  onSelectSpecies: (species: PlantSpecies) => void;
}

export const MobilePlantSpeciesPanel: React.FC<MobilePlantSpeciesPanelProps> = ({
  isOpen,
  onClose,
  currentSpecies,
  onSelectSpecies
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'trees', label: 'Árvores' },
    { id: 'shrubs', label: 'Arbustos' },
    { id: 'herbs', label: 'Ervas' },
    { id: 'ground-cover', label: 'Cobertura' }
  ];

  const filteredSpecies = React.useMemo(() => {
    if (selectedCategory === 'all') return mockSpecies;
    return mockSpecies.filter(species => species.category === selectedCategory);
  }, [selectedCategory]);

  const handleSpeciesSelect = (species: PlantSpecies) => {
    onSelectSpecies(species);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-[49]"
        onClick={onClose}
      />

      {/* Panel - Slide up from bottom */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-xl border-t border-gray-200 pb-[env(safe-area-inset-bottom)] max-h-[80vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Selecionar Espécie
            </h3>
            {currentSpecies && (
              <p className="text-sm text-gray-600">
                Atual: {currentSpecies.commonName}
              </p>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Category Filters */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap ${
                  selectedCategory === category.id 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Species List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredSpecies.map((species) => (
            <div
              key={species.id}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                currentSpecies?.id === species.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleSpeciesSelect(species)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{species.commonName}</h4>
                  <p className="text-sm text-gray-600 italic">{species.scientificName}</p>
                  <p className="text-xs text-gray-500 mt-1">{species.description}</p>
                  
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {species.category === 'trees' ? 'Árvore' :
                       species.category === 'shrubs' ? 'Arbusto' :
                       species.category === 'herbs' ? 'Erva' : 'Cobertura'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {species.matureSize.height}m altura
                    </Badge>
                  </div>
                </div>
                
                {currentSpecies?.id === species.id && (
                  <Badge className="bg-green-600">
                    Atual
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
