
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  FastForward,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime, SPEED_OPTIONS, getGrowthStageCompact } from '../../utils/timelineUtils';

interface SideViewTimelineMobileProps {
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

export const SideViewTimelineMobile: React.FC<SideViewTimelineMobileProps> = ({
  currentMonth,
  setCurrentMonth,
  isPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  startPlayback,
  stopPlayback,
  resetTimeline,
  maxMonths,
  className,
  onClose
}) => {
  const handleSliderChange = (values: number[]) => {
    setCurrentMonth(values[0]);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const cycleSpeed = () => {
    const currentIndex = SPEED_OPTIONS.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
    setPlaybackSpeed(SPEED_OPTIONS[nextIndex]);
  };

  const progressPercentage = (currentMonth / maxMonths) * 100;
  const growthStage = getGrowthStageCompact(currentMonth);

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-xl",
      "safe-area-inset-bottom pb-safe",
      className
    )}>
      <div className="p-4 space-y-4 max-w-full">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="font-medium text-sm truncate">Linha do Tempo</span>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {formatTime(currentMonth)}
            </Badge>
          </div>
          {onClose && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-11 w-11 p-0 flex-shrink-0 touch-manipulation"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Mobile Timeline Slider - Enhanced for touch */}
        <div className="space-y-3">
          <div className="px-2">
            <Slider
              value={[currentMonth]}
              onValueChange={handleSliderChange}
              max={maxMonths}
              min={0}
              step={1}
              className="w-full [&_.slider-thumb]:h-7 [&_.slider-thumb]:w-7 [&_.slider-track]:h-3"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 px-2">
            <span>Início</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
            <span>{formatTime(maxMonths)}</span>
          </div>
        </div>

        {/* Mobile Controls - Larger touch targets */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              size="default"
              onClick={togglePlayback}
              className="h-12 px-6 touch-manipulation font-medium"
            >
              {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isPlaying ? 'Pausar' : 'Iniciar'}
            </Button>

            <Button
              size="default"
              variant="outline"
              onClick={resetTimeline}
              className="h-12 w-12 p-0 touch-manipulation"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>

          <Button
            size="default"
            variant="outline"
            onClick={cycleSpeed}
            className="h-12 px-4 touch-manipulation flex items-center gap-2 min-w-[80px]"
          >
            <FastForward className="w-4 h-4" />
            <span className="font-medium">{playbackSpeed}x</span>
          </Button>
        </div>

        {/* Progress Bar - More prominent */}
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Current Stage Info - Compact for mobile */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-center">
            <div className="font-medium text-green-800 text-sm">
              {growthStage.label}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {growthStage.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
