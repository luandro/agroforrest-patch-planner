
import { PlantPlacement } from '../../stores/plantPlacementStore';

export const getPlantAtPosition = (
  placements: PlantPlacement[],
  bedRelativePos: { x: number; y: number },
  tolerance: number = 0.1
): PlantPlacement | null => {
  return placements.find(placement => 
    Math.abs(placement.position.x - bedRelativePos.x) < tolerance &&
    Math.abs(placement.position.y - bedRelativePos.y) < tolerance
  ) || null;
};

export const calculatePlantScreenPosition = (
  bedScreenX: number,
  bedScreenY: number,
  plantPosition: { x: number; y: number },
  pixelsPerMeter: number
) => {
  return {
    x: bedScreenX + (plantPosition.x * pixelsPerMeter),
    y: bedScreenY - (plantPosition.y * pixelsPerMeter)
  };
};
