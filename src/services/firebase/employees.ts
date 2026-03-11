import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { db } from './config';
import type { UserRole } from '@/types';

export interface Employee {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  depot: 'lyon' | 'montpellier' | 'bordeaux';
  telephone?: string;
  status: 'actif' | 'suspendu';
  lastLogin?: Timestamp;
  lastActivity?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const getEmployees = async (): Promise<Employee[]> => {
  const q = query(collection(db, 'users'), orderBy('displayName'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(d => ({ id: d.id, ...d.data() } as Employee))
    .filter(e => e.role !== 'client');
};

export const subscribeToEmployees = (callback: (employees: Employee[]) => void) => {
  const q = query(collection(db, 'users'), orderBy('displayName'));
  return onSnapshot(q, (snapshot) => {
    const employees = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() } as Employee))
      .filter(e => e.role !== 'client');
    callback(employees);
  });
};

export const toggleEmployeeStatus = async (
  employeeId: string,
  newStatus: 'actif' | 'suspendu'
): Promise<void> => {
  await updateDoc(doc(db, 'users', employeeId), {
    status: newStatus,
    updatedAt: Timestamp.now(),
  });
};

export const updateEmployeeLastLogin = async (userId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      lastLogin: Timestamp.now(),
    });
  } catch {
    // User document might not exist yet
  }
};

export const createEmployee = async (
  id: string,
  data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> => {
  await setDoc(doc(db, 'users', id), {
    ...data,
    status: 'actif',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};
