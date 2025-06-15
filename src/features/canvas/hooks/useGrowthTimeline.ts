
import { useState, useCallback, useMemo } from 'react';
import { PlantSpecies } from '../types/species.types';

export interface GrowthStage {
  months: number;
  label: string;
  description: string;
}

export const GROWTH_STAGES: GrowthStage[] = [
  { months: 0, label: 'Plantio', description: 'Recém plantada' },
  { months: 6, label: '6 meses', description: 'Estabelecimento inicial' },
  { months: 12, label: '1 ano', description: 'Crescimento ativo' },
  { months: 24, label: '2 anos', description: 'Desenvolvimento' },
  { months: 36, label: '3 anos', description: 'Maturação inicial' },
  { months: 60, label: '5 anos', description: 'Crescimento avançado' },
  { months: 120, label: '10 anos', description: 'Maturidade' },
  { months: 240, label: '20 anos', description: 'Plena maturidade' }
];

export const useGrowthTimeline = () => {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Calculate plant size based on species and time
  const calculatePlantSize = useCallback((species: PlantSpecies, months: number): number => {
    if (!species) return 8; // Default size
    
    const baseSize = getBaseSize(species.category);
    const maxSize = getMaxSize(species.category);
    
    // Growth curve based on species growth rate
    const growthMultiplier = getGrowthMultiplier(species.growthRate);
    const maturityMonths = getMaturityMonths(species.category, species.growthRate);
    
    // Sigmoid growth curve for more realistic growth pattern
    const progress = Math.min(months / maturityMonths, 1);
    const sigmoidProgress = 1 / (1 + Math.exp(-6 * (progress - 0.5)));
    
    return baseSize + (maxSize - baseSize) * sigmoidProgress * growthMultiplier;
  }, []);

  // Get current growth stage
  const currentStage = useMemo(() => {
    return GROWTH_STAGES.reduce((prev, current) => 
      currentMonth >= current.months ? current : prev
    );
  }, [currentMonth]);

  // Auto-play functionality
  const startPlayback = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resetTimeline = useCallback(() => {
    setCurrentMonth(0);
    setIsPlaying(false);
  }, []);

  return {
    currentMonth,
    setCurrentMonth,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    calculatePlantSize,
    currentStage,
    startPlayback,
    stopPlayback,
    resetTimeline,
    maxMonths: GROWTH_STAGES[GROWTH_STAGES.length - 1].months
  };
};

// Helper functions
const getBaseSize = (category: string): number => {
  switch (category) {
    case 'trees': return 8;
    case 'shrubs': return 6;
    case 'ground-cover': return 4;
    case 'herbs': return 5;
    default: return 6;
  }
};

const getMaxSize = (category: string): number => {
  switch (category) {
    case 'trees': return 24;
    case 'shrubs': return 16;
    case 'ground-cover': return 8;
    case 'herbs': return 12;
    default: return 12;
  }
};

const getGrowthMultiplier = (growthRate: string): number => {
  switch (growthRate) {
    case 'fast': return 1.2;
    case 'medium': return 1.0;
    case 'slow': return 0.8;
    default: return 1.0;
  }
};

const getMaturityMonths = (category: string, growthRate: string): number => {
  const baseMonths = {
    'trees': 120,
    'shrubs': 60,
    'ground-cover': 24,
    'herbs': 36
  }[category] || 60;

  const rateMultiplier = {
    'fast': 0.7,
    'medium': 1.0,
    'slow': 1.4
  }[growthRate] || 1.0;

  return baseMonths * rateMultiplier;
};
