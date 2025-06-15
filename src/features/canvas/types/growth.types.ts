
export interface GrowthDataPoint {
  months: number;
  canopyRadius: number; // in meters
  height: number; // in meters
  lightPenetration: number; // percentage (0-100)
  biomass?: number; // optional biomass indicator
}

export interface SpeciesGrowthProfile {
  speciesId: string;
  growthCurveType: 'linear' | 'exponential' | 'sigmoid';
  maxAge: number; // in months
  dataPoints: GrowthDataPoint[];
  environmentalFactors: {
    soilQualityEffect: number; // multiplier 0.5-1.5
    waterAvailabilityEffect: number; // multiplier 0.5-1.5
    competitionResistance: number; // 0-1, how well it handles competition
  };
}

export interface PlantGrowthState {
  placementId: string;
  speciesId: string;
  plantedAt: number; // months from timeline start
  currentAge: number; // in months
  currentCanopyRadius: number;
  currentHeight: number;
  currentLightPenetration: number;
  environmentalStress: number; // 0-1, affects growth rate
}

export type GrowthCurveFunction = (
  dataPoints: GrowthDataPoint[],
  targetMonth: number,
  curveType: 'linear' | 'exponential' | 'sigmoid'
) => {
  canopyRadius: number;
  height: number;
  lightPenetration: number;
};
