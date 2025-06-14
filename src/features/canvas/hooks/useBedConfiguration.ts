
import { useState, useCallback } from 'react';
import { BedConfig } from '../types/bed.types';

export const useBedConfiguration = () => {
  // Default bed configuration
  const [bedConfig, setBedConfig] = useState<BedConfig>({
    shape: 'rectangle',
    length: 5,
    width: 1,
    spacing: 0.4,
    quantity: 1
  });

  const updateBedConfig = useCallback((updates: Partial<BedConfig>) => {
    setBedConfig(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    bedConfig,
    updateBedConfig
  };
};
