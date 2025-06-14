
import React, { useState } from 'react';
import PatchCanvas from '../features/canvas/components/PatchCanvas';
import { CanvasViewport } from '../features/canvas/types/canvas.types';
import { useBedStore } from '../features/canvas/stores/bedStore';

const PatchCreatorPage: React.FC = () => {
  const [viewport, setViewport] = useState<CanvasViewport | null>(null);
  const [fps, setFps] = useState(0);
  const { beds, selectedBedIds, tool } = useBedStore();

  const handleViewportChange = (newViewport: CanvasViewport) => {
    setViewport(newViewport);
    console.log('Viewport changed:', newViewport);
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
    <>
      {/* Page Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 h-16">
        <div className="px-4 h-full flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Criador de Canteiros</h1>
            <p className="text-sm text-gray-600 hidden sm:block">
              Crie e organize canteiros para seu sistema agroflorestal
            </p>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 hidden md:block">
              FPS: {fps} | Canteiros: {beds.length} | Selecionados: {selectedBedIds.length}
            </div>
          )}
        </div>
      </header>

      {/* Full-Screen Canvas */}
      <main className="relative">
        <PatchCanvas
          onViewportChange={handleViewportChange}
          gridSize={1}
          minZoom={0.5}
          maxZoom={5}
        />
      </main>

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
    </>
  );
};

export default PatchCreatorPage;
