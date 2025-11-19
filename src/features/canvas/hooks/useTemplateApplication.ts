
import { useCallback } from 'react';
import { PlantSpecies } from '../types/species.types';
import { PlantingTemplate } from '../types/template.types';
import { Bed } from '../types/bed.types';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { scaleTemplateToFit } from '../utils/templateUtils';

interface UseTemplateApplicationProps {
  focusedBed: Bed | null;
}

/**
 * Hook to handle planting template application to a bed
 */
export function useTemplateApplication({ focusedBed }: UseTemplateApplicationProps) {
  const { addPlacement } = usePlantPlacementStore();

  const handleApplyTemplate = useCallback((template: PlantingTemplate) => {
    if (!focusedBed) {
      console.error('No focused bed available for template placement');
      return;
    }

    console.log('Applying template:', template.name);

    // Generate scaled template
    const scaledPlants = scaleTemplateToFit(template, focusedBed, true);

    // Add each plant from the template
    scaledPlants.forEach(templatePlant => {
      if (!templatePlant.species) {
        console.warn('Species not found for template plant:', templatePlant.speciesId);
        return;
      }

      // Convert template plant to our species format
      const species: PlantSpecies = {
        id: templatePlant.species.id,
        commonName: templatePlant.species.commonName,
        scientificName: templatePlant.species.scientificName,
        category: templatePlant.species.category,
        companionCompatibility: 'high', // Templates should have good compatibility
        matureSize: { height: 2, width: 1 }, // Default values
        spacing: { min: 0.3, max: 1.0 },
        growthRate: 'medium',
        sunRequirement: 'partial',
        waterRequirement: 'medium'
      };

      // Add multiple placements for quantity > 1
      for (let i = 0; i < templatePlant.quantity; i++) {
        const offsetX = i * 0.1; // Small offset for multiple plants
        const offsetY = i * 0.1;

        addPlacement({
          bedId: focusedBed.id,
          species: species,
          position: {
            x: templatePlant.scaledPosition.x + offsetX,
            y: templatePlant.scaledPosition.y + offsetY
          },
          notes: `Modelo: ${template.name}${templatePlant.notes ? ` - ${templatePlant.notes}` : ''}`
        });
      }
    });

    console.log(`Template '${template.name}' applied with ${scaledPlants.length} plant types`);
  }, [focusedBed, addPlacement]);

  return { handleApplyTemplate };
}
