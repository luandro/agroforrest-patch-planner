
import React, { useEffect } from 'react';
import { useGrowthTimeline } from '../../hooks/useGrowthTimeline';
import { useTimelineAutoHide } from '../../hooks/useTimelineAutoHide';
import { useTimelineStore } from '../../stores/timelineStore';
import { useSideViewStore } from '../../stores/sideViewStore';
import { MinimalTimelineSlider } from './MinimalTimelineSlider';
import { FullTimelineSlider } from './FullTimelineSlider';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
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
  const { viewMode } = useSideViewStore();

  const { isInactive, handleActivity } = useTimelineAutoHide({
    isMinimal,
    isPlaying
  });

  // Ensure timeline is active when component is visible
  useEffect(() => {
    if (isVisible) {
      setTimelineActive(true);
      console.log('[Timeline Slider] Activated timeline - View mode:', viewMode);
    } else {
      setTimelineActive(false);
      console.log('[Timeline Slider] Deactivated timeline');
    }
  }, [isVisible, setTimelineActive, viewMode]);

  // Enhanced auto-play effect with debugging
  useEffect(() => {
    if (!isPlaying) return;

    console.log('[Timeline] Auto-play active, speed:', playbackSpeed, 'view:', viewMode);

    const interval = setInterval(() => {
      setCurrentMonth(prev => {
        const increment = playbackSpeed * 2;
        const next = prev + increment;
        
        if (next >= maxMonths) {
          console.log('[Timeline] Reached end, stopping playback');
          stopPlayback();
          return maxMonths;
        }
        
        console.log('[Timeline] Auto-increment:', prev, '->', next, `(${viewMode} view)`);
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, maxMonths, setCurrentMonth, stopPlayback, viewMode]);

  if (!isVisible) return null;

  // Force minimal mode on mobile devices or when explicitly requested
  const shouldUseMinimal = isMinimal || isMobile;

  // Render minimal mobile UI when shouldUseMinimal is true
  if (shouldUseMinimal) {
    return (
      <div className="z-[100]">
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
      </div>
    );
  }

  // Render full desktop/tablet UI
  return (
    <div className="z-[100]">
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
    </div>
  );
};
