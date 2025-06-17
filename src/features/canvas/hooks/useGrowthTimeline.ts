
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
  // Direct store integration
  const { 
    currentMonth, 
    isPlaying, 
    playbackSpeed,
    setCurrentMonth,
    setIsPlaying,
    setPlaybackSpeed
  } = useTimelineStore();

  // Auto-play management with proper cleanup
  useEffect(() => {
    if (!isPlaying) return;

    console.log('[Growth Timeline] Starting auto-play, speed:', playbackSpeed);

    const interval = setInterval(() => {
      setCurrentMonth(prev => {
        const increment = playbackSpeed * 0.5; // Smooth increments
        const next = prev + increment;
        const maxMonths = GROWTH_STAGES[GROWTH_STAGES.length - 1].months;
        
        if (next >= maxMonths) {
          console.log('[Growth Timeline] Reached end, stopping playback');
          setIsPlaying(false);
          return maxMonths;
        }
        
        return next;
      });
    }, 100); // 100ms for smooth animation

    return () => {
      console.log('[Growth Timeline] Cleaning up auto-play interval');
      clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, setCurrentMonth, setIsPlaying]);

  // Enhanced plant size calculation with better growth curves
  const calculatePlantSize = useCallback((species: PlantSpecies, months: number): number => {
    if (!species) return 8;
    
    const baseSize = getBaseSize(species.category);
    const maxSize = getMaxSize(species.category);
    
    const growthMultiplier = getGrowthMultiplier(species.growthRate);
    const maturityMonths = getMaturityMonths(species.category, species.growthRate);
    
    const progress = Math.min(months / maturityMonths, 1);
    const sigmoidProgress = 1 / (1 + Math.exp(-8 * (progress - 0.3)));
    
    const calculatedSize = baseSize + (maxSize - baseSize) * sigmoidProgress * growthMultiplier;
    
    return Math.max(baseSize, calculatedSize);
  }, []);

  // Get current growth stage
  const currentStage = useMemo(() => {
    return GROWTH_STAGES.reduce((prev, current) => 
      currentMonth >= current.months ? current : prev
    );
  }, [currentMonth]);

  // Simplified control functions
  const startPlayback = useCallback(() => {
    console.log('[Growth Timeline] Starting playback');
    setIsPlaying(true);
  }, [setIsPlaying]);

  const stopPlayback = useCallback(() => {
    console.log('[Growth Timeline] Stopping playback');
    setIsPlaying(false);
  }, [setIsPlaying]);

  const resetTimeline = useCallback(() => {
    console.log('[Growth Timeline] Resetting timeline');
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
    case 'trees': return 40;
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
    'trees': 180,
    'shrubs': 96,
    'ground-cover': 24,
    'herbs': 36
  }[category] || 96;

  const rateMultiplier = {
    'fast': 0.6,
    'medium': 1.0,
    'slow': 1.5
  }[growthRate] || 1.0;

  return baseMonths * rateMultiplier;
};
