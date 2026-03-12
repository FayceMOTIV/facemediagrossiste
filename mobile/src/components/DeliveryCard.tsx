import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Delivery } from '@/hooks/useDeliveries';
import StatusBadge from './StatusBadge';

interface Props {
  delivery: Delivery;
  onPress: () => void;
}

export default function DeliveryCard({ delivery, onPress }: Props) {
  const heure = delivery.creneauPrevu ?? '—';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.client} numberOfLines={1}>{delivery.clientNom}</Text>
        <StatusBadge status={delivery.status} />
      </View>
      <View style={styles.row}>
        <Ionicons name="location-outline" size={14} color="#6b7280" />
        <Text style={styles.adresse} numberOfLines={1}>{delivery.adresse}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text style={styles.meta}>{heure}</Text>
        </View>
        {delivery.poidsTotal != null && (
          <View style={styles.row}>
            <Ionicons name="cube-outline" size={14} color="#6b7280" />
            <Text style={styles.meta}>{delivery.poidsTotal} kg</Text>
          </View>
        )}
        {delivery.totalTTC != null && (
          <View style={styles.row}>
            <Ionicons name="cash-outline" size={14} color="#6b7280" />
            <Text style={styles.meta}>{delivery.totalTTC.toFixed(0)} €</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  client: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  adresse: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  meta: {
    fontSize: 12,
    color: '#6b7280',
  },
});
