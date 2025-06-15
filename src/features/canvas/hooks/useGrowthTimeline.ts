
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useTimelineStore } from '../stores/timelineStore';
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
  // Use store state directly
  const { 
    currentMonth, 
    isPlaying, 
    playbackSpeed,
    setCurrentMonth,
    setIsPlaying,
    setPlaybackSpeed
  } = useTimelineStore();

  // Enhanced debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Growth Timeline] State:', {
        currentMonth,
        isPlaying,
        playbackSpeed
      });
    }
  }, [currentMonth, isPlaying, playbackSpeed]);

  // Enhanced plant size calculation with better growth curves
  const calculatePlantSize = useCallback((species: PlantSpecies, months: number): number => {
    if (!species) return 8; // Default size
    
    const baseSize = getBaseSize(species.category);
    const maxSize = getMaxSize(species.category);
    
    // Growth curve based on species growth rate
    const growthMultiplier = getGrowthMultiplier(species.growthRate);
    const maturityMonths = getMaturityMonths(species.category, species.growthRate);
    
    // Enhanced sigmoid growth curve with earlier visible growth
    const progress = Math.min(months / maturityMonths, 1);
    const sigmoidProgress = 1 / (1 + Math.exp(-8 * (progress - 0.3))); // Start growth earlier
    
    const calculatedSize = baseSize + (maxSize - baseSize) * sigmoidProgress * growthMultiplier;
    
    // Debug logging for plant growth
    if (process.env.NODE_ENV === 'development' && months > 0) {
      console.debug('[Plant Growth]', {
        species: species.commonName,
        months,
        progress,
        sigmoidProgress,
        baseSize,
        maxSize,
        calculatedSize
      });
    }
    
    return Math.max(baseSize, calculatedSize);
  }, []);

  // Get current growth stage
  const currentStage = useMemo(() => {
    return GROWTH_STAGES.reduce((prev, current) => 
      currentMonth >= current.months ? current : prev
    );
  }, [currentMonth]);

  // Auto-play functionality with store integration
  const startPlayback = useCallback(() => {
    console.log('[Timeline] Starting playback');
    setIsPlaying(true);
  }, [setIsPlaying]);

  const stopPlayback = useCallback(() => {
    console.log('[Timeline] Stopping playback');
    setIsPlaying(false);
  }, [setIsPlaying]);

  const resetTimeline = useCallback(() => {
    console.log('[Timeline] Resetting timeline');
    setCurrentMonth(0);
    setIsPlaying(false);
  }, [setCurrentMonth, setIsPlaying]);

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

// Enhanced helper functions with more realistic growth patterns
const getBaseSize = (category: string): number => {
  switch (category) {
    case 'trees': return 6;
    case 'shrubs': return 4;
    case 'ground-cover': return 3;
    case 'herbs': return 3.5;
    default: return 4;
  }
};

const getMaxSize = (category: string): number => {
  switch (category) {
    case 'trees': return 40; // Much larger for dramatic growth
    case 'shrubs': return 25;
    case 'ground-cover': return 12;
    case 'herbs': return 18;
    default: return 20;
  }
};

const getGrowthMultiplier = (growthRate: string): number => {
  switch (growthRate) {
    case 'fast': return 1.3;
    case 'medium': return 1.0;
    case 'slow': return 0.7;
    default: return 1.0;
  }
};

const getMaturityMonths = (category: string, growthRate: string): number => {
  const baseMonths = {
    'trees': 180, // 15 years for full maturity
    'shrubs': 96,  // 8 years
    'ground-cover': 24, // 2 years
    'herbs': 36    // 3 years
  }[category] || 96;

  const rateMultiplier = {
    'fast': 0.6,    // Faster growth
    'medium': 1.0,
    'slow': 1.5     // Slower growth
  }[growthRate] || 1.0;

  return baseMonths * rateMultiplier;
};
