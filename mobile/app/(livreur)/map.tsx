import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useDeliveries } from '@/hooks/useDeliveries';
import { useTracking } from '@/hooks/useTracking';
import MapRoute from '@/components/MapRoute';

export default function MapScreen() {
  const { user } = useAuth();
  const { deliveries, loading } = useDeliveries(user?.uid ?? null);
  const { position } = useTracking(user?.uid ?? null);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Carte de la tournée</Text>
        <Text style={styles.subtitle}>{deliveries.length} arrêts aujourd'hui</Text>
      </View>
      <View style={styles.mapContainer}>
        <MapRoute deliveries={deliveries} currentPosition={position} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  mapContainer: { flex: 1, margin: 12, borderRadius: 12, overflow: 'hidden' },
});
