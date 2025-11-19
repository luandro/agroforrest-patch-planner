
/**
 * Format months into human-readable time format
 */
export const formatTime = (months: number): string => {
  if (months < 12) {
    return `${Math.round(months)} meses`;
  }
  let years = Math.floor(months / 12);
  let remainingMonths = Math.round(months % 12);

  // Handle case where rounding pushes remainder to 12
  if (remainingMonths === 12) {
    years += 1;
    remainingMonths = 0;
  }

  return remainingMonths > 0 ? `${years}a ${remainingMonths}m` : `${years} anos`;
};

export const SPEED_OPTIONS = [0.5, 1, 2, 4];

/**
 * Get the growth stage based on current month
 */
export const getGrowthStage = (currentMonth: number): { label: string; description: string } => {
  if (currentMonth < 12) {
    return {
      label: 'Estabelecimento',
      description: 'Plantas se estabelecendo no solo'
    };
  } else if (currentMonth < 60) {
    return {
      label: 'Crescimento Ativo',
      description: 'Período de maior crescimento'
    };
  } else {
    return {
      label: 'Maturidade',
      description: 'Plantas maduras e produtivas'
    };
  }
};

/**
 * Get compact description for mobile
 */
export const getGrowthStageCompact = (currentMonth: number): { label: string; description: string } => {
  if (currentMonth < 12) {
    return {
      label: 'Estabelecimento',
      description: 'Plantas se estabelecendo'
    };
  } else if (currentMonth < 60) {
    return {
      label: 'Crescimento Ativo',
      description: 'Crescimento acelerado'
    };
  } else {
    return {
      label: 'Maturidade',
      description: 'Plantas maduras'
    };
  }
};
