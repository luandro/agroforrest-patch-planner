
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3,
  Leaf
} from 'lucide-react';

interface PlantStatisticsProps {
  relevantPlacements: Array<{
    species: {
      id: string;
      commonName: string;
    };
  }>;
}

export const PlantStatistics: React.FC<PlantStatisticsProps> = ({
  relevantPlacements
}) => {
  const totalPlants = relevantPlacements.length;
  const speciesCount = new Set(relevantPlacements.map(p => p.species.id)).size;
  const speciesSummary = relevantPlacements.reduce((acc, placement) => {
    const name = placement.species.commonName;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Estatísticas das Plantas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{totalPlants}</div>
            <div className="text-sm text-blue-600">Total de Plantas</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{speciesCount}</div>
            <div className="text-sm text-green-600">Espécies Diferentes</div>
          </div>
        </div>

        <Separator />

        {/* Species Breakdown */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Distribuição por Espécie
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {Object.entries(speciesSummary).map(([species, count]) => (
              <div key={species} className="flex justify-between items-center text-sm">
                <span className="text-gray-700 truncate">{species}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
