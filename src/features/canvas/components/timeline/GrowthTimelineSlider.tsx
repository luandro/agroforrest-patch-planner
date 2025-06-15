
import React, { useEffect } from 'react';
import { useGrowthTimeline } from '../../hooks/useGrowthTimeline';
import { useTimelineAutoHide } from '../../hooks/useTimelineAutoHide';
import { MinimalTimelineSlider } from './MinimalTimelineSlider';
import { FullTimelineSlider } from './FullTimelineSlider';

interface GrowthTimelineSliderProps {
  isVisible: boolean;
  onClose?: () => void;
  className?: string;
  isMinimal?: boolean;
}

export const GrowthTimelineSlider: React.FC<GrowthTimelineSliderProps> = ({
  isVisible,
  onClose,
  className,
  isMinimal = false
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

  const { isInactive, handleActivity } = useTimelineAutoHide({
    isMinimal,
    isPlaying
  });

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentMonth(prev => {
        const next = prev + (playbackSpeed * 2);
        if (next >= maxMonths) {
          stopPlayback();
          return maxMonths;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, maxMonths, setCurrentMonth, stopPlayback]);

  if (!isVisible) return null;

  // Render minimal mobile UI when isMinimal is true
  if (isMinimal) {
    return (
      <MinimalTimelineSlider
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        isPlaying={isPlaying}
        startPlayback={startPlayback}
        stopPlayback={stopPlayback}
        resetTimeline={resetTimeline}
        maxMonths={maxMonths}
        currentStage={currentStage}
        onClose={onClose}
        onActivity={handleActivity}
        isInactive={isInactive}
        className={className}
      />
    );
  }

  // Render full desktop/tablet UI
  return (
    <FullTimelineSlider
      currentMonth={currentMonth}
      setCurrentMonth={setCurrentMonth}
      isPlaying={isPlaying}
      playbackSpeed={playbackSpeed}
      setPlaybackSpeed={setPlaybackSpeed}
      startPlayback={startPlayback}
      stopPlayback={stopPlayback}
      resetTimeline={resetTimeline}
      maxMonths={maxMonths}
      currentStage={currentStage}
      onClose={onClose}
      className={className}
    />
  );
};
