
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlantEditForm } from '../hooks/usePlantEditForm';

interface PlantEditFormFieldsProps {
  editForm: PlantEditForm;
  onFormChange: <K extends keyof PlantEditForm>(field: K, value: PlantEditForm[K]) => void;
}

export const PlantEditFormFields: React.FC<PlantEditFormFieldsProps> = ({
  editForm,
  onFormChange
}) => {
  return (
    <div className="space-y-4">
      {/* Maturity */}
      <div className="space-y-2">
        <Label htmlFor="maturity" className="text-sm font-medium">Maturidade</Label>
        <Select
          value={editForm.maturity}
          onValueChange={(value: PlantEditForm['maturity']) => onFormChange('maturity', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seed">Semente</SelectItem>
            <SelectItem value="seedling">Muda</SelectItem>
            <SelectItem value="young">Jovem</SelectItem>
            <SelectItem value="adult">Adulta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Spacing */}
      <div className="space-y-2">
        <Label htmlFor="spacing" className="text-sm font-medium">Espaçamento (m)</Label>
        <Input
          id="spacing"
          type="number"
          step="0.1"
          min="0.1"
          max="10"
          value={editForm.spacing}
          onChange={(e) => onFormChange('spacing', parseFloat(e.target.value) || 0)}
          className="text-sm"
        />
      </div>

      {/* Variety */}
      <div className="space-y-2">
        <Label htmlFor="variety" className="text-sm font-medium">Variedade</Label>
        <Select
          value={editForm.variety}
          onValueChange={(value: PlantEditForm['variety']) => onFormChange('variety', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Padrão">Padrão</SelectItem>
            <SelectItem value="Híbrida">Híbrida</SelectItem>
            <SelectItem value="Nativa">Nativa</SelectItem>
            <SelectItem value="Melhorada">Melhorada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Planting Date */}
      <div className="space-y-2">
        <Label htmlFor="plantingDate" className="text-sm font-medium">Data de Plantio</Label>
        <Input
          id="plantingDate"
          type="date"
          value={editForm.plantingDate}
          onChange={(e) => onFormChange('plantingDate', e.target.value)}
          className="text-sm"
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">Observações</Label>
        <Textarea
          id="notes"
          value={editForm.notes}
          onChange={(e) => onFormChange('notes', e.target.value)}
          placeholder="Adicione observações sobre estas plantas..."
          className="text-sm resize-none"
          rows={3}
        />
      </div>
    </div>
  );
};
