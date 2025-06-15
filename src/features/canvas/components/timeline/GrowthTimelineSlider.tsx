
import React, { useEffect } from 'react';
import { useGrowthTimeline } from '../../hooks/useGrowthTimeline';
import { useTimelineAutoHide } from '../../hooks/useTimelineAutoHide';
import { useTimelineStore } from '../../stores/timelineStore';
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

  const { setTimelineActive } = useTimelineStore();

  const { isInactive, handleActivity } = useTimelineAutoHide({
    isMinimal,
    isPlaying
  });

  // Ensure timeline is active when component is visible
  useEffect(() => {
    if (isVisible) {
      setTimelineActive(true);
      console.log('[Timeline Slider] Activated timeline');
    } else {
      setTimelineActive(false);
      console.log('[Timeline Slider] Deactivated timeline');
    }
  }, [isVisible, setTimelineActive]);

  // Enhanced auto-play effect with debugging
  useEffect(() => {
    if (!isPlaying) return;

    console.log('[Timeline] Auto-play active, speed:', playbackSpeed);

    const interval = setInterval(() => {
      setCurrentMonth(prev => {
        const increment = playbackSpeed * 2;
        const next = prev + increment;
        
        if (next >= maxMonths) {
          console.log('[Timeline] Reached end, stopping playback');
          stopPlayback();
          return maxMonths;
        }
        
        console.log('[Timeline] Auto-increment:', prev, '->', next);
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
