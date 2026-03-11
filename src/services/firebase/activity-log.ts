import { collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './config';

export type ActivityAction =
  | 'user_login'
  | 'user_logout'
  | 'order_created'
  | 'order_updated'
  | 'order_deleted'
  | 'client_created'
  | 'client_updated'
  | 'delivery_started'
  | 'delivery_completed'
  | 'quote_created'
  | 'quote_sent'
  | 'stock_updated'
  | 'user_suspended'
  | 'user_activated'
  | 'employee_access_changed';

export interface ActivityLog {
  id?: string;
  userId: string;
  userEmail: string;
  userRole: string;
  action: ActivityAction;
  details: Record<string, unknown>;
  resourceType?: string;
  resourceId?: string;
  ipAddress?: string;
  createdAt: Timestamp;
}

export const logActivity = async (
  userId: string,
  userEmail: string,
  userRole: string,
  action: ActivityAction,
  details: Record<string, unknown> = {},
  resourceType?: string,
  resourceId?: string
): Promise<void> => {
  try {
    await addDoc(collection(db, 'activity_logs'), {
      userId,
      userEmail,
      userRole,
      action,
      details,
      resourceType,
      resourceId,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    // Don't throw - logging failures should not break the main flow
    console.error('Failed to log activity:', error);
  }
};

export const getActivityLogs = async (
  filters?: {
    userId?: string;
    action?: ActivityAction;
    limitCount?: number;
  }
): Promise<ActivityLog[]> => {
  const constraints = [];

  if (filters?.userId) {
    constraints.push(where('userId', '==', filters.userId));
  }
  if (filters?.action) {
    constraints.push(where('action', '==', filters.action));
  }

  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(filters?.limitCount ?? 100));

  const q = query(collection(db, 'activity_logs'), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as ActivityLog[];
};
