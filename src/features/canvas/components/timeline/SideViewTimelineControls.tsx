
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
import { useIsMobile } from '@/hooks/use-mobile';

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

const formatTime = (months: number): string => {
  if (months < 12) {
    return `${Math.round(months)} meses`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);
  return remainingMonths > 0 ? `${years}a ${remainingMonths}m` : `${years} anos`;
};

const SPEED_OPTIONS = [0.5, 1, 2, 4];

export const SideViewTimelineControls: React.FC<SideViewTimelineControlsProps> = ({
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
  const isMobile = useIsMobile();

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

  const handleReset = () => {
    resetTimeline();
  };

  const progressPercentage = (currentMonth / maxMonths) * 100;

  if (isMobile) {
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
                onClick={handleReset}
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
                {currentMonth < 12 ? 'Estabelecimento' : 
                 currentMonth < 60 ? 'Crescimento Ativo' : 
                 'Maturidade'}
              </div>
              <div className="text-xs text-green-600 mt-1">
                {currentMonth < 12 ? 'Plantas se estabelecendo' :
                 currentMonth < 60 ? 'Crescimento acelerado' :
                 'Plantas maduras'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout - Enhanced positioning and z-index
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
                {currentMonth < 12 ? 'Estabelecimento' : 
                 currentMonth < 60 ? 'Crescimento Ativo' : 
                 'Maturidade'}
              </div>
              <div className="text-sm text-green-600">
                {currentMonth < 12 ? 'Plantas se estabelecendo no solo' :
                 currentMonth < 60 ? 'Período de maior crescimento' :
                 'Plantas maduras e produtivas'}
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
              onClick={handleReset}
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
