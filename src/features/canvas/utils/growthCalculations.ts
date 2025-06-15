
import { GrowthDataPoint, SpeciesGrowthProfile, GrowthCurveFunction } from '../types/growth.types';

// Interpolação linear entre dois pontos
const linearInterpolate = (
  point1: GrowthDataPoint,
  point2: GrowthDataPoint,
  targetMonth: number
) => {
  const ratio = (targetMonth - point1.months) / (point2.months - point1.months);
  
  return {
    canopyRadius: point1.canopyRadius + (point2.canopyRadius - point1.canopyRadius) * ratio,
    height: point1.height + (point2.height - point1.height) * ratio,
    lightPenetration: point1.lightPenetration + (point2.lightPenetration - point1.lightPenetration) * ratio
  };
};

// Curva de crescimento sigmóide (S-curve) para crescimento mais realista
const sigmoidGrowth = (
  startValue: number,
  endValue: number,
  progress: number,
  steepness: number = 6
) => {
  const sigmoid = 1 / (1 + Math.exp(-steepness * (progress - 0.5)));
  return startValue + (endValue - startValue) * sigmoid;
};

// Curva exponencial
const exponentialGrowth = (
  startValue: number,
  endValue: number,
  progress: number,
  rate: number = 2
) => {
  const exponential = (Math.pow(rate, progress) - 1) / (rate - 1);
  return startValue + (endValue - startValue) * exponential;
};

// Função principal de cálculo de crescimento
export const calculateGrowthAtMonth: GrowthCurveFunction = (
  dataPoints,
  targetMonth,
  curveType
) => {
  // Ordenar pontos por mês
  const sortedPoints = [...dataPoints].sort((a, b) => a.months - b.months);
  
  // Se o mês alvo é antes do primeiro ponto, retorna o primeiro ponto
  if (targetMonth <= sortedPoints[0].months) {
    return {
      canopyRadius: sortedPoints[0].canopyRadius,
      height: sortedPoints[0].height,
      lightPenetration: sortedPoints[0].lightPenetration
    };
  }
  
  // Se o mês alvo é depois do último ponto, retorna o último ponto
  const lastPoint = sortedPoints[sortedPoints.length - 1];
  if (targetMonth >= lastPoint.months) {
    return {
      canopyRadius: lastPoint.canopyRadius,
      height: lastPoint.height,
      lightPenetration: lastPoint.lightPenetration
    };
  }
  
  // Encontrar os dois pontos adjacentes
  let beforePoint = sortedPoints[0];
  let afterPoint = sortedPoints[1];
  
  for (let i = 0; i < sortedPoints.length - 1; i++) {
    if (targetMonth >= sortedPoints[i].months && targetMonth <= sortedPoints[i + 1].months) {
      beforePoint = sortedPoints[i];
      afterPoint = sortedPoints[i + 1];
      break;
    }
  }
  
  const totalDuration = afterPoint.months - beforePoint.months;
  const progress = (targetMonth - beforePoint.months) / totalDuration;
  
  // Aplicar diferentes curvas de crescimento
  switch (curveType) {
    case 'sigmoid':
      return {
        canopyRadius: sigmoidGrowth(beforePoint.canopyRadius, afterPoint.canopyRadius, progress),
        height: sigmoidGrowth(beforePoint.height, afterPoint.height, progress),
        lightPenetration: sigmoidGrowth(beforePoint.lightPenetration, afterPoint.lightPenetration, progress)
      };
      
    case 'exponential':
      return {
        canopyRadius: exponentialGrowth(beforePoint.canopyRadius, afterPoint.canopyRadius, progress),
        height: exponentialGrowth(beforePoint.height, afterPoint.height, progress),
        lightPenetration: exponentialGrowth(beforePoint.lightPenetration, afterPoint.lightPenetration, progress)
      };
      
    case 'linear':
    default:
      return linearInterpolate(beforePoint, afterPoint, targetMonth);
  }
};

// Calcular stress ambiental baseado em competição e fatores ambientais
export const calculateEnvironmentalStress = (
  plantPosition: { x: number; y: number },
  nearbyPlants: Array<{
    position: { x: number; y: number };
    canopyRadius: number;
    height: number;
  }>,
  soilQuality: number = 1.0,
  waterAvailability: number = 1.0
): number => {
  let competitionStress = 0;
  
  // Calcular stress por competição com plantas próximas
  nearbyPlants.forEach(nearby => {
    const distance = Math.sqrt(
      Math.pow(plantPosition.x - nearby.position.x, 2) +
      Math.pow(plantPosition.y - nearby.position.y, 2)
    );
    
    // Se as copas se sobrepõem, há competição
    const overlapDistance = nearby.canopyRadius - distance;
    if (overlapDistance > 0) {
      const overlapRatio = overlapDistance / nearby.canopyRadius;
      competitionStress += overlapRatio * 0.3; // 30% stress máximo por planta
    }
  });
  
  // Fatores ambientais (valores baixos = stress alto)
  const environmentalStress = Math.max(0, (2 - soilQuality - waterAvailability) * 0.2);
  
  // Stress total (0 = sem stress, 1 = stress máximo)
  return Math.min(1, competitionStress + environmentalStress);
};

// Aplicar stress no crescimento
export const applyEnvironmentalStress = (
  baseGrowth: { canopyRadius: number; height: number; lightPenetration: number },
  stress: number,
  competitionResistance: number
): { canopyRadius: number; height: number; lightPenetration: number } => {
  const actualStress = stress * (1 - competitionResistance);
  const growthReduction = 1 - (actualStress * 0.5); // Até 50% de redução no crescimento
  
  return {
    canopyRadius: baseGrowth.canopyRadius * growthReduction,
    height: baseGrowth.height * growthReduction,
    lightPenetration: baseGrowth.lightPenetration + (actualStress * 10) // Stress aumenta penetração de luz
  };
};

// Calcular crescimento final com todos os fatores
export const calculateRealisticGrowth = (
  profile: SpeciesGrowthProfile,
  targetMonth: number,
  plantPosition: { x: number; y: number },
  nearbyPlants: Array<{
    position: { x: number; y: number };
    canopyRadius: number;
    height: number;
  }>,
  soilQuality: number = 1.0,
  waterAvailability: number = 1.0
) => {
  // Calcular crescimento base
  const baseGrowth = calculateGrowthAtMonth(
    profile.dataPoints,
    targetMonth,
    profile.growthCurveType
  );
  
  // Aplicar fatores ambientais
  const environmentalMultiplier = {
    canopyRadius: profile.environmentalFactors.soilQualityEffect * soilQuality +
                 profile.environmentalFactors.waterAvailabilityEffect * waterAvailability - 1,
    height: profile.environmentalFactors.soilQualityEffect * soilQuality +
           profile.environmentalFactors.waterAvailabilityEffect * waterAvailability - 1,
    lightPenetration: 0 // Penetração de luz não é afetada por fatores básicos
  };
  
  const adjustedGrowth = {
    canopyRadius: baseGrowth.canopyRadius * (1 + environmentalMultiplier.canopyRadius * 0.2),
    height: baseGrowth.height * (1 + environmentalMultiplier.height * 0.2),
    lightPenetration: baseGrowth.lightPenetration
  };
  
  // Calcular e aplicar stress
  const stress = calculateEnvironmentalStress(
    plantPosition,
    nearbyPlants,
    soilQuality,
    waterAvailability
  );
  
  return applyEnvironmentalStress(
    adjustedGrowth,
    stress,
    profile.environmentalFactors.competitionResistance
  );
};
