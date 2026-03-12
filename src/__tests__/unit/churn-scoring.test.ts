import { describe, it, expect } from 'vitest';

// Copy the pure function from the API route for testing
function calculateBaseScore(clientData: {
  lastOrderDate?: string;
  recentAvgOrder?: number;
  historicAvgOrder?: number;
  unansweredQuotes?: number;
  recentCommercialChange?: boolean;
}): number {
  let score = 0;
  const now = new Date();

  if (clientData.lastOrderDate) {
    const lastOrder = new Date(clientData.lastOrderDate);
    const daysSince = (now.getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 30) score += 35;
    else if (daysSince > 14) score += 25;
    else if (daysSince > 7) score += 10;
  }

  if (
    clientData.recentAvgOrder !== undefined &&
    clientData.historicAvgOrder !== undefined &&
    clientData.historicAvgOrder > 0 &&
    clientData.recentAvgOrder < clientData.historicAvgOrder * 0.8
  ) {
    score += 25;
  }

  if ((clientData.unansweredQuotes ?? 0) >= 2) score += 20;
  if (clientData.recentCommercialChange) score += 10;

  return Math.min(score, 100);
}

describe('Churn Score Calculation', () => {
  it('should return 0 for a healthy client with recent order', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const score = calculateBaseScore({
      lastOrderDate: yesterday.toISOString(),
      recentAvgOrder: 500,
      historicAvgOrder: 500,
      unansweredQuotes: 0,
      recentCommercialChange: false,
    });
    expect(score).toBe(0);
  });

  it('should add 25 points for last order > 14 days', () => {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    const score = calculateBaseScore({
      lastOrderDate: fifteenDaysAgo.toISOString(),
      recentAvgOrder: 500,
      historicAvgOrder: 500,
    });
    expect(score).toBe(25);
  });

  it('should add 35 points for last order > 30 days', () => {
    const thirtyOneDaysAgo = new Date();
    thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);
    const score = calculateBaseScore({
      lastOrderDate: thirtyOneDaysAgo.toISOString(),
    });
    expect(score).toBe(35);
  });

  it('should add 25 points for order value decline > 20%', () => {
    const score = calculateBaseScore({
      recentAvgOrder: 300,
      historicAvgOrder: 500, // 40% decline
    });
    expect(score).toBe(25);
  });

  it('should NOT add points for order value decline <= 20%', () => {
    const score = calculateBaseScore({
      recentAvgOrder: 410,
      historicAvgOrder: 500, // 18% decline — not enough
    });
    expect(score).toBe(0);
  });

  it('should add 20 points for 2+ unanswered quotes', () => {
    const score = calculateBaseScore({ unansweredQuotes: 2 });
    expect(score).toBe(20);
  });

  it('should add 10 points for recent commercial change', () => {
    const score = calculateBaseScore({ recentCommercialChange: true });
    expect(score).toBe(10);
  });

  it('should reach maximum achievable score with all risk factors combined', () => {
    const thirtyOneDaysAgo = new Date();
    thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);
    const score = calculateBaseScore({
      lastOrderDate: thirtyOneDaysAgo.toISOString(),
      recentAvgOrder: 100,
      historicAvgOrder: 500,
      unansweredQuotes: 3,
      recentCommercialChange: true,
    });
    // 35 (last order > 30d) + 25 (order decline > 20%) + 20 (unanswered quotes) + 10 (commercial change) = 90
    expect(score).toBe(90);
    expect(score).toBeLessThanOrEqual(100); // cap enforced by Math.min
  });

  it('should return 0 without any data', () => {
    const score = calculateBaseScore({});
    expect(score).toBe(0);
  });
});
