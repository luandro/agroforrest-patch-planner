import React, { useState } from 'react';
import { Share2, Printer, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Patch } from '../types/patch.types';
import { Bed } from '../types/bed.types';
import { PlantPlacement } from '../stores/plantPlacementStore';
import { PatchPreviewCanvas } from './PatchPreviewCanvas';
import { SpeciesLegend } from './SpeciesLegend';
import { PatchStatistics } from './PatchStatistics';
import { ShareDialog } from './ShareDialog';
import { FullTimelineSlider } from './timeline/FullTimelineSlider';
import { useGrowthTimelineContext } from '../providers/GrowthTimelineProvider';

interface PatchPreviewLayoutProps {
  patch: Patch;
  beds: Bed[];
  placements: PlantPlacement[];
}

export const PatchPreviewLayout: React.FC<PatchPreviewLayoutProps> = ({
  patch,
  beds,
  placements
}) => {
  const navigate = useNavigate();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [showStatistics, setShowStatistics] = useState(true);
  
  const {
    currentMonth,
    setCurrentMonth,
    isPlaying,
    startPlayback,
    stopPlayback,
    resetTimeline,
    maxMonths,
    currentStage
  } = useGrowthTimelineContext();

  // Filter beds and placements for current patch
  const patchBeds = beds.filter(bed => 
    bed.patchId === patch.id || (!bed.patchId && beds.length > 0)
  );
  
  const patchPlacements = placements.filter(placement => 
    placement.patchId === patch.id || 
    (!placement.patchId && patchBeds.some(bed => bed.id === placement.bedId))
  );

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Hidden in print */}
      <header className="print:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back button and patch info */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
              
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-none">
                  {patch.name}
                </h1>
                {patch.description && (
                  <p className="text-sm text-gray-500 truncate max-w-[200px] sm:max-w-none">
                    {patch.description}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center space-x-2">
              {/* Toggle buttons */}
              <div className="hidden md:flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLegend(!showLegend)}
                  className="flex items-center space-x-1"
                >
                  {showLegend ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="text-xs">Legenda</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStatistics(!showStatistics)}
                  className="flex items-center space-x-1"
                >
                  {showStatistics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="text-xs">Estatísticas</span>
                </Button>
              </div>

              {/* Action buttons */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Imprimir</span>
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Compartilhar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Print header - Only visible in print */}
      <div className="hidden print:block print:mb-6">
        <div className="text-center border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">{patch.name}</h1>
          {patch.description && (
            <p className="text-gray-600 mt-2">{patch.description}</p>
          )}
          {patch.location && (
            <p className="text-sm text-gray-500 mt-1">Local: {patch.location}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Criado em: {new Date(patch.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] print:min-h-0">
        {/* Canvas area */}
        <div className="flex-1 relative">
          <PatchPreviewCanvas
            patch={patch}
            beds={patchBeds}
            placements={patchPlacements}
          />
        </div>

        {/* Sidebar panels */}
        <div className="w-full lg:w-80 xl:w-96 bg-gray-50 border-l border-gray-200 print:w-full print:bg-white print:border-none">
          <div className="p-4 space-y-4 print:space-y-6">
            {/* Patch metadata - Print only */}
            <div className="hidden print:block">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Informações do Patch</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Dimensões:</span> {patch.size.width}m × {patch.size.height}m
                  </div>
                  {patch.location && (
                    <div>
                      <span className="font-medium">Local:</span> {patch.location}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Última atualização:</span> {new Date(patch.updatedAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Panel */}
            {showStatistics && (
              <PatchStatistics
                patch={patch}
                beds={patchBeds}
                placements={patchPlacements}
              />
            )}

            {/* Species Legend */}
            {showLegend && (
              <SpeciesLegend
                placements={patchPlacements}
              />
            )}

            {/* Timeline info - mobile friendly */}
            <div className="lg:hidden bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Linha do Tempo</h3>
                <Badge variant="secondary" className="text-xs">
                  {currentMonth < 12 ? `${Math.round(currentMonth)} meses` : 
                   `${Math.floor(currentMonth / 12)} anos ${Math.round(currentMonth % 12)} meses`}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-medium text-green-700">{currentStage.label}</div>
                <div className="text-xs mt-1">{currentStage.description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Slider - Desktop */}
      <div className="hidden lg:block">
        <FullTimelineSlider
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          isPlaying={isPlaying}
          playbackSpeed={1}
          setPlaybackSpeed={() => {}} // Not needed for preview
          startPlayback={startPlayback}
          stopPlayback={stopPlayback}
          resetTimeline={resetTimeline}
          maxMonths={maxMonths}
          currentStage={currentStage}
        />
      </div>

      {/* Share Dialog */}
      <ShareDialog
        patch={patch}
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />
    </div>
  );
};
