
import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const PatchCreatorPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Criador de Canteiro</h1>
          <p className="mt-2 text-gray-600">
            Desenhe e planeje seu sistema agroflorestal
          </p>
        </div>

        {/* Canvas Placeholder */}
        <div className="bg-white rounded-lg border border-gray-200 min-h-[500px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900">
              Canvas virá aqui
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Em breve você poderá desenhar e planejar seu canteiro agroflorestal neste espaço.
            </p>
          </div>
        </div>

        {/* Placeholder Tools */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Ferramentas</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Árvores', 'Arbustos', 'Cultivos', 'Ferramentas'].map((tool) => (
              <div 
                key={tool}
                className="bg-white rounded-lg p-4 text-center border border-gray-200 cursor-not-allowed opacity-50"
              >
                <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
                <span className="text-sm text-gray-600">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatchCreatorPage;
