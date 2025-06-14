
import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import PatchCanvas from '../features/canvas/components/PatchCanvas';
import { CanvasViewport } from '../features/canvas/types/canvas.types';

const PatchCreatorPage: React.FC = () => {
  const [viewport, setViewport] = useState<CanvasViewport | null>(null);
  const [fps, setFps] = useState(0);

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
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Criador de Canteiro</h1>
          <p className="mt-2 text-gray-600">
            Use gestos de toque para navegar - arraste para mover, belisque para dar zoom
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-1 text-sm text-gray-500">
              Teclas: ←↑↓→ para mover, +/- para zoom, 0 para resetar | FPS: {fps}
            </p>
          )}
        </div>

        {/* Canvas */}
        <div className="h-[600px] w-full">
          <PatchCanvas
            onViewportChange={handleViewportChange}
            gridSize={1}
            minZoom={0.5}
            maxZoom={5}
          />
        </div>

        {/* Test Information */}
        {process.env.NODE_ENV === 'development' && viewport && (
          <div className="bg-gray-100 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Informações de Teste</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Posição Central:</span><br />
                X: {viewport.centerX.toFixed(2)}m<br />
                Y: {viewport.centerY.toFixed(2)}m
              </div>
              <div>
                <span className="font-medium">Zoom:</span><br />
                {viewport.zoom.toFixed(2)}x
              </div>
              <div>
                <span className="font-medium">Área Visível:</span><br />
                {viewport.width.toFixed(1)} × {viewport.height.toFixed(1)}m<br />
                ({(viewport.width * viewport.height).toFixed(0)}m²)
              </div>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="text-lg font-medium text-blue-900 mb-3">Como usar o canvas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div>
              <h5 className="font-medium mb-2">📱 No celular:</h5>
              <ul className="text-sm space-y-1">
                <li>• Arraste com um dedo para mover</li>
                <li>• Belisque com dois dedos para dar zoom</li>
                <li>• Use os botões + e - para zoom preciso</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">🖥️ No computador:</h5>
              <ul className="text-sm space-y-1">
                <li>• Clique e arraste para mover</li>
                <li>• Roda do mouse para dar zoom</li>
                <li>• Setas do teclado para mover</li>
                <li>• +/- para zoom, 0 para resetar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatchCreatorPage;
