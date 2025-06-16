
// Height-specific growth data for vertical timeline visualization
export interface HeightGrowthPoint {
  years: number;
  heightMeters: number;
}

export interface SpeciesHeightProfile {
  speciesId: string;
  heightCurve: HeightGrowthPoint[];
  canopyLayer: 'emergent' | 'canopy' | 'understory' | 'ground';
  maxHeight: number;
}

export const SPECIES_HEIGHT_PROFILES: Record<string, SpeciesHeightProfile> = {
  'manga': {
    speciesId: 'manga',
    heightCurve: [
      { years: 0, heightMeters: 0.5 },
      { years: 1, heightMeters: 1.5 },
      { years: 5, heightMeters: 8 },
      { years: 10, heightMeters: 15 },
      { years: 20, heightMeters: 22 }
    ],
    canopyLayer: 'emergent',
    maxHeight: 25
  },

  'coffee': {
    speciesId: 'coffee',
    heightCurve: [
      { years: 0, heightMeters: 0.2 },
      { years: 1, heightMeters: 0.8 },
      { years: 5, heightMeters: 1.8 },
      { years: 10, heightMeters: 2.5 },
      { years: 20, heightMeters: 3 }
    ],
    canopyLayer: 'understory',
    maxHeight: 3
  },

  'eucalyptus': {
    speciesId: 'eucalyptus',
    heightCurve: [
      { years: 0, heightMeters: 0.3 },
      { years: 1, heightMeters: 2 },
      { years: 5, heightMeters: 12 },
      { years: 10, heightMeters: 20 },
      { years: 20, heightMeters: 30 }
    ],
    canopyLayer: 'emergent',
    maxHeight: 35
  },

  'abacate': {
    speciesId: 'abacate',
    heightCurve: [
      { years: 0, heightMeters: 0.4 },
      { years: 1, heightMeters: 1.2 },
      { years: 5, heightMeters: 6 },
      { years: 10, heightMeters: 12 },
      { years: 20, heightMeters: 18 }
    ],
    canopyLayer: 'canopy',
    maxHeight: 20
  },

  'jaca': {
    speciesId: 'jaca',
    heightCurve: [
      { years: 0, heightMeters: 0.5 },
      { years: 1, heightMeters: 1.8 },
      { years: 5, heightMeters: 8 },
      { years: 10, heightMeters: 15 },
      { years: 20, heightMeters: 20 }
    ],
    canopyLayer: 'canopy',
    maxHeight: 20
  },

  'native-herbs': {
    speciesId: 'native-herbs',
    heightCurve: [
      { years: 0, heightMeters: 0.05 },
      { years: 1, heightMeters: 0.2 },
      { years: 5, heightMeters: 0.3 },
      { years: 10, heightMeters: 0.3 },
      { years: 20, heightMeters: 0.3 }
    ],
    canopyLayer: 'ground',
    maxHeight: 0.5
  },

  'ground-cover': {
    speciesId: 'ground-cover',
    heightCurve: [
      { years: 0, heightMeters: 0.03 },
      { years: 1, heightMeters: 0.1 },
      { years: 5, heightMeters: 0.2 },
      { years: 10, heightMeters: 0.2 },
      { years: 20, heightMeters: 0.2 }
    ],
    canopyLayer: 'ground',
    maxHeight: 0.3
  }
};

// Canopy layer definitions with colors
export const CANOPY_LAYERS = {
  emergent: { 
    name: 'Emergente', 
    color: '#1F2937', 
    minHeight: 25,
    description: 'Árvores que se sobressaem' 
  },
  canopy: { 
    name: 'Dossel', 
    color: '#059669', 
    minHeight: 8,
    description: 'Camada principal da floresta' 
  },
  understory: { 
    name: 'Sub-bosque', 
    color: '#34D399', 
    minHeight: 2,
    description: 'Arbustos e árvores jovens' 
  },
  ground: { 
    name: 'Rasteira', 
    color: '#A7F3D0', 
    minHeight: 0,
    description: 'Plantas baixas e cobertura' 
  }
} as const;

// Calculate height at specific month using interpolation
export const calculateHeightAtMonth = (profile: SpeciesHeightProfile, months: number): number => {
  const years = months / 12;
  const curve = profile.heightCurve;
  
  // If before first point, return first height
  if (years <= curve[0].years) {
    return curve[0].heightMeters;
  }
  
  // If after last point, return last height
  if (years >= curve[curve.length - 1].years) {
    return curve[curve.length - 1].heightMeters;
  }
  
  // Find interpolation points
  for (let i = 0; i < curve.length - 1; i++) {
    if (years >= curve[i].years && years <= curve[i + 1].years) {
      const t = (years - curve[i].years) / (curve[i + 1].years - curve[i].years);
      return curve[i].heightMeters + (curve[i + 1].heightMeters - curve[i].heightMeters) * t;
    }
  }
  
  return curve[curve.length - 1].heightMeters;
};

// Get species height profile
export const getSpeciesHeightProfile = (speciesId: string): SpeciesHeightProfile | null => {
  return SPECIES_HEIGHT_PROFILES[speciesId] || null;
};
