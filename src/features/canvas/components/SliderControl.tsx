
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  showInput?: boolean;
  disabled?: boolean;
  formatValue?: (value: number) => string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = '',
  showInput = false,
  disabled = false,
  formatValue
}) => {
  const displayValue = formatValue ? formatValue(value) : `${value.toFixed(step < 1 ? 1 : 0)}${unit}`;

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(min, Math.min(max, parseInt(e.target.value) || min));
    onChange(newValue);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}: {displayValue}
      </label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrement}
          className="h-8 w-8 p-0 touch-manipulation"
          disabled={disabled || value <= min}
        >
          <Minus className="w-3 h-3" />
        </Button>

        {showInput ? (
          <Input
            type="number"
            value={value}
            onChange={handleInputChange}
            className="text-center flex-1"
            min={min}
            max={max}
            disabled={disabled}
          />
        ) : (
          <Slider
            value={[value]}
            onValueChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            className="flex-1"
            disabled={disabled}
          />
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrement}
          className="h-8 w-8 p-0 touch-manipulation"
          disabled={disabled || value >= max}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
