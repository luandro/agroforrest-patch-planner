
import { Bed } from '../../types/bed.types';
import { BulkPlacementConfig, PlacementPosition } from '../../types/bulkPlacement.types';
import { 
  getBedDimensions, 
  calculateUsableArea, 
  calculateGridDimensions,
  roundToDecimalPlaces 
} from '../geometry/geometryUtils';

export const calculateGridPositions = (
  bed: Bed,
  config: BulkPlacementConfig
): PlacementPosition[] => {
  const positions: PlacementPosition[] = [];
  
  if (bed.shape !== 'rectangle') {
    return calculateCircularPositions(bed, config);
  }

  const { length: bedLength, width: bedWidth } = getBedDimensions(bed);
  const { spacing, marginFromEdge } = config;

  const { usableLength, usableWidth } = calculateUsableArea(bedLength, bedWidth, marginFromEdge);

  if (usableLength <= 0 || usableWidth <= 0) {
    return positions; // Bed too small
  }

  const {
    plantsPerLength,
    plantsPerWidth,
    actualSpacingLength,
    actualSpacingWidth
  } = calculateGridDimensions(usableLength, usableWidth, spacing);

  // Generate positions relative to bed center. When only one plant fits in a
  // row/column we want it to be centered instead of stuck to one edge, so the
  // span is based on the actual spacing instead of the full usable length.
  const lengthSpan = actualSpacingLength * (plantsPerLength - 1);
  const widthSpan = actualSpacingWidth * (plantsPerWidth - 1);
  const startX = -(lengthSpan / 2);
  const startY = -(widthSpan / 2);

  for (let row = 0; row < plantsPerWidth; row++) {
    for (let col = 0; col < plantsPerLength; col++) {
      const x = startX + (col * actualSpacingLength);
      const y = startY + (row * actualSpacingWidth);
      
      positions.push({
        x: roundToDecimalPlaces(x),
        y: roundToDecimalPlaces(y),
        row,
        column: col
      });
    }
  }

  return positions;
};

export const calculateStaggeredPositions = (
  bed: Bed,
  config: BulkPlacementConfig
): PlacementPosition[] => {
  const gridPositions = calculateGridPositions(bed, config);
  
  // Offset alternate rows by half spacing
  return gridPositions.map(pos => ({
    ...pos,
    x: pos.x + (pos.row % 2 === 1 ? config.spacing / 2 : 0)
  })).filter(pos => {
    // Remove positions that fall outside bed bounds after staggering
    if (bed.shape === 'rectangle') {
      const { length: bedLength } = getBedDimensions(bed);
      const halfLength = bedLength / 2;
      return Math.abs(pos.x) <= halfLength - config.marginFromEdge;
    }
    return true;
  });
};

export const calculateRowPositions = (
  bed: Bed,
  config: BulkPlacementConfig
): PlacementPosition[] => {
  const positions: PlacementPosition[] = [];
  
  if (bed.shape !== 'rectangle') {
    return calculateCircularPositions(bed, config);
  }

  const { length: bedLength, width: bedWidth } = getBedDimensions(bed);
  const { spacing, marginFromEdge, maxRows = 3 } = config;

  const { usableLength, usableWidth } = calculateUsableArea(bedLength, bedWidth, marginFromEdge);

  if (usableLength <= 0 || usableWidth <= 0) {
    return positions;
  }

  // Calculate number of rows that fit
  const maxRowsForWidth = Math.floor(usableWidth / spacing) + 1;
  const numRows = Math.min(maxRows, maxRowsForWidth);
  
  // Calculate plants per row
  const plantsPerRow = Math.floor(usableLength / spacing) + 1;
  
  if (plantsPerRow <= 0 || numRows <= 0) {
    return positions;
  }

  // Calculate actual spacing
  const actualSpacingLength = plantsPerRow > 1 ? usableLength / (plantsPerRow - 1) : 0;
  const rowSpacing = numRows > 1 ? usableWidth / (numRows - 1) : 0;

  const lengthSpan = actualSpacingLength * (plantsPerRow - 1);
  const widthSpan = rowSpacing * (numRows - 1);
  const startX = -(lengthSpan / 2);
  const startY = -(widthSpan / 2);

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < plantsPerRow; col++) {
      const x = startX + (col * actualSpacingLength);
      const y = startY + (row * rowSpacing);
      
      positions.push({
        x: roundToDecimalPlaces(x),
        y: roundToDecimalPlaces(y),
        row,
        column: col
      });
    }
  }

  return positions;
};

export const calculateCircularPositions = (
  bed: Bed,
  config: BulkPlacementConfig
): PlacementPosition[] => {
  const positions: PlacementPosition[] = [];
  const { radius } = getBedDimensions(bed);
  const { spacing, marginFromEdge } = config;
  
  const usableRadius = radius - marginFromEdge;
  if (usableRadius <= 0) return positions;

  // Use a simple spiral pattern for circular beds
  let currentRadius = 0;
  let layer = 0;

  while (currentRadius <= usableRadius) {
    if (layer === 0) {
      // Center plant
      positions.push({
        x: 0,
        y: 0,
        row: 0,
        column: 0
      });
    } else {
      // Calculate plants in this ring
      const circumference = 2 * Math.PI * currentRadius;
      const plantsInRing = Math.floor(circumference / spacing);
      
      for (let i = 0; i < plantsInRing; i++) {
        const angle = (2 * Math.PI * i) / plantsInRing;
        const x = currentRadius * Math.cos(angle);
        const y = currentRadius * Math.sin(angle);
        
        positions.push({
          x: roundToDecimalPlaces(x),
          y: roundToDecimalPlaces(y),
          row: layer,
          column: i
        });
      }
    }
    
    layer++;
    currentRadius = layer * spacing;
  }

  return positions;
};
