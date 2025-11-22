
import { SpeciesGrowthProfile } from '../types/growth.types';

export const SPECIES_GROWTH_PROFILES: Record<string, SpeciesGrowthProfile> = {
  // ÁRVORES FRUTÍFERAS DE CRESCIMENTO RÁPIDO
  'abacate': {
    speciesId: 'abacate',
    growthCurveType: 'exponential',
    maxAge: 300, // 25 anos
    environmentalFactors: {
      soilQualityEffect: 1.3,
      waterAvailabilityEffect: 1.2,
      competitionResistance: 0.8
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.1, height: 0.4, lightPenetration: 95 },
      { months: 6, canopyRadius: 0.3, height: 1.2, lightPenetration: 90 },
      { months: 12, canopyRadius: 0.6, height: 2.5, lightPenetration: 85 },
      { months: 24, canopyRadius: 1.2, height: 4, lightPenetration: 75 },
      { months: 36, canopyRadius: 2, height: 6, lightPenetration: 60 },
      { months: 60, canopyRadius: 3.5, height: 10, lightPenetration: 40 },
      { months: 120, canopyRadius: 5.5, height: 15, lightPenetration: 25 },
      { months: 240, canopyRadius: 7, height: 18, lightPenetration: 15 },
      { months: 300, canopyRadius: 8, height: 20, lightPenetration: 10 }
    ]
  },

  'manga': {
    speciesId: 'manga',
    growthCurveType: 'sigmoid',
    maxAge: 360, // 30 anos
    environmentalFactors: {
      soilQualityEffect: 1.2,
      waterAvailabilityEffect: 1.1,
      competitionResistance: 0.9
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.08, height: 0.5, lightPenetration: 96 },
      { months: 12, canopyRadius: 0.4, height: 1.5, lightPenetration: 88 },
      { months: 24, canopyRadius: 0.8, height: 3, lightPenetration: 80 },
      { months: 48, canopyRadius: 1.8, height: 8, lightPenetration: 60 },
      { months: 96, canopyRadius: 3.5, height: 15, lightPenetration: 35 },
      { months: 180, canopyRadius: 6, height: 18, lightPenetration: 20 },
      { months: 300, canopyRadius: 8.5, height: 22, lightPenetration: 12 },
      { months: 360, canopyRadius: 9.5, height: 25, lightPenetration: 10 }
    ]
  },

  'jaca': {
    speciesId: 'jaca',
    growthCurveType: 'exponential',
    maxAge: 240, // 20 anos
    environmentalFactors: {
      soilQualityEffect: 1.1,
      waterAvailabilityEffect: 1.4,
      competitionResistance: 0.7
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.1, height: 0.5, lightPenetration: 94 },
      { months: 6, canopyRadius: 0.4, height: 1.8, lightPenetration: 88 },
      { months: 18, canopyRadius: 1, height: 8, lightPenetration: 75 },
      { months: 36, canopyRadius: 2.2, height: 15, lightPenetration: 55 },
      { months: 72, canopyRadius: 4, height: 18, lightPenetration: 30 },
      { months: 144, canopyRadius: 6.5, height: 20, lightPenetration: 18 },
      { months: 240, canopyRadius: 8, height: 20, lightPenetration: 12 }
    ]
  },

  'laranja': {
    speciesId: 'laranja',
    growthCurveType: 'sigmoid',
    maxAge: 300, // 25 anos
    environmentalFactors: {
      soilQualityEffect: 1.2,
      waterAvailabilityEffect: 1.3,
      competitionResistance: 0.7
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.08, height: 0.4, lightPenetration: 96 },
      { months: 6, canopyRadius: 0.2, height: 0.9, lightPenetration: 92 },
      { months: 12, canopyRadius: 0.4, height: 1.5, lightPenetration: 88 },
      { months: 24, canopyRadius: 0.8, height: 2.5, lightPenetration: 80 },
      { months: 36, canopyRadius: 1.2, height: 4, lightPenetration: 70 },
      { months: 60, canopyRadius: 2, height: 6, lightPenetration: 50 },
      { months: 96, canopyRadius: 2.8, height: 7.5, lightPenetration: 35 },
      { months: 180, canopyRadius: 3.5, height: 8.5, lightPenetration: 25 },
      { months: 300, canopyRadius: 4, height: 9, lightPenetration: 20 }
    ]
  },

  'limao': {
    speciesId: 'limao',
    growthCurveType: 'sigmoid',
    maxAge: 240, // 20 anos
    environmentalFactors: {
      soilQualityEffect: 1.2,
      waterAvailabilityEffect: 1.3,
      competitionResistance: 0.6
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.06, height: 0.3, lightPenetration: 97 },
      { months: 6, canopyRadius: 0.15, height: 0.7, lightPenetration: 93 },
      { months: 12, canopyRadius: 0.3, height: 1.2, lightPenetration: 89 },
      { months: 24, canopyRadius: 0.6, height: 2, lightPenetration: 82 },
      { months: 36, canopyRadius: 1, height: 3.5, lightPenetration: 72 },
      { months: 60, canopyRadius: 1.5, height: 5, lightPenetration: 55 },
      { months: 96, canopyRadius: 2, height: 6, lightPenetration: 40 },
      { months: 180, canopyRadius: 2.5, height: 6.5, lightPenetration: 30 },
      { months: 240, canopyRadius: 2.8, height: 7, lightPenetration: 25 }
    ]
  },

  'acerola': {
    speciesId: 'acerola',
    growthCurveType: 'exponential',
    maxAge: 120, // 10 anos
    environmentalFactors: {
      soilQualityEffect: 1.1,
      waterAvailabilityEffect: 1.2,
      competitionResistance: 0.5
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.05, height: 0.2, lightPenetration: 97 },
      { months: 6, canopyRadius: 0.2, height: 0.6, lightPenetration: 90 },
      { months: 12, canopyRadius: 0.4, height: 1.2, lightPenetration: 82 },
      { months: 18, canopyRadius: 0.6, height: 1.8, lightPenetration: 75 },
      { months: 24, canopyRadius: 0.9, height: 2.2, lightPenetration: 65 },
      { months: 36, canopyRadius: 1.2, height: 2.8, lightPenetration: 55 },
      { months: 60, canopyRadius: 1.5, height: 3.2, lightPenetration: 45 },
      { months: 96, canopyRadius: 1.8, height: 3.5, lightPenetration: 38 },
      { months: 120, canopyRadius: 2, height: 3.8, lightPenetration: 35 }
    ]
  },

  // ÁRVORES DO CERRADO
  'pequi': {
    speciesId: 'pequi',
    growthCurveType: 'sigmoid',
    maxAge: 600, // 50 anos (longevidade)
    environmentalFactors: {
      soilQualityEffect: 0.9,
      waterAvailabilityEffect: 0.8,
      competitionResistance: 0.9
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.05, height: 0.3, lightPenetration: 98 },
      { months: 12, canopyRadius: 0.15, height: 0.8, lightPenetration: 95 },
      { months: 24, canopyRadius: 0.3, height: 1.5, lightPenetration: 90 },
      { months: 60, canopyRadius: 0.8, height: 3, lightPenetration: 80 },
      { months: 120, canopyRadius: 1.5, height: 6, lightPenetration: 60 },
      { months: 240, canopyRadius: 3, height: 12, lightPenetration: 30 },
      { months: 480, canopyRadius: 5, height: 18, lightPenetration: 20 },
      { months: 600, canopyRadius: 6, height: 20, lightPenetration: 15 }
    ]
  },

  'baru': {
    speciesId: 'baru',
    growthCurveType: 'sigmoid',
    maxAge: 480, // 40 anos
    environmentalFactors: {
      soilQualityEffect: 0.8,
      waterAvailabilityEffect: 0.7,
      competitionResistance: 0.8
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.05, height: 0.2, lightPenetration: 98 },
      { months: 12, canopyRadius: 0.1, height: 0.6, lightPenetration: 96 },
      { months: 36, canopyRadius: 0.4, height: 2, lightPenetration: 85 },
      { months: 60, canopyRadius: 0.8, height: 4, lightPenetration: 70 },
      { months: 120, canopyRadius: 1.8, height: 8, lightPenetration: 45 },
      { months: 240, canopyRadius: 3.5, height: 15, lightPenetration: 25 },
      { months: 480, canopyRadius: 5.5, height: 22, lightPenetration: 20 }
    ]
  },

  'jatoba': {
    speciesId: 'jatoba',
    growthCurveType: 'sigmoid',
    maxAge: 600, // 50 anos
    environmentalFactors: {
      soilQualityEffect: 1.0,
      waterAvailabilityEffect: 0.9,
      competitionResistance: 0.9
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.08, height: 0.4, lightPenetration: 96 },
      { months: 18, canopyRadius: 0.2, height: 1.2, lightPenetration: 92 },
      { months: 36, canopyRadius: 0.5, height: 2.5, lightPenetration: 85 },
      { months: 60, canopyRadius: 1, height: 5, lightPenetration: 70 },
      { months: 120, canopyRadius: 2.2, height: 10, lightPenetration: 40 },
      { months: 240, canopyRadius: 4, height: 18, lightPenetration: 20 },
      { months: 480, canopyRadius: 6.5, height: 28, lightPenetration: 10 },
      { months: 600, canopyRadius: 8, height: 35, lightPenetration: 8 }
    ]
  },

  // EUCALIPTO - CRESCIMENTO MUITO RÁPIDO
  'eucalyptus': {
    speciesId: 'eucalyptus',
    growthCurveType: 'exponential',
    maxAge: 240, // 20 anos
    environmentalFactors: {
      soilQualityEffect: 1.2,
      waterAvailabilityEffect: 1.3,
      competitionResistance: 0.7
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.1, height: 0.3, lightPenetration: 95 },
      { months: 6, canopyRadius: 0.2, height: 2, lightPenetration: 90 },
      { months: 12, canopyRadius: 0.4, height: 5, lightPenetration: 85 },
      { months: 24, canopyRadius: 0.8, height: 12, lightPenetration: 70 },
      { months: 36, canopyRadius: 1.2, height: 15, lightPenetration: 55 },
      { months: 60, canopyRadius: 2, height: 20, lightPenetration: 35 },
      { months: 120, canopyRadius: 3.5, height: 28, lightPenetration: 20 },
      { months: 240, canopyRadius: 5, height: 35, lightPenetration: 15 }
    ]
  },

  // ARBUSTOS E PLANTAS MENORES
  'acacia': {
    speciesId: 'acacia',
    growthCurveType: 'exponential',
    maxAge: 180, // 15 anos
    environmentalFactors: {
      soilQualityEffect: 1.1,
      waterAvailabilityEffect: 1.0,
      competitionResistance: 0.6
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.05, height: 0.3, lightPenetration: 95 },
      { months: 6, canopyRadius: 0.2, height: 1, lightPenetration: 85 },
      { months: 12, canopyRadius: 0.4, height: 2, lightPenetration: 75 },
      { months: 24, canopyRadius: 0.8, height: 3.5, lightPenetration: 60 },
      { months: 60, canopyRadius: 1.5, height: 6, lightPenetration: 40 },
      { months: 120, canopyRadius: 2.2, height: 8, lightPenetration: 30 },
      { months: 180, canopyRadius: 2.8, height: 10, lightPenetration: 25 }
    ]
  },

  'coffee': {
    speciesId: 'coffee',
    growthCurveType: 'sigmoid',
    maxAge: 120, // 10 anos produtivos
    environmentalFactors: {
      soilQualityEffect: 1.3,
      waterAvailabilityEffect: 1.4,
      competitionResistance: 0.4
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.03, height: 0.2, lightPenetration: 98 },
      { months: 6, canopyRadius: 0.1, height: 0.8, lightPenetration: 95 },
      { months: 12, canopyRadius: 0.2, height: 1.8, lightPenetration: 90 },
      { months: 18, canopyRadius: 0.35, height: 2.5, lightPenetration: 85 },
      { months: 36, canopyRadius: 0.6, height: 2.8, lightPenetration: 75 },
      { months: 60, canopyRadius: 0.8, height: 3, lightPenetration: 65 },
      { months: 120, canopyRadius: 1, height: 3, lightPenetration: 60 }
    ]
  },

  // PLANTAS RASTEIRAS E HERBÁCEAS
  'native-herbs': {
    speciesId: 'native-herbs',
    growthCurveType: 'linear',
    maxAge: 24, // 2 anos (ciclo de renovação)
    environmentalFactors: {
      soilQualityEffect: 1.0,
      waterAvailabilityEffect: 1.2,
      competitionResistance: 0.3
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.02, height: 0.05, lightPenetration: 99 },
      { months: 3, canopyRadius: 0.08, height: 0.2, lightPenetration: 95 },
      { months: 6, canopyRadius: 0.15, height: 0.3, lightPenetration: 90 },
      { months: 12, canopyRadius: 0.25, height: 0.3, lightPenetration: 85 },
      { months: 18, canopyRadius: 0.3, height: 0.3, lightPenetration: 80 },
      { months: 24, canopyRadius: 0.35, height: 0.3, lightPenetration: 75 }
    ]
  },

  'ground-cover': {
    speciesId: 'ground-cover',
    growthCurveType: 'exponential',
    maxAge: 36, // 3 anos
    environmentalFactors: {
      soilQualityEffect: 0.8,
      waterAvailabilityEffect: 1.1,
      competitionResistance: 0.5
    },
    dataPoints: [
      { months: 0, canopyRadius: 0.03, height: 0.03, lightPenetration: 98 },
      { months: 2, canopyRadius: 0.1, height: 0.1, lightPenetration: 95 },
      { months: 6, canopyRadius: 0.2, height: 0.2, lightPenetration: 90 },
      { months: 12, canopyRadius: 0.35, height: 0.2, lightPenetration: 85 },
      { months: 24, canopyRadius: 0.5, height: 0.2, lightPenetration: 80 },
      { months: 36, canopyRadius: 0.6, height: 0.2, lightPenetration: 75 }
    ]
  }
};

// Função para obter o perfil de crescimento de uma espécie
export const getSpeciesGrowthProfile = (speciesId: string): SpeciesGrowthProfile | null => {
  return SPECIES_GROWTH_PROFILES[speciesId] || null;
};

// Função para listar todas as espécies com dados de crescimento
export const getAvailableSpeciesWithGrowthData = (): string[] => {
  return Object.keys(SPECIES_GROWTH_PROFILES);
};
