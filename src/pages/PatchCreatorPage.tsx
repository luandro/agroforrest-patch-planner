
import React from 'react';
import PatchCanvas from '../features/canvas/components/PatchCanvas';
import MainLayout from '../components/layout/MainLayout';
import { PlantSelectionPanel } from '../features/canvas/components/PlantSelectionPanel';
import { GrowthTimelineProvider } from '../features/canvas/providers/GrowthTimelineProvider';
import { usePatchCreatorState } from '../features/patch-creator/hooks/usePatchCreatorState';
import { PatchCreatorHeader } from '../features/patch-creator/components/PatchCreatorHeader';

const PatchCreatorPage: React.FC = () => {
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

  const handlePatchSwitch = (patchId: string) => {
    // The patch switching is handled automatically by the auto-save hooks
    // when the current patch changes in the store
    console.log('Switching to patch:', patchId);
  };

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
