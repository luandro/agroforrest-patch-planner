
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

  // Initialize timeline at year 0 when activated
  useEffect(() => {
    if (isVisible) {
      console.log('[Timeline] Activating timeline - resetting to month 0');
      setTimelineActive(true);
      // Force start at year 0 to show seedlings
      setCurrentMonth(0);
    } else {
      setTimelineActive(false);
      console.log('[Timeline] Deactivating timeline');
    }
  }, [isVisible, setTimelineActive, setCurrentMonth]);

  // Enhanced auto-play with proper month increments for visibility
  useEffect(() => {
    if (!isPlaying) return;

    console.log('[Timeline] Auto-play active, speed:', playbackSpeed, 'current:', currentMonth);

    const interval = setInterval(() => {
      setCurrentMonth(prev => {
        // Smaller increments for smoother growth animation
        const increment = playbackSpeed * 0.5; // Slower increment for better visual feedback
        const next = prev + increment;
        
        if (next >= maxMonths) {
          console.log('[Timeline] Reached end, stopping playback');
          stopPlayback();
          return maxMonths;
        }
        
        // Force re-render by ensuring state change is detected
        console.log('[Timeline] Month increment:', prev, '->', next);
        return next;
      });
    }, 100); // Faster interval for smoother animation

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, maxMonths, setCurrentMonth, stopPlayback, currentMonth]);

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
