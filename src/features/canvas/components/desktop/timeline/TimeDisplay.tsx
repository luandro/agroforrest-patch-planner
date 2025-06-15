
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimeDisplayProps {
  currentMonth: number;
  currentStage: {
    label: string;
    description: string;
  };
}

const formatTime = (months: number): string => {
  if (months < 12) {
    return `${Math.round(months)} meses`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);
  return remainingMonths > 0 ? `${years} anos ${remainingMonths} meses` : `${years} anos`;
};

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  currentMonth,
  currentStage
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-green-700">
            {formatTime(currentMonth)}
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {currentStage.label}
          </Badge>
          <div className="text-sm text-gray-600">
            {currentStage.description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
