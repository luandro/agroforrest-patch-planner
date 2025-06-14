
import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
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
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Criador de Canteiro</h1>
          <p className="mt-2 text-gray-600">
            Use as ferramentas para criar canteiros retangulares e circulares
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-1 text-sm text-gray-500">
              Teclas: ←↑↓→ para mover, +/- para zoom, 0 para resetar, Del para deletar | FPS: {fps}
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

        {/* Bed Information */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Informações dos Canteiros</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Total de Canteiros:</span><br />
              {beds.length}
            </div>
            <div>
              <span className="font-medium">Selecionados:</span><br />
              {selectedBedIds.length}
            </div>
            <div>
              <span className="font-medium">Ferramenta Ativa:</span><br />
              {tool === 'pan' && 'Navegação'}
              {tool === 'create-rectangle' && 'Criar Retângulo'}
              {tool === 'create-circle' && 'Criar Círculo'}
              {tool === 'select' && 'Selecionar'}
            </div>
            <div>
              <span className="font-medium">Área Total:</span><br />
              {beds.reduce((total, bed) => {
                if (bed.shape === 'rectangle') {
                  return total + ((bed.dimensions.length || 0) * (bed.dimensions.width || 0));
                } else {
                  const radius = bed.dimensions.radius || 0;
                  return total + (Math.PI * radius * radius);
                }
              }, 0).toFixed(1)}m²
            </div>
          </div>
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
          <h4 className="text-lg font-medium text-blue-900 mb-3">Como usar as ferramentas de canteiro</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div>
              <h5 className="font-medium mb-2">📱 Criação de canteiros:</h5>
              <ul className="text-sm space-y-1">
                <li>• Selecione a ferramenta retângulo ou círculo</li>
                <li>• Toque no painel Config para ajustar dimensões</li>
                <li>• Toque e arraste no canvas para criar</li>
                <li>• Configure múltiplos canteiros com espaçamento</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">🎯 Edição e seleção:</h5>
              <ul className="text-sm space-y-1">
                <li>• Use a ferramenta Selecionar</li>
                <li>• Toque em canteiros para selecionar</li>
                <li>• Arraste para mover canteiros</li>
                <li>• Use Ctrl+Z/Ctrl+Y para desfazer/refazer</li>
                <li>• Tecla Delete para remover selecionados</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatchCreatorPage;
