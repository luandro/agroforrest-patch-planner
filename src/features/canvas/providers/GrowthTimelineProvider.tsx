
import React, { createContext, useContext } from 'react';
import { useGrowthTimeline } from '../hooks/useGrowthTimeline';

interface GrowthTimelineContextType {
  currentMonth: number;
  setCurrentMonth: (month: number) => void;
  isPlaying: boolean;
  calculatePlantSize: (species: any, months: number) => number;
  currentStage: any;
  startPlayback: () => void;
  stopPlayback: () => void;
  resetTimeline: () => void;
  maxMonths: number;
}

const GrowthTimelineContext = createContext<GrowthTimelineContextType | null>(null);

export const useGrowthTimelineContext = () => {
  const context = useContext(GrowthTimelineContext);
  if (!context) {
    throw new Error('useGrowthTimelineContext must be used within GrowthTimelineProvider');
  }
  return context;
};

interface GrowthTimelineProviderProps {
  children: React.ReactNode;
}

export const GrowthTimelineProvider: React.FC<GrowthTimelineProviderProps> = ({ children }) => {
  const timelineData = useGrowthTimeline();

  return (
    <GrowthTimelineContext.Provider value={timelineData}>
      {children}
    </GrowthTimelineContext.Provider>
  );
};
