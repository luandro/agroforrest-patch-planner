
import { PlantSpecies } from '../types/species.types';

export const mockPlantSpecies: PlantSpecies[] = [
  // Trees
  {
    id: 'tree-banana',
    commonName: 'Bananeira',
    scientificName: 'Musa spp.',
    category: 'trees',
    companionCompatibility: 'high',
    matureSize: { height: 4, width: 2.5 },
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'high',
    description: 'Frutífera tropical de crescimento rápido, ideal para sistemas agroflorestais.'
  },
  {
    id: 'tree-avocado',
    commonName: 'Abacateiro',
    scientificName: 'Persea americana',
    category: 'trees',
    companionCompatibility: 'medium',
    matureSize: { height: 12, width: 8 },
    growthRate: 'medium',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    description: 'Árvore frutífera de grande porte, fornece sombra e frutos nutritivos.'
  },
  {
    id: 'tree-mango',
    commonName: 'Mangueira',
    scientificName: 'Mangifera indica',
    category: 'trees',
    companionCompatibility: 'medium',
    matureSize: { height: 15, width: 12 },
    growthRate: 'slow',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    description: 'Árvore frutífera de grande porte, excelente para sombra e produção de frutas.'
  },

  // Shrubs
  {
    id: 'shrub-coffee',
    commonName: 'Cafeeiro',
    scientificName: 'Coffea arabica',
    category: 'shrubs',
    companionCompatibility: 'high',
    matureSize: { height: 2.5, width: 1.5 },
    growthRate: 'medium',
    sunRequirement: 'partial',
    waterRequirement: 'medium',
    description: 'Arbusto produtor de café, cresce bem sob sombra parcial de árvores.'
  },
  {
    id: 'shrub-guava',
    commonName: 'Goiabeira',
    scientificName: 'Psidium guajava',
    category: 'shrubs',
    companionCompatibility: 'high',
    matureSize: { height: 3, width: 2 },
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    description: 'Frutífera arbustiva de crescimento rápido e alta produtividade.'
  },
  {
    id: 'shrub-hibiscus',
    commonName: 'Hibisco',
    scientificName: 'Hibiscus rosa-sinensis',
    category: 'shrubs',
    companionCompatibility: 'high',
    matureSize: { height: 2, width: 1.5 },
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    description: 'Arbusto ornamental com flores vistosas, atrai polinizadores.'
  },

  // Ground Cover
  {
    id: 'cover-strawberry',
    commonName: 'Morangueiro',
    scientificName: 'Fragaria × ananassa',
    category: 'ground-cover',
    companionCompatibility: 'high',
    matureSize: { height: 0.2, width: 0.3 },
    growthRate: 'fast',
    sunRequirement: 'partial',
    waterRequirement: 'high',
    description: 'Cobertura do solo produtiva, ideal para sombreamento parcial.'
  },
  {
    id: 'cover-sweet-potato',
    commonName: 'Batata-doce',
    scientificName: 'Ipomoea batatas',
    category: 'ground-cover',
    companionCompatibility: 'high',
    matureSize: { height: 0.3, width: 1 },
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    description: 'Cobertura rasteira comestível, melhora o solo e produz tubérculos.'
  },
  {
    id: 'cover-mint',
    commonName: 'Hortelã',
    scientificName: 'Mentha spicata',
    category: 'ground-cover',
    companionCompatibility: 'medium',
    matureSize: { height: 0.4, width: 0.5 },
    growthRate: 'fast',
    sunRequirement: 'partial',
    waterRequirement: 'high',
    description: 'Erva aromática que se espalha rapidamente, repele pragas.'
  },

  // Herbs
  {
    id: 'herb-basil',
    commonName: 'Manjericão',
    scientificName: 'Ocimum basilicum',
    category: 'herbs',
    companionCompatibility: 'high',
    matureSize: { height: 0.6, width: 0.4 },
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    description: 'Erva aromática culinária, repele insetos e atrai polinizadores.'
  },
  {
    id: 'herb-rosemary',
    commonName: 'Alecrim',
    scientificName: 'Rosmarinus officinalis',
    category: 'herbs',
    companionCompatibility: 'medium',
    matureSize: { height: 1, width: 0.8 },
    growthRate: 'slow',
    sunRequirement: 'full',
    waterRequirement: 'low',
    description: 'Erva perene aromática, resistente à seca e repele pragas.'
  },
  {
    id: 'herb-cilantro',
    commonName: 'Coentro',
    scientificName: 'Coriandrum sativum',
    category: 'herbs',
    companionCompatibility: 'high',
    matureSize: { height: 0.5, width: 0.3 },
    growthRate: 'fast',
    sunRequirement: 'partial',
    waterRequirement: 'medium',
    description: 'Erva culinária de ciclo rápido, atrai insetos benéficos.'
  },
  {
    id: 'herb-oregano',
    commonName: 'Orégano',
    scientificName: 'Origanum vulgare',
    category: 'herbs',
    companionCompatibility: 'high',
    matureSize: { height: 0.4, width: 0.4 },
    growthRate: 'medium',
    sunRequirement: 'full',
    waterRequirement: 'low',
    description: 'Erva perene aromática, fácil cultivo e múltiplos usos.'
  },
  {
    id: 'herb-chives',
    commonName: 'Cebolinha',
    scientificName: 'Allium schoenoprasum',
    category: 'herbs',
    companionCompatibility: 'high',
    matureSize: { height: 0.3, width: 0.2 },
    growthRate: 'fast',
    sunRequirement: 'full',
    waterRequirement: 'medium',
    description: 'Erva perene da família da cebola, repele pragas naturalmente.'
  }
];
