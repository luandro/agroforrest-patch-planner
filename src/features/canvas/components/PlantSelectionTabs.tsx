
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MousePointer, Grid3X3 } from 'lucide-react';

interface PlantSelectionTabsProps {
  activeTab: 'individual' | 'bulk';
  onTabChange: (tab: 'individual' | 'bulk') => void;
}

export const PlantSelectionTabs: React.FC<PlantSelectionTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="px-4 pb-3">
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'individual' | 'bulk')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2 text-xs">
            <MousePointer className="w-3 h-3" />
            Individual
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2 text-xs">
            <Grid3X3 className="w-3 h-3" />
            Em Massa
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
