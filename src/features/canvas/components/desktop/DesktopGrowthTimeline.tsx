
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  X, 
  Calendar
} from 'lucide-react';
import { useGrowthTimeline } from '../../hooks/useGrowthTimeline';
import { usePlantPlacementStore } from '../../stores/plantPlacementStore';
import { TimeDisplay } from './timeline/TimeDisplay';
import { TimelineControls } from './timeline/TimelineControls';
import { PlantStatistics } from './timeline/PlantStatistics';
import { GrowthStagesReference } from './timeline/GrowthStagesReference';

interface DesktopGrowthTimelineProps {
  onClose: () => void;
  focusedBedId?: string;
  isInFocusMode?: boolean;
}

export const DesktopGrowthTimeline: React.FC<DesktopGrowthTimelineProps> = ({
  onClose,
  focusedBedId,
  isInFocusMode: _isInFocusMode = false
}) => {
  const {
    currentMonth,
    setCurrentMonth,
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    currentStage,
    startPlayback,
    stopPlayback,
    resetTimeline,
    maxMonths
  } = useGrowthTimeline();

  const { placements, getPlacementsForBed } = usePlantPlacementStore();

  // Get relevant placements
  const relevantPlacements = focusedBedId 
    ? getPlacementsForBed(focusedBedId)
    : placements;

  return (
    <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-white/95 backdrop-blur-sm border-l border-gray-200 shadow-xl z-40">
      <div className="p-6 space-y-6 overflow-y-auto h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Linha do Tempo</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Time Display */}
        <TimeDisplay 
          currentMonth={currentMonth}
          currentStage={currentStage}
        />

        {/* Timeline Controls */}
        <TimelineControls
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          setPlaybackSpeed={setPlaybackSpeed}
          startPlayback={startPlayback}
          stopPlayback={stopPlayback}
          resetTimeline={resetTimeline}
          maxMonths={maxMonths}
        />

        {/* Plant Statistics */}
        <PlantStatistics relevantPlacements={relevantPlacements} />

        {/* Growth Stages Reference */}
        <GrowthStagesReference currentMonth={currentMonth} />
      </div>
    </div>
  );
};
