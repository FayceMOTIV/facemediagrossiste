import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Delivery } from '@/hooks/useDeliveries';

const STATUS_CONFIG: Record<
  Delivery['status'],
  { label: string; bg: string; text: string }
> = {
  planifiee: { label: 'Planifiée', bg: '#e0f2fe', text: '#0369a1' },
  en_route: { label: 'En route', bg: '#dbeafe', text: '#1d4ed8' },
  arrivee: { label: 'Arrivé', bg: '#fef9c3', text: '#a16207' },
  livree: { label: 'Livrée', bg: '#dcfce7', text: '#15803d' },
  probleme: { label: 'Problème', bg: '#fee2e2', text: '#dc2626' },
};

interface Props {
  status: Delivery['status'];
}

export default function StatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.planifiee;
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
