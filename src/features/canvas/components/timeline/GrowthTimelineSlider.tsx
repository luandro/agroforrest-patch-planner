
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

  // Proper timeline activation/deactivation
  useEffect(() => {
    console.log('[Timeline Slider] Visibility changed:', isVisible);
    
    if (isVisible) {
      setTimelineActive(true);
      // Start at month 0 to show seedlings
      setCurrentMonth(0);
    } else {
      setTimelineActive(false);
      // Stop playback when closing
      if (isPlaying) {
        stopPlayback();
      }
    }
    
    return () => {
      // Cleanup on unmount
      if (isVisible) {
        setTimelineActive(false);
      }
    };
  }, [isVisible, setTimelineActive, setCurrentMonth, isPlaying, stopPlayback]);

  // Enhanced auto-play with proper month increments
  useEffect(() => {
    if (!isPlaying || !isVisible) return;

    console.log('[Timeline Slider] Auto-play active:', { playbackSpeed, currentMonth });

    const interval = setInterval(() => {
      setCurrentMonth(prev => {
        const increment = playbackSpeed * 0.5;
        const next = prev + increment;
        
        if (next >= maxMonths) {
          console.log('[Timeline Slider] Reached end, stopping');
          stopPlayback();
          return maxMonths;
        }
        
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, maxMonths, setCurrentMonth, stopPlayback, currentMonth, isVisible]);

  if (!isVisible) return null;

  // Use minimal mode on mobile or when explicitly requested
  const shouldUseMinimal = isMinimal || isMobile;

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
