
import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MinimalTimelineSliderProps {
  currentMonth: number;
  setCurrentMonth: (month: number) => void;
  isPlaying: boolean;
  startPlayback: () => void;
  stopPlayback: () => void;
  resetTimeline: () => void;
  maxMonths: number;
  currentStage: {
    label: string;
    description: string;
  };
  onClose?: () => void;
  onActivity: () => void;
  isInactive: boolean;
  className?: string;
}

const formatTime = (months: number): string => {
  if (months < 12) {
    return `${Math.round(months)}m`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);
  return remainingMonths > 0 ? `${years}a ${remainingMonths}m` : `${years}a`;
};

export const MinimalTimelineSlider: React.FC<MinimalTimelineSliderProps> = ({
  currentMonth,
  setCurrentMonth,
  isPlaying,
  startPlayback,
  stopPlayback,
  resetTimeline,
  maxMonths,
  currentStage,
  onClose,
  onActivity,
  isInactive,
  className
}) => {
  const handleSliderChange = (values: number[]) => {
    setCurrentMonth(values[0]);
    onActivity();
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
    onActivity();
  };

  const handleReset = () => {
    resetTimeline();
    onActivity();
  };

  const handleClose = () => {
    onClose?.();
    onActivity();
  };

  return (
    <div 
      className={cn(
        "fixed bottom-4 left-4 right-4 z-50 transition-all duration-300",
        isInactive && "opacity-30",
        className
      )}
      onClick={onActivity}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-3">
        {/* Header - Compressed */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <Badge variant="secondary" className="text-xs">
              {formatTime(currentMonth)}
            </Badge>
          </div>
          {onClose && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClose}
              className="p-1 h-6 w-6 text-gray-500"
            >
              ×
            </Button>
          )}
        </div>

        {/* Slim Timeline Slider */}
        <div className="mb-3">
          <Slider
            value={[currentMonth]}
            onValueChange={handleSliderChange}
            max={maxMonths}
            min={0}
            step={1}
            className="w-full [&>*]:h-1"
          />
        </div>

        {/* Minimal Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={togglePlayback}
              className="h-8 w-8 p-0"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>

          {/* Compact time display */}
          <div className="text-xs text-gray-600">
            {currentStage.label}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-green-500 h-1 rounded-full transition-all duration-200"
            style={{ width: `${(currentMonth / maxMonths) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
