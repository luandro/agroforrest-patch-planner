
export interface BulkPlacementConfig {
  pattern: 'auto' | 'grid' | 'rows' | 'staggered';
  spacing: number; // in meters
  marginFromEdge: number; // in meters
  maxPlantsPerRow?: number;
  maxRows?: number;
}

export interface PlacementPosition {
  x: number;
  y: number;
  row: number;
  column: number;
}

export interface BulkPlacementPreview {
  positions: PlacementPosition[];
  totalCount: number;
  pattern: string;
  spacing: number;
  conflicts: number; // positions blocked by existing plants
  coverage: {
    usedArea: number;
    totalArea: number;
    efficiency: number; // percentage
  };
}

export interface BulkPlacementRequest {
  bedId: string;
  speciesId: string;
  config: BulkPlacementConfig;
}

export type PlantType = 'ground-cover' | 'vegetables' | 'herbs' | 'shrubs' | 'trees';

export interface PlantSpacingRules {
  type: PlantType;
  idealSpacing: number; // in meters
  minSpacing: number;
  maxSpacing: number;
  preferredPattern: 'grid' | 'rows' | 'staggered';
  maxPlantsPerRow: number;
}
