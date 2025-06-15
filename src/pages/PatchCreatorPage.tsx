
import React from 'react';
import PatchCanvas from '../features/canvas/components/PatchCanvas';
import MainLayout from '../components/layout/MainLayout';
import { PlantSelectionPanel } from '../features/canvas/components/PlantSelectionPanel';
import { GrowthTimelineProvider } from '../features/canvas/providers/GrowthTimelineProvider';
import { usePatchCreatorState } from '../features/patch-creator/hooks/usePatchCreatorState';
import { PatchCreatorHeader } from '../features/patch-creator/components/PatchCreatorHeader';
import { useOfflineStorage } from '../features/canvas/hooks/useOfflineStorage';
import { StorageDebugPanel } from '../features/canvas/components/StorageDebugPanel';

// Import storage test for development
if (process.env.NODE_ENV === 'development') {
  import('../features/canvas/utils/storageTest');
}

const PatchCreatorPage: React.FC = () => {
  // Initialize storage at the page level to ensure it happens early
  const storage = useOfflineStorage();

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
  } = usePatchCreatorState();

  // Debug storage state
  React.useEffect(() => {
    console.log('🔧 PatchCreatorPage storage state:', {
      isInitialized: storage.isInitialized,
      isLoading: storage.isLoading,
      isDirty: storage.isDirty,
      bedsDirty: storage.bedsDirty,
      errors: storage.saveErrors
    });
  }, [storage.isInitialized, storage.isLoading, storage.isDirty, storage.bedsDirty]);

  const handlePatchSwitch = (patchId: string) => {
    // The patch switching is handled automatically by the auto-save hooks
    // when the current patch changes in the store
    console.log('Switching to patch:', patchId);
  };

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
    <GrowthTimelineProvider>
      <MainLayout 
        showUserMenu={true}
        showPatchSelector={true}
        onFitAll={handleFitAll}
        onCreateNewPatch={handleCreateNewPatch}
        onPatchSwitch={handlePatchSwitch}
      >
        <PatchCreatorHeader 
          isMobile={isMobile}
          focusMode={focusMode}
          handleExitFocus={handleExitFocus}
          placements={placements}
          isTimelineActive={isTimelineActive}
          setTimelineActive={setTimelineActive}
          fps={fps}
          beds={beds}
          selectedBedIds={selectedBedIds}
          tool={tool}
        />

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

        {/* Debug Panel - Remove in production */}
        {process.env.NODE_ENV === 'development' && <StorageDebugPanel />}

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
