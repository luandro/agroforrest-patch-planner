import { describe, it, expect } from 'vitest';
import {
  formatTime,
  SPEED_OPTIONS,
  getGrowthStage,
  getGrowthStageCompact
} from './timelineUtils';

describe('formatTime', () => {
  it('should format months less than 12', () => {
    expect(formatTime(0)).toBe('0 meses');
    expect(formatTime(1)).toBe('1 meses');
    expect(formatTime(6)).toBe('6 meses');
    expect(formatTime(11)).toBe('11 meses');
  });

  it('should format exactly 12 months as 1 year', () => {
    expect(formatTime(12)).toBe('1 anos');
  });

  it('should format years with remaining months', () => {
    expect(formatTime(15)).toBe('1a 3m');
    expect(formatTime(18)).toBe('1a 6m');
    expect(formatTime(30)).toBe('2a 6m');
  });

  it('should format exact years without months', () => {
    expect(formatTime(24)).toBe('2 anos');
    expect(formatTime(36)).toBe('3 anos');
    expect(formatTime(60)).toBe('5 anos');
    expect(formatTime(120)).toBe('10 anos');
  });

  it('should round fractional months', () => {
    expect(formatTime(6.4)).toBe('6 meses');
    expect(formatTime(6.6)).toBe('7 meses');
  });

  it('should handle large values', () => {
    expect(formatTime(240)).toBe('20 anos');
  });
});

describe('SPEED_OPTIONS', () => {
  it('should have correct speed values', () => {
    expect(SPEED_OPTIONS).toEqual([0.5, 1, 2, 4]);
  });

  it('should have 4 speed options', () => {
    expect(SPEED_OPTIONS).toHaveLength(4);
  });
});

describe('getGrowthStage', () => {
  it('should return Estabelecimento for months < 12', () => {
    const result = getGrowthStage(0);
    expect(result.label).toBe('Estabelecimento');
    expect(result.description).toBe('Plantas se estabelecendo no solo');
  });

  it('should return Estabelecimento at month 11', () => {
    const result = getGrowthStage(11);
    expect(result.label).toBe('Estabelecimento');
  });

  it('should return Crescimento Ativo for months 12-59', () => {
    const result = getGrowthStage(12);
    expect(result.label).toBe('Crescimento Ativo');
    expect(result.description).toBe('Período de maior crescimento');
  });

  it('should return Crescimento Ativo at month 59', () => {
    const result = getGrowthStage(59);
    expect(result.label).toBe('Crescimento Ativo');
  });

  it('should return Maturidade for months >= 60', () => {
    const result = getGrowthStage(60);
    expect(result.label).toBe('Maturidade');
    expect(result.description).toBe('Plantas maduras e produtivas');
  });

  it('should return Maturidade for large values', () => {
    const result = getGrowthStage(240);
    expect(result.label).toBe('Maturidade');
  });
});

describe('getGrowthStageCompact', () => {
  it('should return compact description for Estabelecimento', () => {
    const result = getGrowthStageCompact(0);
    expect(result.label).toBe('Estabelecimento');
    expect(result.description).toBe('Plantas se estabelecendo');
  });

  it('should return compact description for Crescimento Ativo', () => {
    const result = getGrowthStageCompact(30);
    expect(result.label).toBe('Crescimento Ativo');
    expect(result.description).toBe('Crescimento acelerado');
  });

  it('should return compact description for Maturidade', () => {
    const result = getGrowthStageCompact(100);
    expect(result.label).toBe('Maturidade');
    expect(result.description).toBe('Plantas maduras');
  });

  it('should have same stage boundaries as getGrowthStage', () => {
    // Test boundary at 12
    expect(getGrowthStageCompact(11).label).toBe('Estabelecimento');
    expect(getGrowthStageCompact(12).label).toBe('Crescimento Ativo');

    // Test boundary at 60
    expect(getGrowthStageCompact(59).label).toBe('Crescimento Ativo');
    expect(getGrowthStageCompact(60).label).toBe('Maturidade');
  });
});
