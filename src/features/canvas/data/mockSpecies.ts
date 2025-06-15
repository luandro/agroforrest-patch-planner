
import { PlantSpecies } from '../types/species.types';

export const mockPlantSpecies: PlantSpecies[] = [
  // Trees
  {
    id: 'acacia-mangium',
    commonName: 'Acácia',
    scientificName: 'Acacia mangium',
    category: 'trees',
    companionCompatibility: 'high',
    matureSize: { height: 15, width: 8 },
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    description: 'Árvore de crescimento rápido, excelente para sistemas agroflorestais'
  },
  {
    id: 'eucalyptus-grandis',
    commonName: 'Eucalipto',
    scientificName: 'Eucalyptus grandis',
    category: 'trees',
    companionCompatibility: 'medium',
    matureSize: { height: 25, width: 12 },
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'low',
    description: 'Árvore de grande porte para madeira e quebra-vento'
  },
  {
    id: 'cecropia-hololeuca',
    commonName: 'Embaúba',
    scientificName: 'Cecropia hololeuca',
    category: 'trees',
    companionCompatibility: 'high',
    matureSize: { height: 12, width: 6 },
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'high',
    description: 'Pioneira ideal para recuperação de áreas degradadas'
  },

  // Shrubs
  {
    id: 'coffea-arabica',
    commonName: 'Café Arábica',
    scientificName: 'Coffea arabica',
    category: 'shrubs',
    companionCompatibility: 'high',
    matureSize: { height: 3, width: 2 },
    growthRate: 'medium',
    sunRequirement: 'partial',
    waterRequirement: 'medium',
    description: 'Arbusto produtivo para sombreamento parcial'
  },
  {
    id: 'psidium-cattleianum',
    commonName: 'Araçá',
    scientificName: 'Psidium cattleianum',
    category: 'shrubs',
    companionCompatibility: 'high',
    matureSize: { height: 4, width: 3 },
    growthRate: 'medium',
    sunRequirement: 'partial',
    waterRequirement: 'medium',
    description: 'Frutífera nativa com frutos comestíveis'
  },
  {
    id: 'lantana-camara',
    commonName: 'Lantana',
    scientificName: 'Lantana camara',
    category: 'shrubs',
    companionCompatibility: 'medium',
    matureSize: { height: 2, width: 2 },
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'low',
    description: 'Arbusto ornamental resistente à seca'
  },

  // Ground Cover
  {
    id: 'arachis-pintoi',
    commonName: 'Amendoim Forrageiro',
    scientificName: 'Arachis pintoi',
    category: 'ground-cover',
    companionCompatibility: 'high',
    matureSize: { height: 0.3, width: 1 },
    growthRate: 'medium',
    sunRequirement: 'partial',
    waterRequirement: 'medium',
    description: 'Leguminosa fixadora de nitrogênio'
  },
  {
    id: 'tradescantia-zebrina',
    commonName: 'Trapoeraba',
    scientificName: 'Tradescantia zebrina',
    category: 'ground-cover',
    companionCompatibility: 'medium',
    matureSize: { height: 0.2, width: 0.5 },
    growthRate: 'fast',
    sunRequirement: 'shade',
    waterRequirement: 'high',
    description: 'Cobertura de solo para áreas sombreadas'
  },
  {
    id: 'ipomoea-batatas',
    commonName: 'Batata Doce',
    scientificName: 'Ipomoea batatas',
    category: 'ground-cover',
    companionCompatibility: 'high',
    matureSize: { height: 0.4, width: 2 },
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    description: 'Cobertura comestível de crescimento rápido'
  },

  // Herbs
  {
    id: 'ocimum-basilicum',
    commonName: 'Manjericão',
    scientificName: 'Ocimum basilicum',
    category: 'herbs',
    companionCompatibility: 'high',
    matureSize: { height: 0.6, width: 0.4 },
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    description: 'Erva aromática repelente de pragas'
  },
  {
    id: 'rosmarinus-officinalis',
    commonName: 'Alecrim',
    scientificName: 'Rosmarinus officinalis',
    category: 'herbs',
    companionCompatibility: 'medium',
    matureSize: { height: 1.5, width: 1 },
    growthRate: 'slow',
    sunRequirement: 'full',
    waterRequirement: 'low',
    description: 'Erva medicinal e culinária resistente'
  },
  {
    id: 'cymbopogon-citratus',
    commonName: 'Capim Limão',
    scientificName: 'Cymbopogon citratus',
    category: 'herbs',
    companionCompatibility: 'high',
    matureSize: { height: 1.2, width: 0.8 },
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    description: 'Gramínea aromática medicinal'
  }
];
