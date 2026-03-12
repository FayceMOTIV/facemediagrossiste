import { describe, it, expect } from 'vitest';

// Test formatCurrency equivalent
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

// Test haversine distance from useGeofencing
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const dPhi = (lat2 - lat1) * Math.PI / 180;
  const dLambda = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

describe('formatCurrency', () => {
  it('should format positive amounts', () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain('1');
    expect(result).toContain('234');
    expect(result).toContain('€');
  });

  it('should format zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
    expect(result).toContain('€');
  });

  it('should format large amounts', () => {
    const result = formatCurrency(312500);
    expect(result).toContain('312');
    expect(result).toContain('€');
  });
});

describe('haversineDistance', () => {
  it('should return 0 for identical coordinates', () => {
    const dist = haversineDistance(45.75, 4.85, 45.75, 4.85);
    expect(dist).toBe(0);
  });

  it('should return approximately correct distance between Lyon and Paris', () => {
    // Lyon: 45.75, 4.85 — Paris: 48.85, 2.35
    const dist = haversineDistance(45.75, 4.85, 48.85, 2.35);
    // Real distance ~392km, allow ±10km tolerance
    expect(dist).toBeGreaterThan(380_000);
    expect(dist).toBeLessThan(410_000);
  });

  it('should detect geofence entry within 100m', () => {
    // Two very close points ~50m apart
    const dist = haversineDistance(45.7500, 4.8500, 45.7504, 4.8503);
    expect(dist).toBeLessThan(100);
  });

  it('should detect points outside 100m geofence', () => {
    // Two points ~500m apart
    const dist = haversineDistance(45.750, 4.850, 45.755, 4.856);
    expect(dist).toBeGreaterThan(100);
  });

  it('should be commutative', () => {
    const d1 = haversineDistance(45.75, 4.85, 43.30, 5.37);
    const d2 = haversineDistance(43.30, 5.37, 45.75, 4.85);
    expect(Math.abs(d1 - d2)).toBeLessThan(1); // identical within 1 meter
  });
});
