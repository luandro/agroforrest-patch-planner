
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlantingTemplate } from '../types/template.types';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: PlantingTemplate;
  onSelect: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  compact?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  isSelected = false,
  disabled = false,
  compact = false
}) => {
  const getCategoryIcon = (category: PlantingTemplate['category']) => {
    switch (category) {
      case 'pre-defined': return '🌟';
      case 'user-created': return '👤';
      case 'community': return '🌍';
      default: return '📋';
    }
  };

  const getDifficultyColor = (difficulty: PlantingTemplate['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'; 
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: PlantingTemplate['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return 'N/A';
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 touch-manipulation",
        compact ? "min-h-[100px]" : "min-h-[120px]",
        "border border-blue-200 bg-blue-50/30 hover:bg-blue-50",
        isSelected && "ring-2 ring-blue-500 bg-blue-100 border-blue-400",
        disabled && "opacity-50 cursor-not-allowed bg-gray-50",
        !disabled && !isSelected && "hover:border-blue-400 hover:shadow-sm"
      )}
      onClick={onSelect}
    >
      <CardContent className={cn("p-3", !compact && "md:p-4")}>
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0" title={template.category}>
              {getCategoryIcon(template.category)}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className={cn(
                "font-medium text-gray-900 leading-tight",
                compact ? "text-sm" : "text-sm md:text-base"
              )}>
                {template.name}
              </h3>
              <p className={cn(
                "text-gray-600 leading-tight mt-0.5",
                compact ? "text-xs line-clamp-2" : "text-xs md:text-sm line-clamp-2"
              )}>
                {template.description}
              </p>
            </div>
          </div>

          {/* Info Row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-gray-500">
              <span>🌱 {template.plants.length}</span>
              <span>•</span>
              <span>{template.bedSize.width}×{template.bedSize.length}m</span>
            </div>
            
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs px-1.5 py-0.5",
                getDifficultyColor(template.difficulty)
              )}
            >
              {getDifficultyText(template.difficulty)}
            </Badge>
          </div>

          {/* Benefits */}
          {!compact && template.benefits.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {template.benefits.slice(0, 2).map((benefit, index) => (
                <span 
                  key={index}
                  className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded"
                >
                  {benefit}
                </span>
              ))}
              {template.benefits.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{template.benefits.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
