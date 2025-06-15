
import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGrowthTimeline, GROWTH_STAGES } from '../../hooks/useGrowthTimeline';

interface GrowthTimelineSliderProps {
  isVisible: boolean;
  onClose?: () => void;
  className?: string;
}

export const GrowthTimelineSlider: React.FC<GrowthTimelineSliderProps> = ({
  isVisible,
  onClose,
  className
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

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentMonth(prev => {
        const next = prev + (playbackSpeed * 2); // 2 months per tick
        if (next >= maxMonths) {
          stopPlayback();
          return maxMonths;
        }
        return next;
      });
    }, 200); // 200ms intervals

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, maxMonths, setCurrentMonth, stopPlayback]);

  if (!isVisible) return null;

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
    setPlaybackSpeed(prev => {
      switch (prev) {
        case 1: return 2;
        case 2: return 4;
        case 4: return 0.5;
        default: return 1;
      }
    });
  };

  const formatTime = (months: number): string => {
    if (months < 12) {
      return `${Math.round(months)}m`;
    }
    const years = Math.floor(months / 12);
    const remainingMonths = Math.round(months % 12);
    return remainingMonths > 0 ? `${years}a ${remainingMonths}m` : `${years}a`;
  };

  return (
    <div className={cn(
      "fixed bottom-4 left-4 right-4 z-50 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 p-4",
      "md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:w-[600px]",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <h3 className="font-semibold text-gray-900">Linha do Tempo de Crescimento</h3>
          <Badge variant="secondary" className="text-xs">
            {formatTime(currentMonth)}
          </Badge>
        </div>
        {onClose && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="p-1 h-6 w-6"
          >
            ×
          </Button>
        )}
      </div>

      {/* Current Stage Info */}
      <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-green-800">{currentStage.label}</div>
            <div className="text-sm text-green-600">{currentStage.description}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-700">
              {formatTime(currentMonth)}
            </div>
            <div className="text-xs text-green-600">
              de {formatTime(maxMonths)}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="mb-4">
        <Slider
          value={[currentMonth]}
          onValueChange={handleSliderChange}
          max={maxMonths}
          min={0}
          step={1}
          className="w-full"
        />
        
        {/* Stage Markers */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {GROWTH_STAGES.filter((_, i) => i % 2 === 0).map((stage) => (
            <div key={stage.months} className="text-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full mx-auto mb-1" />
              <span>{stage.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={togglePlayback}
            className="flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pausar' : 'Reproduzir'}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={resetTimeline}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Velocidade:</span>
          <Button
            size="sm"
            variant="outline"
            onClick={cycleSpeed}
            className="flex items-center gap-1 min-w-[60px]"
          >
            <Zap className="w-3 h-3" />
            {playbackSpeed}x
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
        <div 
          className="bg-green-500 h-1 rounded-full transition-all duration-200"
          style={{ width: `${(currentMonth / maxMonths) * 100}%` }}
        />
      </div>
    </div>
  );
};
