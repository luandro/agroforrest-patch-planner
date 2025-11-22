import React from 'react';
import { cn } from '@/lib/utils';
import { PlantSpecies } from '../types/species.types';
import { PlantSelectionPanelContent } from './PlantSelectionPanelContent';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PlantLibrarySidebarProps {
  onSelectSpecies: (species: PlantSpecies) => void;
  selectedBedId?: string;
  selectedSpecies?: PlantSpecies | null;
  isPlacing?: boolean;
}

/**
 * PlantLibrarySidebar - Persistent left sidebar for plant library
 * Displays plant categories, search, and allows plant selection
 */
export const PlantLibrarySidebar: React.FC<PlantLibrarySidebarProps> = ({
  onSelectSpecies,
  selectedBedId,
  selectedSpecies,
  isPlacing = false
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Biblioteca de Plantas
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-green-600"
            title="Adicionar nova planta"
          >
            <Plus size={18} />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            type="text"
            placeholder="Buscar plantas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Active Selection Indicator */}
        {isPlacing && selectedSpecies && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700 font-medium">
              Plantando: {selectedSpecies.commonName}
            </p>
            <p className="text-xs text-green-600">
              Clique no canteiro para posicionar
            </p>
          </div>
        )}
      </div>

      {/* Plant List */}
      <div className="flex-1 overflow-y-auto">
        <PlantSelectionPanelContent
          onSelectSpecies={onSelectSpecies}
          searchQuery={searchQuery}
        />
      </div>

      {/* Footer with stats or help */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 text-center">
          Selecione uma planta para começar
        </p>
      </div>
    </div>
  );
};
