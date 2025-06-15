
export interface PlantSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  category: PlantCategory;
  image?: string;
  companionCompatibility: CompatibilityLevel;
  matureSize: {
    height: number; // in meters
    width: number; // in meters
  };
  spacing: {
    min: number; // minimum spacing in meters
    max: number; // maximum spacing in meters
  };
  description?: string;
  growthRate: GrowthRate;
  sunRequirement: SunRequirement;
  waterRequirement: WaterRequirement;
  isEdible?: boolean;
}

export type PlantCategory = 'trees' | 'shrubs' | 'ground-cover' | 'herbs';

export type CompatibilityLevel = 'high' | 'medium' | 'low';

export type GrowthRate = 'slow' | 'medium' | 'fast';

export type SunRequirement = 'full' | 'partial' | 'shade';

export type WaterRequirement = 'low' | 'medium' | 'high';

export interface PlantFilter {
  category?: PlantCategory;
  compatibility?: CompatibilityLevel;
  searchTerm?: string;
}
