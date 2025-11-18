
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  FastForward,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime, SPEED_OPTIONS, getGrowthStage } from '../../utils/timelineUtils';

interface SideViewTimelineDesktopProps {
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

export const SideViewTimelineDesktop: React.FC<SideViewTimelineDesktopProps> = ({
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
  const growthStage = getGrowthStage(currentMonth);

  return (
    <Card className={cn(
      "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100]",
      "w-[min(700px,calc(100vw-3rem))] max-w-full",
      "shadow-2xl border-gray-300",
      className
    )}>
      <CardContent className="p-6">
        {/* Desktop Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-lg">Linha do Tempo de Crescimento</h3>
            <Badge variant="secondary">
              {formatTime(currentMonth)}
            </Badge>
          </div>
          {onClose && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Current Stage Info */}
        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-green-800">
                {growthStage.label}
              </div>
              <div className="text-sm text-green-600">
                {growthStage.description}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-700">
                {formatTime(currentMonth)}
              </div>
              <div className="text-xs text-green-600">
                de {formatTime(maxMonths)}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="mb-4 space-y-2">
          <Slider
            value={[currentMonth]}
            onValueChange={handleSliderChange}
            max={maxMonths}
            min={0}
            step={1}
            className="w-full"
          />

          {/* Time Markers */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Plantio</span>
            <span>1 ano</span>
            <span>5 anos</span>
            <span>10 anos</span>
            <span>20 anos</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={togglePlayback}
              className="flex items-center gap-2 px-6"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pausar' : 'Reproduzir'}
            </Button>

            <Button
              variant="outline"
              onClick={resetTimeline}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Velocidade:</span>
            <Button
              variant="outline"
              onClick={cycleSpeed}
              className="flex items-center gap-1 min-w-[70px]"
            >
              <FastForward className="w-3 h-3" />
              {playbackSpeed}x
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-200"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
