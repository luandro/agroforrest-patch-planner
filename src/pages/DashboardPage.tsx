
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sprout } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { usePatchStore } from '../features/canvas/stores/patchStore';
import { useAutoSavePatches } from '../features/canvas/hooks/useAutoSavePatches';

const DashboardPage: React.FC = () => {
  useAutoSavePatches(); // Load patches from DB
  const navigate = useNavigate();
  const { patches, setActivePatchId, addPatch, isLoaded } = usePatchStore();

  const handleSelectPatch = (patchId: string) => {
    setActivePatchId(patchId);
    navigate(`/patch-creator/${patchId}`);
  };

  const handleCreatePatch = () => {
    const newPatchId = addPatch({ name: `Novo Canteiro ${patches.length + 1}` });
    setActivePatchId(newPatchId);
    navigate(`/patch-creator/${newPatchId}`);
  };

  // Ensure there's at least one patch
  useEffect(() => {
    if (isLoaded && patches.length === 0) {
        handleCreatePatch();
    }
  }, [isLoaded, patches]);


  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Meus Canteiros</h1>
            <p className="mt-2 text-gray-600">
              Gerencie e crie seus sistemas agroflorestais
            </p>
          </div>
          <div className="flex justify-center sm:justify-start">
            <button
              onClick={handleCreatePatch}
              className="flex items-center space-x-3 bg-gray-900 text-white px-6 py-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium text-lg min-h-[44px]"
            >
              <Plus size={24} />
              <span>Criar Novo Canteiro</span>
            </button>
          </div>
        </div>

        {isLoaded && patches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {patches.map(patch => (
              <div 
                key={patch.id}
                onClick={() => handleSelectPatch(patch.id)}
                className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-green-500 transition-all group"
              >
                <div className="flex items-start gap-4">
                    <div className="bg-green-100 rounded-full p-3 group-hover:bg-green-200 transition-colors">
                        <Sprout className="h-6 w-6 text-green-700" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-800 transition-colors">{patch.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Criado em: {new Date(patch.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 mt-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                {isLoaded ? <Sprout size={32} className="text-gray-400" /> : '...'}
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {isLoaded ? 'Nenhum canteiro ainda' : 'Carregando canteiros...'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {isLoaded ? 'Comece criando seu primeiro canteiro agroflorestal.' : 'Buscando seus dados salvos no dispositivo.'}
              </p>
              {isLoaded && (
                <button
                  onClick={handleCreatePatch}
                  className="inline-flex items-center space-x-2 text-gray-900 hover:text-gray-700 font-medium"
                >
                  <Plus size={18} />
                  <span>Criar primeiro canteiro</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
