import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import type { Delivery } from '@/hooks/useDeliveries';
import type { Position } from '@/hooks/useTracking';

interface Props {
  deliveries: Delivery[];
  currentPosition: Position | null;
}

export default function MapRoute({ deliveries, currentPosition }: Props) {
  const markers = deliveries
    .filter(d => d.coordonnees)
    .map((d, i) => ({
      id: d.id,
      coordinate: { latitude: d.coordonnees!.lat, longitude: d.coordonnees!.lng },
      title: d.clientNom,
      description: d.adresse,
      index: i + 1,
      status: d.status,
    }));

  const initialRegion = currentPosition
    ? {
        latitude: currentPosition.lat,
        longitude: currentPosition.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : markers.length > 0
    ? {
        latitude: markers[0].coordinate.latitude,
        longitude: markers[0].coordinate.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }
    : {
        latitude: 45.7640,
        longitude: 4.8357,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={m.coordinate}
            title={`${m.index}. ${m.title}`}
            description={m.description}
            pinColor={m.status === 'livree' ? '#16a34a' : m.status === 'probleme' ? '#dc2626' : '#2563eb'}
          />
        ))}
        {markers.length > 1 && (
          <Polyline
            coordinates={markers.map(m => m.coordinate)}
            strokeColor="#2563eb"
            strokeWidth={2}
            lineDashPattern={[6, 4]}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
