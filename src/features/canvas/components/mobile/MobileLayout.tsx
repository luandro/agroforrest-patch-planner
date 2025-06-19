
import React from 'react';
import { cn } from '@/lib/utils';
import { CanvasTool } from '../../types/bed.types';
import { SaveStatus } from './SaveStatus';
import { MobilePlantEditor } from './MobilePlantEditor';
import { GrowthTimelineSlider } from '../timeline/GrowthTimelineSlider';
import { MobileBottomToolbar } from './MobileBottomToolbar';
import { MobileFloatingZoom } from './MobileFloatingZoom';
import { MobileBedConfigSheet } from './MobileBedConfigSheet';
import { MobileDebugDrawer } from './MobileDebugDrawer';
import { MobileMiniMap } from './MobileMiniMap';
import { MobileBedConfigButton } from './MobileBedConfigButton';
import { usePlantPlacementStore } from '../../stores/plantPlacementStore';
import { Button } from '@/components/ui/button';
import { Undo, Redo } from 'lucide-react';

interface MobileLayoutProps {
  activeTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  bedConfig: any;
  onBedConfigChange: any;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDeleteSelected: () => void;
  selectedCount: number;
  isSaving: boolean;
  showConfirmation: boolean;
  isInFocusMode: boolean;
  viewport: any;
  beds: any[];
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitAll: () => void;
  onOpenPlantSelection?: () => void;
  focusedBedId?: string;
  isCreating: boolean;
  cancelCreation: () => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  activeTool,
  onToolChange,
  bedConfig,
  onBedConfigChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onDeleteSelected,
  selectedCount,
  isSaving,
  showConfirmation,
  isInFocusMode,
  viewport,
  beds,
  onZoomIn,
  onZoomOut,
  onFitAll,
  onOpenPlantSelection,
  focusedBedId,
  isCreating,
  cancelCreation
}) => {
  const { 
    selectedPlacementIds, 
    clearSelection, 
    selectedSpecies,
    undo: plantUndo,
    redo: plantRedo,
    canUndo: canUndoPlants,
    canRedo: canRedoPlants
  } = usePlantPlacementStore();
  
  const [showPlantEditor, setShowPlantEditor] = React.useState(false);
  const [showTimeline, setShowTimeline] = React.useState(false);
  const [showBedConfig, setShowBedConfig] = React.useState(false);

  // Show plant editor when plants are selected in focus mode
  const hasSelectedPlants = selectedPlacementIds.length > 0;
  
  React.useEffect(() => {
    if (isInFocusMode && hasSelectedPlants && !showPlantEditor) {
      const timer = setTimeout(() => {
        setShowPlantEditor(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInFocusMode, hasSelectedPlants, showPlantEditor]);

  const handleClosePlantEditor = () => {
    setShowPlantEditor(false);
    clearSelection();
  };

  const handleCloseTimeline = () => {
    setShowTimeline(false);
  };

  const handleOpenBedConfig = () => {
    setShowBedConfig(true);
  };

  const handleCloseBedConfig = () => {
    setShowBedConfig(false);
  };

  const handleNavigateTo = (x: number, y: number) => {
    // Navigation will be handled by the minimap component
    console.log('Navigate to:', x, y);
  };

  // Plant editor modal for focus mode
  if (showPlantEditor && isInFocusMode && focusedBedId) {
    return (
      <MobilePlantEditor
        selectedPlacementIds={selectedPlacementIds}
        onClose={handleClosePlantEditor}
        focusedBedId={focusedBedId}
      />
    );
  }

  // Focus mode layout - Minimal controls, maximum canvas space
  if (isInFocusMode) {
    const canUndoAction = canUndoPlants();
    const canRedoAction = canRedoPlants();

    return (
      <>
        {/* Save Status - Top right - only show when timeline is not active */}
        {!showTimeline && (
          <div className="fixed top-20 right-4 z-30">
            <SaveStatus isSaving={isSaving} />
          </div>
        )}

        {/* Minimal Focus Controls - Bottom center */}
        {!showTimeline && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
            <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-3">
              {/* Timeline Toggle */}
              <button
                onClick={() => setShowTimeline(true)}
                className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm hover:bg-green-700 transition-colors"
                title="Linha do Tempo"
              >
                📈
              </button>

              {/* Undo/Redo */}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => plantUndo()}
                  disabled={!canUndoAction}
                  className="w-10 h-10 p-0"
                  title="Desfazer"
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => plantRedo()}
                  disabled={!canRedoAction}
                  className="w-10 h-10 p-0"
                  title="Refazer"
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </div>

              {/* Change Species Button */}
              {selectedSpecies && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenPlantSelection}
                  className="px-3 py-1 text-sm font-medium"
                  title="Trocar Espécie"
                >
                  Trocar
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Timeline Slider */}
        <GrowthTimelineSlider
          isVisible={showTimeline}
          onClose={handleCloseTimeline}
          isMinimal={true}
        />
      </>
    );
  }

  // Bed creation mode - Streamlined mobile-first design
  return (
    <>
      {/* Save Status - Top right */}
      <div className="fixed top-20 right-4 z-30">
        <SaveStatus isSaving={isSaving} />
      </div>

      {/* Minimap - Top left */}
      <div className="fixed top-20 left-4 z-30">
        <MobileMiniMap
          viewport={viewport}
          beds={beds}
          onNavigate={handleNavigateTo}
        />
      </div>

      {/* Debug Drawer - Development only */}
      <MobileDebugDrawer />

      {/* Bottom Toolbar - Primary controls */}
      <MobileBottomToolbar
        activeTool={activeTool}
        onToolChange={onToolChange}
      />

      {/* Floating Zoom Controls */}
      <MobileFloatingZoom
        zoom={viewport.zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFitAll={onFitAll}
        bedsCount={beds.length}
      />

      {/* Bed Configuration Button - Only show when Canteiro tool is selected */}
      {activeTool === 'create-rectangle' && (
        <MobileBedConfigButton
          onOpenConfig={handleOpenBedConfig}
          bedConfig={bedConfig}
        />
      )}

      {/* Context Actions - Only show when needed */}
      {(canUndo || canRedo || selectedCount > 0) && (
        <div className="fixed bottom-20 left-4 z-30">
          <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 p-2 flex gap-2">
            {/* Undo */}
            {canUndo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onUndo}
                className="w-10 h-10 p-0 rounded-full"
                title="Desfazer"
              >
                <Undo className="w-4 h-4" />
              </Button>
            )}
            
            {/* Redo */}
            {canRedo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRedo}
                className="w-10 h-10 p-0 rounded-full"
                title="Refazer"
              >
                <Redo className="w-4 h-4" />
              </Button>
            )}

            {/* Delete Selected */}
            {selectedCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDeleteSelected}
                className="w-10 h-10 p-0 rounded-full hover:bg-red-50 hover:border-red-300"
                title={`Excluir ${selectedCount} canteiro${selectedCount > 1 ? 's' : ''}`}
              >
                <span className="text-lg text-red-600">🗑️</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Bed Configuration Bottom Sheet */}
      <MobileBedConfigSheet
        isOpen={showBedConfig}
        onClose={handleCloseBedConfig}
        tool={activeTool}
        bedConfig={bedConfig}
        onConfigChange={onBedConfigChange}
      />
    </>
  );
};
