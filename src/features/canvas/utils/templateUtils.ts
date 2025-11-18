
import { PlantingTemplate, TemplatePreview, TemplateCompatibility, ScaledTemplatePlant } from '../types/template.types';
import { Bed } from '../types/bed.types';
import { getSpeciesForTemplate } from '../data/plantingTemplates';

export const calculateTemplateCompatibility = (
  template: PlantingTemplate,
  bed: Bed
): TemplateCompatibility => {
  const bedWidth = bed.shape === 'rectangle' ? bed.dimensions.width || 1 : (bed.dimensions.radius || 0.5) * 2;
  const bedLength = bed.shape === 'rectangle' ? bed.dimensions.length || 1 : (bed.dimensions.radius || 0.5) * 2;
  
  const widthRatio = bedWidth / template.bedSize.width;
  const lengthRatio = bedLength / template.bedSize.length;
  const scaleRatio = Math.min(widthRatio, lengthRatio);
  
  let bedSizeMatch: TemplateCompatibility['bedSizeMatch'];
  let message: string;
  
  if (scaleRatio >= 1.0) {
    bedSizeMatch = 'perfect';
    message = 'Perfeito! O canteiro tem tamanho ideal para este modelo.';
  } else if (scaleRatio >= 0.8) {
    bedSizeMatch = 'good';
    message = 'Bom ajuste. Plantas ficarão um pouco mais próximas.';
  } else if (scaleRatio >= 0.6) {
    bedSizeMatch = 'tight';
    message = 'Apertado. Considere remover algumas plantas ou usar canteiro maior.';
  } else {
    bedSizeMatch = 'too-small';
    message = 'Canteiro muito pequeno. Recomenda-se canteiro maior para melhores resultados.';
  }
  
  return {
    bedSizeMatch,
    scaleRatio,
    message
  };
};

export const scaleTemplateToFit = (
  template: PlantingTemplate,
  bed: Bed,
  forceScale: boolean = false
): ScaledTemplatePlant[] => {
  const compatibility = calculateTemplateCompatibility(template, bed);
  const scaleRatio = forceScale ? compatibility.scaleRatio : Math.min(compatibility.scaleRatio, 1.0);
  
  return template.plants.map(plant => {
    const species = getSpeciesForTemplate(plant.speciesId);
    
    return {
      ...plant,
      scaledPosition: {
        x: plant.position.x * scaleRatio,
        y: plant.position.y * scaleRatio
      },
      species
    };
  });
};

export const generateTemplatePreview = (
  template: PlantingTemplate,
  bed: Bed
): TemplatePreview => {
  const compatibility = calculateTemplateCompatibility(template, bed);
  const scaledPlants = scaleTemplateToFit(template, bed);
  
  const warnings: string[] = [];
  
  if (compatibility.bedSizeMatch === 'too-small') {
    warnings.push('Canteiro muito pequeno - algumas plantas podem não se desenvolver bem');
  }
  
  if (compatibility.bedSizeMatch === 'tight') {
    warnings.push('Espaçamento reduzido - monitore crescimento das plantas');
  }
  
  // Check for overlapping plants
  for (let i = 0; i < scaledPlants.length; i++) {
    for (let j = i + 1; j < scaledPlants.length; j++) {
      const plant1 = scaledPlants[i];
      const plant2 = scaledPlants[j];
      const distance = Math.sqrt(
        Math.pow(plant1.scaledPosition.x - plant2.scaledPosition.x, 2) +
        Math.pow(plant1.scaledPosition.y - plant2.scaledPosition.y, 2)
      );
      
      if (distance < 0.3) { // Less than 30cm apart
        warnings.push(`${plant1.species?.commonName} e ${plant2.species?.commonName} ficaram muito próximas`);
      }
    }
  }
  
  return {
    template,
    scaledPlants,
    compatibility,
    warnings
  };
};

export const canPlaceTemplate = (bed: Bed): boolean => {
  // Check if bed is in focus mode and has sufficient space
  const minArea = 0.5; // 0.5 m²
  
  if (bed.shape === 'rectangle') {
    const area = (bed.dimensions.width || 1) * (bed.dimensions.length || 1);
    return area >= minArea;
  } else {
    const radius = bed.dimensions.radius || 0.5;
    const area = Math.PI * radius * radius;
    return area >= minArea;
  }
};

export const filterTemplates = (
  templates: PlantingTemplate[],
  filter: { 
    searchTerm?: string;
    category?: PlantingTemplate['category'];
    difficulty?: PlantingTemplate['difficulty'];
    bedSize?: { width: number; length: number };
  }
): PlantingTemplate[] => {
  return templates.filter(template => {
    // Search term filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      const matchesSearch = 
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    // Category filter
    if (filter.category && template.category !== filter.category) {
      return false;
    }
    
    // Difficulty filter
    if (filter.difficulty && template.difficulty !== filter.difficulty) {
      return false;
    }
    
    // Bed size filter
    if (filter.bedSize) {
      const templateArea = template.bedSize.width * template.bedSize.length;
      const filterArea = filter.bedSize.width * filter.bedSize.length;
      
      if (templateArea > filterArea * 1.5) { // Template needs 50% more space
        return false;
      }
    }
    
    return true;
  });
};
