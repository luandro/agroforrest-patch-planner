import { PlantSpecies } from './species.types';

export interface PlantingTemplate {
  id: string;
  name: string;
  description: string;
  category: 'pre-defined' | 'user-created' | 'community';
  plants: TemplatePlant[];
  bedSize: { width: number; length: number }; // minimum bed size in meters
  climate: string[]; // "tropical", "savanna", "temperate"
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  benefits: string[];
  harvestSchedule?: string;
  maintenanceLevel: 'low' | 'medium' | 'high';
  createdBy?: string;
  isPublic?: boolean;
  rating?: number;
  imageUrl?: string;
}

export interface TemplatePlant {
  speciesId: string;
  position: { x: number; y: number }; // relative to bed center in meters
  maturity: 'seed' | 'seedling' | 'young' | 'mature';
  quantity: number;
  notes?: string;
  priority: 'primary' | 'secondary' | 'filler'; // for scaling decisions
}

export interface TemplatePreview {
  template: PlantingTemplate;
  scaledPlants: ScaledTemplatePlant[];
  compatibility: TemplateCompatibility;
  warnings: string[];
}

export interface ScaledTemplatePlant extends TemplatePlant {
  scaledPosition: { x: number; y: number };
  species?: PlantSpecies; // PlantSpecies reference
}

export interface TemplateCompatibility {
  bedSizeMatch: 'perfect' | 'good' | 'tight' | 'too-small';
  scaleRatio: number;
  message: string;
}

export type TemplateFilter = {
  category?: PlantingTemplate['category'];
  difficulty?: PlantingTemplate['difficulty'];
  bedSize?: { width: number; length: number };
  searchTerm?: string;
};
