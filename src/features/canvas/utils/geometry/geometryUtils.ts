
import { Bed } from '../../types/bed.types';

export const calculateBedArea = (bed: Bed): number => {
  if (bed.shape === 'rectangle') {
    return (bed.dimensions.length || 0) * (bed.dimensions.width || 0);
  } else {
    const radius = bed.dimensions.radius || 0;
    return Math.PI * radius * radius;
  }
};

export const getBedDimensions = (bed: Bed) => {
  if (bed.shape === 'rectangle') {
    return {
      length: bed.dimensions.length || 0,
      width: bed.dimensions.width || 0,
      radius: 0
    };
  } else {
    return {
      length: 0,
      width: 0,
      radius: bed.dimensions.radius || 0
    };
  }
};

export const calculateUsableArea = (
  bedLength: number,
  bedWidth: number,
  marginFromEdge: number
) => {
  const usableLength = bedLength - (marginFromEdge * 2);
  const usableWidth = bedWidth - (marginFromEdge * 2);
  
  return {
    usableLength: Math.max(0, usableLength),
    usableWidth: Math.max(0, usableWidth)
  };
};

export const calculateGridDimensions = (
  usableLength: number,
  usableWidth: number,
  spacing: number
) => {
  const plantsPerLength = Math.floor(usableLength / spacing) + 1;
  const plantsPerWidth = Math.floor(usableWidth / spacing) + 1;
  
  const actualSpacingLength = plantsPerLength > 1 ? usableLength / (plantsPerLength - 1) : 0;
  const actualSpacingWidth = plantsPerWidth > 1 ? usableWidth / (plantsPerWidth - 1) : 0;
  
  return {
    plantsPerLength,
    plantsPerWidth,
    actualSpacingLength,
    actualSpacingWidth
  };
};

export const roundToDecimalPlaces = (value: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};
