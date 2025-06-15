
import { PlantingTemplate } from '../types/template.types';

export const predefinedTemplates: PlantingTemplate[] = [
  {
    id: 'tropical-fruit-guild',
    name: 'Conjunto Frutífero Tropical',
    description: 'Sistema agroflorestal com mangueira central, mamão, café e plantas de cobertura',
    category: 'pre-defined',
    bedSize: { width: 3, length: 5 },
    climate: ['tropical', 'savanna'],
    difficulty: 'intermediate',
    tags: ['frutas', 'sombreamento', 'sistema agroflorestal'],
    benefits: ['Produção diversificada', 'Sombreamento natural', 'Aproveitamento vertical'],
    harvestSchedule: 'Alface: 45 dias, Açafrão: 8-10 meses, Mamão: 1-2 anos, Café: 3-4 anos, Manga: 5+ anos',
    maintenanceLevel: 'medium',
    plants: [
      {
        speciesId: 'mango',
        position: { x: 0, y: 0 }, // centro
        maturity: 'young',
        quantity: 1,
        priority: 'primary',
        notes: 'Árvore principal do sistema'
      },
      {
        speciesId: 'papaya',
        position: { x: 1.5, y: 1.2 }, // nordeste
        maturity: 'seedling',
        quantity: 1,
        priority: 'secondary',
        notes: 'Produção rápida enquanto mangueira cresce'
      },
      {
        speciesId: 'coffee',
        position: { x: -1.2, y: -1.5 }, // sudoeste
        maturity: 'seedling',
        quantity: 2,
        priority: 'secondary',
        notes: 'Aproveitará sombra da mangueira'
      },
      {
        speciesId: 'turmeric',
        position: { x: 0.8, y: -0.5 },
        maturity: 'seed',
        quantity: 3,
        priority: 'filler',
        notes: 'Rizoma medicinal e culinário'
      },
      {
        speciesId: 'lettuce',
        position: { x: -1.8, y: 0.8 },
        maturity: 'seedling',
        quantity: 4,
        priority: 'filler',
        notes: 'Colheita rápida, rotação frequente'
      }
    ]
  },
  {
    id: 'shade-coffee-system',
    name: 'Sistema Café Sombreado',
    description: 'Plantio de café com bananeiras para sombra e ervas medicinais no sub-bosque',
    category: 'pre-defined',
    bedSize: { width: 2, length: 4 },
    climate: ['tropical', 'temperate'],
    difficulty: 'beginner',
    tags: ['café', 'sombreamento', 'ervas'],
    benefits: ['Café de qualidade', 'Diversificação', 'Conservação do solo'],
    harvestSchedule: 'Ervas: contínuo, Café: safra anual, Banana: ano todo',
    maintenanceLevel: 'low',
    plants: [
      {
        speciesId: 'banana',
        position: { x: 0, y: 1.5 },
        maturity: 'young',
        quantity: 2,
        priority: 'primary',
        notes: 'Sombra e proteção para o café'
      },
      {
        speciesId: 'coffee',
        position: { x: -0.8, y: 0 },
        maturity: 'seedling',
        quantity: 3,
        priority: 'primary',
        notes: 'Plantio principal'
      },
      {
        speciesId: 'coffee',
        position: { x: 0.8, y: 0 },
        maturity: 'seedling',
        quantity: 3,
        priority: 'primary',
        notes: 'Plantio principal'
      },
      {
        speciesId: 'basil',
        position: { x: 0, y: -1.2 },
        maturity: 'seedling',
        quantity: 4,
        priority: 'filler',
        notes: 'Repelente natural de pragas'
      }
    ]
  },
  {
    id: 'medicinal-garden',
    name: 'Jardim Medicinal',
    description: 'Combinação de plantas medicinais com árvore protetora central',
    category: 'pre-defined',
    bedSize: { width: 3, length: 3 },
    climate: ['tropical', 'savanna', 'temperate'],
    difficulty: 'beginner',
    tags: ['medicinal', 'ervas', 'farmácia viva'],
    benefits: ['Plantas medicinais', 'Fácil manutenção', 'Uso doméstico'],
    harvestSchedule: 'Ervas: contínuo, Açafrão: 8-10 meses',
    maintenanceLevel: 'low',
    plants: [
      {
        speciesId: 'eucalyptus',
        position: { x: 0, y: 0 },
        maturity: 'young',
        quantity: 1,
        priority: 'primary',
        notes: 'Proteção e fonte de óleo essencial'
      },
      {
        speciesId: 'turmeric',
        position: { x: 1, y: 1 },
        maturity: 'seed',
        quantity: 2,
        priority: 'secondary',
        notes: 'Anti-inflamatório natural'
      },
      {
        speciesId: 'basil',
        position: { x: -1, y: 1 },
        maturity: 'seedling',
        quantity: 3,
        priority: 'filler',
        notes: 'Digestivo e aromático'
      },
      {
        speciesId: 'basil',
        position: { x: 1, y: -1 },
        maturity: 'seedling',
        quantity: 3,
        priority: 'filler',
        notes: 'Múltiplos usos medicinais'
      },
      {
        speciesId: 'lettuce',
        position: { x: -1, y: -1 },
        maturity: 'seedling',
        quantity: 4,
        priority: 'filler',
        notes: 'Verde folhoso nutritivo'
      }
    ]
  },
  {
    id: 'nitrogen-fixer-combo',
    name: 'Fixadores de Nitrogênio',
    description: 'Sistema com leguminosas para enriquecer o solo naturalmente',
    category: 'pre-defined',
    bedSize: { width: 2.5, length: 4 },
    climate: ['tropical', 'savanna'],
    difficulty: 'intermediate',
    tags: ['leguminosas', 'solo', 'sustentabilidade'],
    benefits: ['Melhora do solo', 'Redução de fertilizantes', 'Diversidade'],
    harvestSchedule: 'Feijão: 3 meses, Ervas: contínuo',
    maintenanceLevel: 'medium',
    plants: [
      {
        speciesId: 'acacia',
        position: { x: 0, y: 1.5 },
        maturity: 'young',
        quantity: 1,
        priority: 'primary',
        notes: 'Árvore fixadora de nitrogênio'
      },
      {
        speciesId: 'bean',
        position: { x: -1, y: 0 },
        maturity: 'seed',
        quantity: 6,
        priority: 'primary',
        notes: 'Leguminosa anual'
      },
      {
        speciesId: 'bean',
        position: { x: 1, y: 0 },
        maturity: 'seed',
        quantity: 6,
        priority: 'primary',
        notes: 'Segunda fileira de feijão'
      },
      {
        speciesId: 'basil',
        position: { x: 0, y: -1.5 },
        maturity: 'seedling',
        quantity: 4,
        priority: 'filler',
        notes: 'Beneficia do solo melhorado'
      }
    ]
  },
  {
    id: 'quick-harvest-vegetables',
    name: 'Horta de Colheita Rápida',
    description: 'Vegetais de crescimento rápido para produção contínua',
    category: 'pre-defined',
    bedSize: { width: 1.5, length: 3 },
    climate: ['tropical', 'temperate'],
    difficulty: 'beginner',
    tags: ['vegetais', 'colheita rápida', 'produtividade'],
    benefits: ['Produção rápida', 'Alta rotatividade', 'Fácil manejo'],
    harvestSchedule: 'Alface: 45 dias, Manjericão: contínuo',
    maintenanceLevel: 'medium',
    plants: [
      {
        speciesId: 'lettuce',
        position: { x: -0.5, y: 1 },
        maturity: 'seedling',
        quantity: 4,
        priority: 'primary',
        notes: 'Primeira fileira'
      },
      {
        speciesId: 'lettuce',
        position: { x: 0.5, y: 1 },
        maturity: 'seedling',
        quantity: 4,
        priority: 'primary',
        notes: 'Segunda fileira'
      },
      {
        speciesId: 'basil',
        position: { x: -0.5, y: 0 },
        maturity: 'seedling',
        quantity: 3,
        priority: 'secondary',
        notes: 'Aromatic companion'
      },
      {
        speciesId: 'basil',
        position: { x: 0.5, y: 0 },
        maturity: 'seedling',
        quantity: 3,
        priority: 'secondary',
        notes: 'Repelente de pragas'
      },
      {
        speciesId: 'lettuce',
        position: { x: 0, y: -1 },
        maturity: 'seed',
        quantity: 6,
        priority: 'primary',
        notes: 'Plantio sucessivo'
      }
    ]
  }
];

