
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreatePatch = () => {
    navigate('/patch-creator');
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Meus Canteiros</h1>
          <p className="mt-2 text-gray-600">
            Gerencie e crie seus sistemas agroflorestais
          </p>
        </div>

        {/* Create New Patch Button */}
        <div className="flex justify-center md:justify-start">
          <button
            onClick={handleCreatePatch}
            className="flex items-center space-x-3 bg-gray-900 text-white px-6 py-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium text-lg min-h-[44px]"
          >
            <Plus size={24} />
            <span>Criar Novo Canteiro</span>
          </button>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Nenhum canteiro ainda
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Comece criando seu primeiro canteiro agroflorestal. Use nossa ferramenta para planejar e visualizar seu sistema.
            </p>
            <button
              onClick={handleCreatePatch}
              className="inline-flex items-center space-x-2 text-gray-900 hover:text-gray-700 font-medium"
            >
              <Plus size={18} />
              <span>Criar primeiro canteiro</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
