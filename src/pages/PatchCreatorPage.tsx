
import React, { useState, useEffect } from 'react';
import PatchCanvas from '../features/canvas/components/PatchCanvas';
import MainLayout from '../components/layout/MainLayout';
import { PlantSelectionPanel } from '../features/canvas/components/PlantSelectionPanel';
import { CanvasViewport } from '../features/canvas/types/canvas.types';
import { PlantSpecies } from '../features/canvas/types/species.types';
import { useBedStore } from '../features/canvas/stores/bedStore';
import { usePlantPlacementStore } from '../features/canvas/stores/plantPlacementStore';
import { GrowthTimelineProvider } from '../features/canvas/providers/GrowthTimelineProvider';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PatchCreatorPage: React.FC = () => {
  const [viewport, setViewport] = useState<CanvasViewport | null>(null);
  const [fps, setFps] = useState(0);
  const [isPlantSelectionOpen, setIsPlantSelectionOpen] = useState(false);
  const { beds, selectedBedIds, tool, setTool, loadBeds, focusMode, exitFocusMode } = useBedStore();
  const { setSelectedSpecies } = usePlantPlacementStore();

  // Ensure pan tool is default on page load
  useEffect(() => {
    if (tool !== 'pan') {
      setTool('pan');
    }
  }, []);

  const handleViewportChange = (newViewport: CanvasViewport) => {
    setViewport(newViewport);
    console.log('Viewport changed:', newViewport);
  };

  const handleFitAll = () => {
    // This will be called by the canvas component
    if (viewport) {
      console.log('Fitting all beds to screen');
    }
  };

  const handleCreateNewPatch = () => {
    // Reset the canvas state
    loadBeds([]);
    setTool('pan');
    console.log('Creating new patch');
  };

  const handleOpenPlantSelection = () => {
    setIsPlantSelectionOpen(true);
  };

  const handleClosePlantSelection = () => {
    setIsPlantSelectionOpen(false);
  };

  const handleSelectSpecies = (species: PlantSpecies) => {
    console.log('Selected species for placement:', species);
    setSelectedSpecies(species);
    // Panel will close automatically via the PlantSelectionPanel component
  };

  // Handle exit focus mode with proper cleanup
  const handleExitFocus = () => {
    exitFocusMode();
    console.log('Exited focus mode from header button');
  };

  // FPS counter for development
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    
    const updateFps = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(updateFps);
    };
    
    updateFps();
  }, []);

  return (
    <GrowthTimelineProvider>
      <MainLayout 
        showUserMenu={true}
        onFitAll={handleFitAll}
        onCreateNewPatch={handleCreateNewPatch}
      >
        {/* Page Header - Fixed at top */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 h-16">
          <div className="px-4 h-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Back button for focus mode */}
              {focusMode.isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExitFocus}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              )}
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {focusMode.isActive ? 'Modo Plantio - Canteiro Focado' : 'Criador de Canteiros'}
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  {focusMode.isActive 
                    ? 'Plante espécies com precisão usando a grade de 10cm'
                    : 'Crie e organize canteiros para seu sistema agroflorestal'
                  }
                </p>
              </div>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-500 hidden md:block">
                FPS: {fps} | Canteiros: {beds.length} | Selecionados: {selectedBedIds.length} | Ferramenta: {tool}
                {focusMode.isActive && ` | Focado: ${focusMode.bedId}`}
              </div>
            )}
          </div>
        </header>

        {/* Full-Screen Canvas */}
        <main className="relative">
          <PatchCanvas
            onViewportChange={handleViewportChange}
            onOpenPlantSelection={handleOpenPlantSelection}
            gridSize={1}
            minZoom={0.5}
            maxZoom={5}
          />
        </main>

        {/* Plant Selection Panel */}
        <PlantSelectionPanel
          isOpen={isPlantSelectionOpen}
          onClose={handleClosePlantSelection}
          onSelectSpecies={handleSelectSpecies}
          selectedBedId={focusMode.isActive ? focusMode.bedId : undefined}
        />

        {/* Hidden stats for development */}
        {process.env.NODE_ENV === 'development' && viewport && (
          <div className="fixed bottom-20 right-4 bg-black/80 text-white text-xs p-2 rounded font-mono z-50 hidden lg:block">
            <div>Área Total: {beds.reduce((total, bed) => {
              if (bed.shape === 'rectangle') {
                return total + ((bed.dimensions.length || 0) * (bed.dimensions.width || 0));
              } else {
                const radius = bed.dimensions.radius || 0;
                return total + (Math.PI * radius * radius);
              }
            }, 0).toFixed(1)}m²</div>
            <div>Área Visível: {(viewport.width * viewport.height).toFixed(0)}m²</div>
          </div>
        )}
      </MainLayout>
    </GrowthTimelineProvider>
  );
};

export default PatchCreatorPage;
