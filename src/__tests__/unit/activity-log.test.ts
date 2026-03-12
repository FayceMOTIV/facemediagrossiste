import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({})),
  addDoc: vi.fn().mockResolvedValue({ id: 'test-log-id' }),
  getDocs: vi.fn().mockResolvedValue({
    docs: [
      {
        id: 'log1',
        data: () => ({
          userId: 'user1',
          userEmail: 'test@distram.fr',
          userRole: 'commercial',
          action: 'order_created',
          details: { orderId: 'order1' },
          createdAt: { toDate: () => new Date() },
        }),
      },
    ],
  }),
  query: vi.fn((ref) => ref),
  where: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
  limit: vi.fn(() => ({})),
  Timestamp: { now: vi.fn(() => ({ toDate: () => new Date() })) },
}));

// Mock Firebase config
vi.mock('@/services/firebase/config', () => ({
  db: {},
}));

describe('Activity Log Service', () => {
  it('should export logActivity function', async () => {
    const { logActivity } = await import('@/services/firebase/activity-log');
    expect(typeof logActivity).toBe('function');
  });

  it('should export getActivityLogs function', async () => {
    const { getActivityLogs } = await import('@/services/firebase/activity-log');
    expect(typeof getActivityLogs).toBe('function');
  });

  it('should not throw when logging activity', async () => {
    const { logActivity } = await import('@/services/firebase/activity-log');
    await expect(
      logActivity('user1', 'test@test.com', 'commercial', 'order_created', { test: 'data' })
    ).resolves.not.toThrow();
  });

  it('should not throw even when Firestore fails', async () => {
    const { addDoc } = await import('firebase/firestore');
    vi.mocked(addDoc).mockRejectedValueOnce(new Error('Firestore error'));

    const { logActivity } = await import('@/services/firebase/activity-log');
    // Should NOT throw — fire and forget
    await expect(
      logActivity('user1', 'test@test.com', 'admin', 'user_login', {})
    ).resolves.toBeUndefined();
  });
});
