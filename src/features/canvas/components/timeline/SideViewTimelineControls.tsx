
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SideViewTimelineMobile } from './SideViewTimelineMobile';
import { SideViewTimelineDesktop } from './SideViewTimelineDesktop';

interface SideViewTimelineControlsProps {
  currentMonth: number;
  setCurrentMonth: (month: number) => void;
  isPlaying: boolean;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  startPlayback: () => void;
  stopPlayback: () => void;
  resetTimeline: () => void;
  maxMonths: number;
  className?: string;
  onClose?: () => void;
}

export const SideViewTimelineControls: React.FC<SideViewTimelineControlsProps> = (props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <SideViewTimelineMobile {...props} />;
  }

  return <SideViewTimelineDesktop {...props} />;
};