// Map species IDs to actual species data
export const getSpeciesForTemplate = (speciesId: string) => {
  // This would normally query from your species database
  // For now, return mock data that matches the existing species structure
  const speciesMap: Record<string, any> = {
    'mango': {
      id: 'mango',
      commonName: 'Mangueira',
      scientificName: 'Mangifera indica',
      category: 'trees'
    },
    'papaya': {
      id: 'papaya', 
      commonName: 'Mamoeiro',
      scientificName: 'Carica papaya',
      category: 'trees'
    },
    'coffee': {
      id: 'coffee',
      commonName: 'Cafeeiro',
      scientificName: 'Coffea arabica', 
      category: 'shrubs'
    },
    'turmeric': {
      id: 'turmeric',
      commonName: 'Açafrão',
      scientificName: 'Curcuma longa',
      category: 'herbs'
    },
    'lettuce': {
      id: 'lettuce',
      commonName: 'Alface',
      scientificName: 'Lactuca sativa',
      category: 'herbs'
    },
    'banana': {
      id: 'banana',
      commonName: 'Bananeira', 
      scientificName: 'Musa spp.',
      category: 'trees'
    },
    'basil': {
      id: 'basil',
      commonName: 'Manjericão',
      scientificName: 'Ocimum basilicum',
      category: 'herbs'
    },
    'eucalyptus': {
      id: 'eucalyptus',
      commonName: 'Eucalipto',
      scientificName: 'Eucalyptus spp.',
      category: 'trees'
    },
    'acacia': {
      id: 'acacia',
      commonName: 'Acácia',
      scientificName: 'Acacia mangium',
      category: 'trees'
    },
    'bean': {
      id: 'bean',
      commonName: 'Feijão',
      scientificName: 'Phaseolus vulgaris',
      category: 'herbs'
    }
  };
  
  return speciesMap[speciesId] || null;
};
