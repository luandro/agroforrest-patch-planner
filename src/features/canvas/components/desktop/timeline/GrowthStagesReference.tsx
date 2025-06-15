
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { GROWTH_STAGES } from '../../../hooks/useGrowthTimeline';

interface GrowthStagesReferenceProps {
  currentMonth: number;
}

const formatTime = (months: number): string => {
  if (months < 12) {
    return `${Math.round(months)} meses`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);
  return remainingMonths > 0 ? `${years} anos ${remainingMonths} meses` : `${years} anos`;
};

export const GrowthStagesReference: React.FC<GrowthStagesReferenceProps> = ({
  currentMonth
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Estágios de Crescimento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {GROWTH_STAGES.map((stage, index) => (
            <div 
              key={stage.months}
              className={cn(
                "flex justify-between items-center p-2 rounded text-sm transition-colors",
                currentMonth >= stage.months 
                  ? "bg-green-100 text-green-800" 
                  : "text-gray-600"
              )}
            >
              <span className="font-medium">{stage.label}</span>
              <span className="text-xs">{formatTime(stage.months)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
