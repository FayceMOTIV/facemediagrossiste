import { describe, it, expect } from 'vitest';

type StockUrgence = 'critique' | 'faible' | 'normal' | 'surplus';

function computeUrgence(actuel: number, minimum: number): StockUrgence {
  if (actuel === 0) return 'critique';
  if (actuel <= minimum * 0.5) return 'critique';
  if (actuel <= minimum) return 'faible';
  if (actuel > minimum * 3) return 'surplus';
  return 'normal';
}

describe('Stock Urgence Calculation', () => {
  it('should return critique when stock is 0', () => {
    expect(computeUrgence(0, 10)).toBe('critique');
  });

  it('should return critique when stock <= 50% of minimum', () => {
    expect(computeUrgence(5, 10)).toBe('critique'); // 50%
    expect(computeUrgence(4, 10)).toBe('critique'); // 40%
    expect(computeUrgence(1, 10)).toBe('critique'); // 10%
  });

  it('should return faible when stock <= minimum', () => {
    expect(computeUrgence(6, 10)).toBe('faible');
    expect(computeUrgence(8, 10)).toBe('faible');
    expect(computeUrgence(10, 10)).toBe('faible');
  });

  it('should return normal when stock > minimum and <= 3x minimum', () => {
    expect(computeUrgence(15, 10)).toBe('normal');
    expect(computeUrgence(25, 10)).toBe('normal');
    expect(computeUrgence(30, 10)).toBe('normal');
  });

  it('should return surplus when stock > 3x minimum', () => {
    expect(computeUrgence(31, 10)).toBe('surplus');
    expect(computeUrgence(100, 10)).toBe('surplus');
  });

  it('should handle edge case: actuel exactly at 50% of minimum', () => {
    expect(computeUrgence(5, 10)).toBe('critique'); // exactly 50%
  });

  it('should handle edge case: actuel exactly at 3x minimum', () => {
    expect(computeUrgence(30, 10)).toBe('normal'); // exactly 3x
  });
});
