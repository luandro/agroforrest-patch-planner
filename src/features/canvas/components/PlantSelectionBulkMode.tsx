
import React from 'react';
import { BulkPlacementPanel } from './BulkPlacementPanel';
import { useBulkPlacement } from '../hooks/useBulkPlacement';
import { useBedStore } from '../stores/bedStore';
import { AlertCircle, Target, Grid3X3, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type BulkPlacementHookReturn = ReturnType<typeof useBulkPlacement>;

interface PlantSelectionBulkModeProps {
  bulkPlacementProps: BulkPlacementHookReturn;
}

export const PlantSelectionBulkMode: React.FC<PlantSelectionBulkModeProps> = ({
  bulkPlacementProps,
}) => {
  const { focusMode } = useBedStore();

  // Step 1: No bed focused
  if (!focusMode.isActive) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Como usar o Plantio em Massa
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Para plantar várias espécies de uma vez, siga estes passos:
                </p>
                <div className="text-left space-y-3 max-w-sm mx-auto">
                  <div className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span><strong>Crie um canteiro</strong> no canvas usando as ferramentas de criação</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span><strong>Clique duas vezes</strong> no canteiro para entrar no modo de plantio</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span><strong>Volte aqui</strong> e clique no botão de grade <Grid3X3 className="w-3 h-3 inline mx-1" /> ao lado de uma espécie</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Bed focused but no bulk placement active
  if (!bulkPlacementProps.isActive) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Grid3X3 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Canteiro Selecionado!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Agora você pode usar o plantio em massa. Vá para a aba "Individual" e clique no botão de grade <Grid3X3 className="w-3 h-3 inline mx-1" /> ao lado da espécie que deseja plantar.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-green-700 bg-green-100 rounded-lg p-3">
                  <MousePointer className="w-4 h-4" />
                  <span>Procure o botão <Grid3X3 className="w-3 h-3 inline mx-1" /> verde nos cartões das espécies</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: Active bulk placement
  return (
    <div className="flex-1 overflow-hidden">
      <div className="px-4 h-full overflow-y-auto">
        <BulkPlacementPanel {...bulkPlacementProps} />
      </div>
    </div>
  );
};
