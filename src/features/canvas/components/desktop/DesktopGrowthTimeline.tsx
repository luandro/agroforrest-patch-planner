
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  X, 
  Calendar,
  TrendingUp,
  Leaf,
  BarChart3
} from 'lucide-react';
import { useGrowthTimeline, GROWTH_STAGES } from '../../hooks/useGrowthTimeline';
import { usePlantPlacementStore } from '../../stores/plantPlacementStore';
import { cn } from '@/lib/utils';

interface DesktopGrowthTimelineProps {
  onClose: () => void;
  focusedBedId?: string;
  isInFocusMode?: boolean;
}

export const DesktopGrowthTimeline: React.FC<DesktopGrowthTimelineProps> = ({
  onClose,
  focusedBedId,
  isInFocusMode = false
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

  const { placements, getPlacementsForBed } = usePlantPlacementStore();

  // Get relevant placements
  const relevantPlacements = focusedBedId 
    ? getPlacementsForBed(focusedBedId)
    : placements;

  // Calculate statistics
  const totalPlants = relevantPlacements.length;
  const speciesCount = new Set(relevantPlacements.map(p => p.species.id)).size;
  const speciesSummary = relevantPlacements.reduce((acc, placement) => {
    const name = placement.species.commonName;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
        case 0.5: return 1;
        case 1: return 2;
        case 2: return 4;
        case 4: return 0.5;
        default: return 1;
      }
    });
  };

  const formatTime = (months: number): string => {
    if (months < 12) {
      return `${Math.round(months)} meses`;
    }
    const years = Math.floor(months / 12);
    const remainingMonths = Math.round(months % 12);
    return remainingMonths > 0 ? `${years} anos ${remainingMonths} meses` : `${years} anos`;
  };

  const getCurrentProgress = (): number => {
    return (currentMonth / maxMonths) * 100;
  };

  return (
    <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-white/95 backdrop-blur-sm border-l border-gray-200 shadow-xl z-40">
      <div className="p-6 space-y-6 overflow-y-auto h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Linha do Tempo</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Time Display */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-700">
                {formatTime(currentMonth)}
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {currentStage.label}
              </Badge>
              <div className="text-sm text-gray-600">
                {currentStage.description}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Slider */}
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

        {/* Plant Statistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Estatísticas das Plantas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{totalPlants}</div>
                <div className="text-sm text-blue-600">Total de Plantas</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{speciesCount}</div>
                <div className="text-sm text-green-600">Espécies Diferentes</div>
              </div>
            </div>

            <Separator />

            {/* Species Breakdown */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                Distribuição por Espécie
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {Object.entries(speciesSummary).map(([species, count]) => (
                  <div key={species} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 truncate">{species}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>

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
          </CardContent>
        </Card>

        {/* Growth Stages Reference */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Estágios de Crescimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {GROWTH_STAGES.map((stage, index) => (
                <div 
                  key={stage.months}
                  className={cn(
                    "flex justify-between items-center p-2 rounded text-sm transition-colors",
                    currentMonth >= stage.months 
                      ? "bg-green-100 text-green-800" 
                      : "text-gray-600"
                  )}
                >
                  <span className="font-medium">{stage.label}</span>
                  <span className="text-xs">{formatTime(stage.months)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
