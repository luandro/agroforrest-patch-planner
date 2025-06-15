
import React from 'react';
import { BulkPlacementPanel } from './BulkPlacementPanel';
import { useBulkPlacement } from '../hooks/useBulkPlacement';
import { useBedStore } from '../stores/bedStore';
import { AlertCircle, Target } from 'lucide-react';

type BulkPlacementHookReturn = ReturnType<typeof useBulkPlacement>;

interface PlantSelectionBulkModeProps {
  bulkPlacementProps: BulkPlacementHookReturn;
}

export const PlantSelectionBulkMode: React.FC<PlantSelectionBulkModeProps> = ({
  bulkPlacementProps,
}) => {
  const { focusMode } = useBedStore();

  if (!focusMode.isActive) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Selecione um Canteiro
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Para usar o plantio em massa, primeiro você precisa:
            </p>
            <div className="text-left space-y-2 max-w-sm mx-auto">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">1</span>
                <span>Criar ou selecionar um canteiro no canvas</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</span>
                <span>Clicar duas vezes no canteiro para entrar no modo de plantio</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</span>
                <span>Voltar aqui para fazer o plantio em massa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bulkPlacementProps.isActive) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Pronto para Plantio em Massa!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Canteiro selecionado. Agora escolha uma espécie no modo "Individual" e clique no botão de grade para começar o plantio em massa.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="px-4 h-full overflow-y-auto">
        <BulkPlacementPanel {...bulkPlacementProps} />
      </div>
    </div>
  );
};
