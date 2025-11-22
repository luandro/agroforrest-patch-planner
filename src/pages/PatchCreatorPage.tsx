
import React from 'react';
import PatchCanvas from '../features/canvas/components/PatchCanvas';
import { PlantLibrarySidebar } from '../features/canvas/components/PlantLibrarySidebar';
import { ResponsiveLayout } from '../components/layout/ResponsiveLayout';
import { UnifiedToolbar } from '../components/layout/UnifiedToolbar';
import { GrowthTimelineProvider } from '../features/canvas/providers/GrowthTimelineProvider';
import { usePatchCreatorState } from '../features/patch-creator/hooks/usePatchCreatorState';
import { useOfflineStorage } from '../features/canvas/hooks/useOfflineStorage';
import { StorageDebugPanel } from '../features/canvas/components/StorageDebugPanel';
import { PageErrorBoundary } from '@/components/ErrorBoundary';
import { logger } from '@/lib/logger';
import { useMenuStore } from '@/stores/menuStore';
import { UserMenu } from '@/components/UserMenu';
import { usePlantPlacementStore } from '@/features/canvas/stores/plantPlacementStore';
import { useBedStore } from '@/features/canvas/stores/bedStore';

// Import storage test for development
if (import.meta.env.DEV) {
  import('../features/canvas/utils/storageTest');
}

const PatchCreatorPage: React.FC = () => {
  // Initialize storage at the page level to ensure it happens early
  const storage = useOfflineStorage();
  const { toggleMenu } = useMenuStore();
  const { selectedSpecies, isPlacing } = usePlantPlacementStore();

  // Get undo/redo from bed store
  const { setTool: setBedTool, undo, redo, canUndo, canRedo } = useBedStore();

  const {
    viewport,
    fps,
    isPlantSelectionOpen,
    beds,
    selectedBedIds,
    tool,
    focusMode,
    placements,
    isTimelineActive,
    isMobile,
    handleViewportChange,
    handleFitAll,
    handleCreateNewPatch,
    handleOpenPlantSelection,
    handleClosePlantSelection,
    handleSelectSpecies,
    handleExitFocus,
    setTimelineActive,
    handleManualSave,
    isSaving,
  } = usePatchCreatorState();

  // Store refs for canvas zoom controls
  const canvasControlsRef = React.useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
  }>();

  // Calculate stats for toolbar
  const totalArea = beds.reduce((total, bed) => {
    if (bed.shape === 'rectangle') {
      return total + ((bed.dimensions.length || 0) * (bed.dimensions.width || 0));
    } else {
      const radius = bed.dimensions.radius || 0;
      return total + (Math.PI * radius * radius);
    }
  }, 0);

  const totalPlants = placements.length;

  // Debug storage state
  React.useEffect(() => {
    logger.debug('PatchCreatorPage storage state', {
      isInitialized: storage.isInitialized,
      isLoading: storage.isLoading,
      isDirty: storage.isDirty,
      bedsDirty: storage.bedsDirty,
      errors: storage.saveErrors
    });
  }, [storage.isInitialized, storage.isLoading, storage.isDirty, storage.bedsDirty, storage.saveErrors]);

  // Show loading state while storage is initializing
  if (storage.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando armazenamento...</p>
        </div>
      </div>
    );
  }

  // Show error state if storage initialization failed
  if (storage.initializationError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao inicializar armazenamento:</p>
          <p className="text-gray-600 mb-4">{storage.initializationError}</p>
          <button
            onClick={() => storage.reinitialize()}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageErrorBoundary>
      <GrowthTimelineProvider>
        <ResponsiveLayout
          showSidebar={true}
          sidebarCollapsible={true}
          sidebar={
            <PlantLibrarySidebar
              onSelectSpecies={handleSelectSpecies}
              selectedBedId={focusMode.isActive ? focusMode.bedId : undefined}
              selectedSpecies={selectedSpecies}
              isPlacing={isPlacing}
            />
          }
          toolbar={
            <UnifiedToolbar
              appName="Croqui SAF"
              onMenuClick={toggleMenu}
              totalArea={totalArea}
              totalPlants={totalPlants}
              terrainSize={50}
              gridEnabled={true}
              onToggleGrid={() => {/* TODO: implement grid toggle */}}
              onExport={() => {/* TODO: implement export */}}
              onSave={handleManualSave}
              onLoad={() => {/* TODO: implement load */}}
              onClear={() => {/* TODO: implement clear */}}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo()}
              canRedo={canRedo()}
              onZoomIn={() => canvasControlsRef.current?.zoomIn()}
              onZoomOut={() => canvasControlsRef.current?.zoomOut()}
              onFitAll={handleFitAll}
              zoom={viewport?.zoom || 1}
              isSaving={isSaving}
            />
          }
        >
          {/* Full-Screen Canvas */}
          <div className="w-full h-full relative">
            <PatchCanvas
              onViewportChange={handleViewportChange}
              onOpenPlantSelection={handleOpenPlantSelection}
              gridSize={1}
              minZoom={0.5}
              maxZoom={5}
            />
          </div>

          {/* Debug Panel - Remove in production */}
          {import.meta.env.DEV && <StorageDebugPanel />}

          {/* Hidden stats for development */}
          {import.meta.env.DEV && viewport && (
            <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded font-mono z-50">
              <div>Área Total: {totalArea.toFixed(1)}m²</div>
              <div>Área Visível: {(viewport.width * viewport.height).toFixed(0)}m²</div>
              <div>FPS: {fps}</div>
            </div>
          )}
        </ResponsiveLayout>

        {/* User Menu */}
        <UserMenu
          onFitAll={handleFitAll}
          onCreateNewPatch={handleCreateNewPatch}
        />
      </GrowthTimelineProvider>
    </PageErrorBoundary>
  );
};

export default PatchCreatorPage;
