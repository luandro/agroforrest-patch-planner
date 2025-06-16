import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatchStore } from '../features/canvas/stores/patchStore';
import { useBedStore } from '../features/canvas/stores/bedStore';
import { usePlantPlacementStore } from '../features/canvas/stores/plantPlacementStore';
import { GrowthTimelineProvider } from '../features/canvas/providers/GrowthTimelineProvider';
import { PatchPreviewLayout } from '../features/canvas/components/PatchPreviewLayout';
import { useOfflineStorage } from '../features/canvas/hooks/useOfflineStorage';

const PatchPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patches, setCurrentPatch } = usePatchStore();
  const { beds } = useBedStore();
  const { placements } = usePlantPlacementStore();
  const storage = useOfflineStorage();
  const [isLoading, setIsLoading] = useState(true);

  // Find the patch by ID
  const patch = patches.find(p => p.id === id);

  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
      return;
    }

    // Wait for storage to initialize
    if (!storage.isInitialized) {
      return;
    }

    // Check if patch exists
    if (!patch) {
      console.error('Patch not found:', id);
      navigate('/dashboard');
      return;
    }

    // Set as current patch to load its data
    setCurrentPatch(id);
    setIsLoading(false);
  }, [id, patch, navigate, setCurrentPatch, storage.isInitialized]);

  // Show loading state while storage initializes
  if (storage.isLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando visualização do patch...</p>
        </div>
      </div>
    );
  }

  // Show error if storage failed
  if (storage.initializationError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar dados:</p>
          <p className="text-gray-600 mb-4">{storage.initializationError}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!patch) {
    return null; // This shouldn't happen due to the useEffect check above
  }

  return (
    <GrowthTimelineProvider>
      <PatchPreviewLayout
        patch={patch}
        beds={beds}
        placements={placements}
      />
    </GrowthTimelineProvider>
  );
};

export default PatchPreviewPage;
