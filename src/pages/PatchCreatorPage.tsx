import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatchCanvas from '../features/canvas/components/PatchCanvas';
import MainLayout from '../components/layout/MainLayout';
import { PlantSelectionPanel } from '../features/canvas/components/PlantSelectionPanel';
import { CanvasViewport } from '../features/canvas/types/canvas.types';
import { PlantSpecies } from '../features/canvas/types/species.types';
import { useBedStore } from '../features/canvas/stores/bedStore';
import { usePlantPlacementStore } from '../features/canvas/stores/plantPlacementStore';
import { usePatchManagement } from '../features/canvas/hooks/usePatchManagement';
import { PatchSwitcherDialog } from '../features/canvas/components/PatchSwitcherDialog';
import { usePatchStore } from '../features/canvas/stores/patchStore';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';

const PatchCreatorPage: React.FC = () => {
  usePatchManagement(); // Initialize and manage all patch-related data loading
  const { patchId } = useParams<{ patchId?: string }>();
  const navigate = useNavigate();

  const [viewport, setViewport] = useState<CanvasViewport | null>(null);
  const [isPlantSelectionOpen, setIsPlantSelectionOpen] = useState(false);
  const [isPatchSwitcherOpen, setIsPatchSwitcherOpen] = useState(false);
  
  const { beds, selectedBedIds, tool, setTool, focusMode } = useBedStore();
  const { activePatchId, setActivePatchId, getPatchById } = usePatchStore();
  const { setSelectedSpecies } = usePlantPlacementStore();

  const activePatch = getPatchById(activePatchId ?? '');
  const plants = usePlantPlacementStore(state => state.placements.filter(p => p.patchId === activePatchId));

  useEffect(() => {
    if (patchId && patchId !== activePatchId) {
      setActivePatchId(patchId);
    }
  }, [patchId, activePatchId, setActivePatchId]);
  
  useEffect(() => {
      if (activePatchId && patchId !== activePatchId) {
          navigate(`/patch-creator/${activePatchId}`, { replace: true });
      }
  }, [activePatchId, patchId, navigate]);


  // Ensure pan tool is default
  useEffect(() => {
    if (tool !== 'pan') setTool('pan');
  }, [tool, setTool]);

  const handleViewportChange = (newViewport: CanvasViewport) => {
    setViewport(newViewport);
  };

  const handleOpenPlantSelection = () => {
    setIsPlantSelectionOpen(true);
  };

  const handleSelectSpecies = (species: PlantSpecies) => {
    setSelectedSpecies(species);
  };

  return (
    <MainLayout 
      showUserMenu={true}
    >
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 h-16">
        <div className="px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-1">
            <h1 className="text-xl font-bold text-gray-900 truncate" title={activePatch?.name}>
              {activePatch?.name || 'Carregando...'}
            </h1>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsPatchSwitcherOpen(true)}>
              <ChevronsUpDown className="h-4 w-4 text-gray-600" />
              <span className="sr-only">Trocar ou gerenciar canteiros</span>
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 hidden md:block">
              Canteiros: {beds.length} | Plantas: {plants.length} | Selecionados: {selectedBedIds.length} | Ferramenta: {tool}
              {focusMode.isActive && ` | Focado: ${focusMode.bedId}`}
            </div>
          )}
        </div>
      </header>

      <main className="relative">
        <PatchCanvas
          onViewportChange={handleViewportChange}
          onOpenPlantSelection={handleOpenPlantSelection}
          gridSize={1}
          minZoom={0.5}
          maxZoom={5}
        />
      </main>

      <PlantSelectionPanel
        isOpen={isPlantSelectionOpen}
        onClose={() => setIsPlantSelectionOpen(false)}
        onSelectSpecies={handleSelectSpecies}
        selectedBedId={focusMode.isActive ? focusMode.bedId : undefined}
      />
      
      <PatchSwitcherDialog 
        isOpen={isPatchSwitcherOpen}
        onOpenChange={setIsPatchSwitcherOpen}
      />

    </MainLayout>
  );
};

export default PatchCreatorPage;
