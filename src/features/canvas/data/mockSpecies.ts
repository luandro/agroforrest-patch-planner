import { PlantSpecies } from '../types/species.types';

export const mockSpecies: PlantSpecies[] = [
  // ÁRVORES FRUTÍFERAS
  {
    id: 'abacate',
    commonName: 'Abacate',
    scientificName: 'Persea americana',
    category: 'trees',
    companionCompatibility: 'high',
    matureSize: { height: 15, width: 12 },
    spacing: { min: 6, max: 10 },
    description: 'Árvore frutífera de grande porte, rica em gorduras boas',
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    isEdible: true
  },
  {
    id: 'manga',
    commonName: 'Manga',
    scientificName: 'Mangifera indica',
    category: 'trees',
    companionCompatibility: 'high',
    matureSize: { height: 20, width: 15 },
    spacing: { min: 8, max: 12 },
    description: 'Árvore frutífera tropical de grande porte',
    growthRate: 'medium',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    isEdible: true
  },
  {
    id: 'jaca',
    commonName: 'Jaca',
    scientificName: 'Artocarpus heterophyllus',
    category: 'trees',
    companionCompatibility: 'medium',
    matureSize: { height: 18, width: 14 },
    spacing: { min: 7, max: 11 },
    description: 'Árvore frutífera tropical com frutos grandes',
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'high',
    isEdible: true
  },
  {
    id: 'laranja',
    commonName: 'Laranja',
    scientificName: 'Citrus sinensis',
    category: 'trees',
    companionCompatibility: 'high',
    matureSize: { height: 8, width: 6 },
    spacing: { min: 3, max: 5 },
    description: 'Árvore cítrica produtora de laranjas',
    growthRate: 'medium',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    isEdible: true
  },
  {
    id: 'limao',
    commonName: 'Limão',
    scientificName: 'Citrus limon',
    category: 'trees',
    companionCompatibility: 'high',
    matureSize: { height: 6, width: 4 },
    spacing: { min: 2.5, max: 4 },
    description: 'Árvore cítrica produtora de limões',
    growthRate: 'medium',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    isEdible: true
  },
  {
    id: 'acerola',
    commonName: 'Acerola',
    scientificName: 'Malpighia emarginata',
    category: 'shrubs',
    companionCompatibility: 'high',
    matureSize: { height: 3, width: 3 },
    spacing: { min: 1.5, max: 2.5 },
    description: 'Arbusto frutífero produtor de acerolas',
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    isEdible: true
  },

  // ÁRVORES NATIVAS DO CERRADO
  {
    id: 'pequi',
    commonName: 'Pequi',
    scientificName: 'Caryocar brasiliense',
    category: 'trees',
    companionCompatibility: 'high',
    matureSize: { height: 12, width: 10 },
    spacing: { min: 5, max: 8 },
    description: 'Árvore nativa do Cerrado, fruto rico em nutrientes',
    growthRate: 'slow',
    sunRequirement: 'full',
    waterRequirement: 'low',
    isEdible: true
  },
  {
    id: 'baru',
    commonName: 'Baru',
    scientificName: 'Dipteryx alata',
    category: 'trees',
    companionCompatibility: 'high',
    matureSize: { height: 20, width: 12 },
    spacing: { min: 6, max: 10 },
    description: 'Árvore nativa com castanha comestível',
    growthRate: 'slow',
    sunRequirement: 'full',
    waterRequirement: 'low',
    isEdible: true
  },
  {
    id: 'jatoba',
    commonName: 'Jatobá',
    scientificName: 'Hymenaea courbaril',
    category: 'trees',
    companionCompatibility: 'medium',
    matureSize: { height: 25, width: 18 },
    spacing: { min: 8, max: 14 },
    description: 'Árvore gigante do Cerrado, madeira nobre',
    growthRate: 'slow',
    sunRequirement: 'full',
    waterRequirement: 'low',
    isEdible: true
  },

  // ÁRVORES DE CRESCIMENTO RÁPIDO
  {
    id: 'eucalipto',
    commonName: 'Eucalipto',
    scientificName: 'Eucalyptus spp.',
    category: 'trees',
    companionCompatibility: 'low',
    matureSize: { height: 30, width: 8 },
    spacing: { min: 4, max: 6 },
    description: 'Árvore de crescimento rápido para madeira',
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    isEdible: false
  },

  // ARBUSTOS
  {
    id: 'acacia',
    commonName: 'Acácia',
    scientificName: 'Acacia mangium',
    category: 'shrubs',
    companionCompatibility: 'high',
    matureSize: { height: 6, width: 4 },
    spacing: { min: 2, max: 4 },
    description: 'Arbusto fixador de nitrogênio',
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'low'
  },
  {
    id: 'cafe',
    commonName: 'Café',
    scientificName: 'Coffea arabica',
    category: 'shrubs',
    companionCompatibility: 'high',
    matureSize: { height: 3, width: 2 },
    spacing: { min: 1.5, max: 2.5 },
    description: 'Arbusto produtor de café',
    growthRate: 'medium',
    sunRequirement: 'partial',
    waterRequirement: 'medium',
    isEdible: true
  },

  // PLANTAS RASTEIRAS
  {
    id: 'ervas-nativas',
    commonName: 'Ervas Nativas',
    scientificName: 'Mix de espécies',
    category: 'herbs',
    companionCompatibility: 'high',
    matureSize: { height: 0.5, width: 0.5 },
    spacing: { min: 0.3, max: 0.8 },
    description: 'Mistura de ervas medicinais nativas',
    growthRate: 'fast',
    sunRequirement: 'partial',
    waterRequirement: 'medium'
  },
  {
    id: 'cobertura-solo',
    commonName: 'Cobertura do Solo',
    scientificName: 'Mix de gramíneas',
    category: 'ground-cover',
    companionCompatibility: 'high',
    matureSize: { height: 0.2, width: 1 },
    spacing: { min: 0.2, max: 0.5 },
    description: 'Plantas para cobertura e proteção do solo',
    growthRate: 'fast',
    sunRequirement: 'partial',
    waterRequirement: 'low'
  }
];
