
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PlantingTemplate, TemplatePreview } from '../types/template.types';
import { predefinedTemplates } from '../data/plantingTemplates';
import { TemplateCard } from './TemplateCard';
import { TemplatePreviewDialog } from './TemplatePreviewDialog';
import { generateTemplatePreview } from '../utils/templateUtils';
import { useBedStore } from '../stores/bedStore';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PlantingTemplatesSectionProps {
  onApplyTemplate: (template: PlantingTemplate) => void;
  compact?: boolean;
}

export const PlantingTemplatesSection: React.FC<PlantingTemplatesSectionProps> = ({
  onApplyTemplate,
  compact = false
}) => {
  const { focusMode, beds } = useBedStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PlantingTemplate | null>(null);
  const [preview, setPreview] = useState<TemplatePreview | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  // Get the focused bed
  const focusedBed = focusMode.isActive ? beds.find(bed => bed.id === focusMode.bedId) : null;

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return predefinedTemplates.filter(template => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    });
  }, [searchTerm]);

  // Show templates prominently if in focus mode
  const showTemplates = focusedBed || !compact;

  if (!showTemplates) {
    return null;
  }

  const handleTemplateSelect = (template: PlantingTemplate) => {
    if (!focusedBed) {
      alert('Por favor, entre no modo foco de um canteiro primeiro');
      return;
    }

    setSelectedTemplate(template);
    const templatePreview = generateTemplatePreview(template, focusedBed);
    setPreview(templatePreview);
    setShowPreviewDialog(true);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate && preview) {
      onApplyTemplate(selectedTemplate);
      setShowPreviewDialog(false);
      setSelectedTemplate(null);
      setPreview(null);
    }
  };

  const handleClosePreview = () => {
    setShowPreviewDialog(false);
    setSelectedTemplate(null);
    setPreview(null);
  };

  const visibleTemplates = isExpanded ? filteredTemplates : filteredTemplates.slice(0, 3);

  return (
    <>
      <div className={cn("space-y-3", compact && "space-y-2")}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h3 className={cn(
              "font-semibold text-gray-900",
              compact ? "text-sm" : "text-base"
            )}>
              Modelos Prontos
            </h3>
          </div>
          {filteredTemplates.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          )}
        </div>

        {/* Description */}
        {!compact && (
          <p className="text-xs text-gray-600">
            Combinações de plantas criadas por especialistas para máxima sinergia
          </p>
        )}

        {/* Search */}
        {filteredTemplates.length > 3 && (
          <Input
            placeholder="Buscar modelos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm"
          />
        )}

        {/* Templates List */}
        <div className={cn("space-y-2", compact && "space-y-1")}>
          {visibleTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => handleTemplateSelect(template)}
              compact={compact}
            />
          ))}
        </div>

        {/* Show More */}
        {!isExpanded && filteredTemplates.length > 3 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="w-full text-xs"
          >
            Ver Todos os {filteredTemplates.length} Modelos
          </Button>
        )}

        {/* No Results */}
        {filteredTemplates.length === 0 && searchTerm && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              Nenhum modelo encontrado para "{searchTerm}"
            </p>
          </div>
        )}

        {/* Focus Mode Required */}
        {!focusedBed && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-sm text-blue-700">
              Entre no modo foco de um canteiro para aplicar modelos
            </p>
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <TemplatePreviewDialog
        isOpen={showPreviewDialog}
        onClose={handleClosePreview}
        onConfirm={handleApplyTemplate}
        preview={preview}
      />
    </>
  );
};
