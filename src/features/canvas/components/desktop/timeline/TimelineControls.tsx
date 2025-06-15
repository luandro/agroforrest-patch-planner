
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GROWTH_STAGES } from '../../../hooks/useGrowthTimeline';

interface TimelineControlsProps {
  currentMonth: number;
  setCurrentMonth: (month: number) => void;
  isPlaying: boolean;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  startPlayback: () => void;
  stopPlayback: () => void;
  resetTimeline: () => void;
  maxMonths: number;
}

const formatTime = (months: number): string => {
  if (months < 12) {
    return `${Math.round(months)} meses`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);
  return remainingMonths > 0 ? `${years} anos ${remainingMonths} meses` : `${years} anos`;
};

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  currentMonth,
  setCurrentMonth,
  isPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  startPlayback,
  stopPlayback,
  resetTimeline,
  maxMonths
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
    const newSpeed = (() => {
      switch (playbackSpeed) {
        case 0.5: return 1;
        case 1: return 2;
        case 2: return 4;
        case 4: return 0.5;
        default: return 1;
      }
    })();
    setPlaybackSpeed(newSpeed);
  };

  const getCurrentProgress = (): number => {
    return (currentMonth / maxMonths) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Progresso do Tempo
        </label>
        <Slider
          value={[currentMonth]}
          onValueChange={handleSliderChange}
          max={maxMonths}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0m</span>
          <span>{Math.round(getCurrentProgress())}%</span>
          <span>{formatTime(maxMonths)}</span>
        </div>
      </div>

      {/* Stage Markers */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {GROWTH_STAGES.filter((_, i) => i % 2 === 0).map((stage) => (
          <div 
            key={stage.months} 
            className={cn(
              "text-center p-2 rounded border transition-colors",
              currentMonth >= stage.months 
                ? "bg-green-100 border-green-300 text-green-800" 
                : "bg-gray-50 border-gray-200 text-gray-600"
            )}
          >
            <div className="font-medium">{stage.label}</div>
          </div>
        ))}
      </div>

      {/* Playback Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={togglePlayback}
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pausar' : 'Reproduzir'}
              </Button>
              
              <Button
                variant="outline"
                onClick={resetTimeline}
                size="sm"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Velocidade:</span>
              <Button
                variant="outline"
                onClick={cycleSpeed}
                size="sm"
                className="flex items-center gap-1 min-w-[60px]"
              >
                <Zap className="w-3 h-3" />
                {playbackSpeed}x
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${getCurrentProgress()}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Growth Prediction */}
      <Separator />
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Previsão de Crescimento
        </h4>
        <div className="text-sm text-gray-600">
          {currentMonth < 12 ? (
            "Fase inicial de estabelecimento"
          ) : currentMonth < 60 ? (
            "Período de crescimento ativo"
          ) : (
            "Aproximando-se da maturidade"
          )}
        </div>
      </div>
    </div>
  );
};
