import { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useDeliveries } from '@/hooks/useDeliveries';
import StatusBadge from '@/components/StatusBadge';

export default function DeliveryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { deliveries, updateStatus } = useDeliveries(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [problemNote, setProblemNote] = useState('');
  const cameraRef = useRef<CameraView>(null);

  // Find delivery from cached list or fetch
  const [delivery, setDelivery] = useState(() =>
    deliveries.find(d => d.id === id) ?? null
  );

  // Fetch if not in cache
  useState(() => {
    if (!delivery && id) {
      getDoc(doc(db, 'deliveries', id)).then(snap => {
        if (snap.exists()) {
          setDelivery({ id: snap.id, ...snap.data() } as typeof delivery);
        }
      });
    }
  });

  if (!delivery) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      </SafeAreaView>
    );
  }

  const openNavigation = () => {
    const address = encodeURIComponent(delivery.adresse);
    const url = Platform.OS === 'ios'
      ? `maps://?q=${address}`
      : `geo:0,0?q=${address}`;
    Linking.openURL(url);
  };

  const handleStart = async () => {
    await updateStatus(delivery.id, 'en_route');
    setDelivery(d => d ? { ...d, status: 'en_route' } : d);
  };

  const takePhoto = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setShowCamera(true);
  };

  const capturePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
    if (photo) {
      setPhotoUri(photo.uri);
      setShowCamera(false);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleComplete = async () => {
    if (!photoUri) {
      Alert.alert('Photo requise', 'Prenez une photo de preuve de livraison avant de valider.');
      return;
    }
    setIsSaving(true);
    try {
      await updateStatus(delivery.id, 'livree', {
        photo: photoUri,
        heureArrivee: Timestamp.now(),
      });
      setDelivery(d => d ? { ...d, status: 'livree' } : d);
      Alert.alert('Livraison validée', 'La livraison a été marquée comme effectuée.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Erreur', 'Impossible de sauvegarder la livraison.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProblem = async () => {
    Alert.alert(
      'Signaler un problème',
      'Confirmer le signalement de problème pour cette livraison ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: async () => {
            await updateStatus(delivery.id, 'probleme', {
              notes: problemNote || 'Problème signalé',
            });
            setDelivery(d => d ? { ...d, status: 'probleme' } : d);
          },
        },
      ]
    );
  };

  if (showCamera) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
          <View style={styles.cameraControls}>
            <TouchableOpacity
              onPress={() => setShowCamera(false)}
              style={styles.cameraCancelBtn}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={capturePhoto} style={styles.captureBtn}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{delivery.clientNom}</Text>
        <StatusBadge status={delivery.status} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Address card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Ionicons name="location" size={18} color="#16a34a" />
            <Text style={styles.cardTitle}>Adresse</Text>
          </View>
          <Text style={styles.address}>{delivery.adresse}</Text>
          <TouchableOpacity style={styles.navButton} onPress={openNavigation}>
            <Ionicons name="navigate" size={16} color="#fff" />
            <Text style={styles.navButtonText}>Naviguer</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery info */}
        {delivery.creneauPrevu && (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name="time-outline" size={18} color="#2563eb" />
              <Text style={styles.cardTitle}>Créneau prévu</Text>
            </View>
            <Text style={styles.infoText}>{delivery.creneauPrevu}</Text>
          </View>
        )}

        {/* Items */}
        {delivery.items && delivery.items.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name="cube-outline" size={18} color="#7c3aed" />
              <Text style={styles.cardTitle}>Produits ({delivery.items.length})</Text>
            </View>
            {delivery.items.map((item, i) => (
              <View key={i} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.productNom}</Text>
                <Text style={styles.itemQty}>x{item.quantite}</Text>
              </View>
            ))}
            {delivery.totalTTC != null && (
              <Text style={styles.total}>Total : {delivery.totalTTC.toFixed(2)} €</Text>
            )}
          </View>
        )}

        {/* Notes */}
        {delivery.notes && (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name="document-text-outline" size={18} color="#d97706" />
              <Text style={styles.cardTitle}>Notes</Text>
            </View>
            <Text style={styles.infoText}>{delivery.notes}</Text>
          </View>
        )}

        {/* Photo proof */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Ionicons name="camera-outline" size={18} color="#0891b2" />
            <Text style={styles.cardTitle}>Photo de livraison</Text>
          </View>
          {photoUri ? (
            <View style={styles.photoPreview}>
              <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
              <Text style={styles.photoTaken}>Photo prise</Text>
              <TouchableOpacity onPress={takePhoto}>
                <Text style={styles.retakeText}>Reprendre</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
                <Ionicons name="camera" size={20} color="#0891b2" />
                <Text style={styles.photoBtnText}>Appareil photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoBtn} onPress={pickFromGallery}>
                <Ionicons name="image-outline" size={20} color="#0891b2" />
                <Text style={styles.photoBtnText}>Galerie</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {delivery.status === 'planifiee' && (
            <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
              <Ionicons name="play" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Démarrer la livraison</Text>
            </TouchableOpacity>
          )}

          {(delivery.status === 'en_route' || delivery.status === 'arrivee') && (
            <TouchableOpacity
              style={[styles.completeBtn, isSaving && styles.btnDisabled]}
              onPress={handleComplete}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.actionBtnText}>Valider la livraison</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {delivery.status !== 'livree' && delivery.status !== 'probleme' && (
            <TouchableOpacity style={styles.problemBtn} onPress={handleProblem}>
              <Ionicons name="warning-outline" size={20} color="#dc2626" />
              <Text style={styles.problemBtnText}>Signaler un problème</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#111827' },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#374151' },
  address: { fontSize: 15, color: '#111827', lineHeight: 22, marginBottom: 12 },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
  },
  navButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  infoText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  itemName: { fontSize: 13, color: '#374151', flex: 1 },
  itemQty: { fontSize: 13, color: '#6b7280', fontWeight: '600' },
  total: { fontSize: 14, fontWeight: '700', color: '#111827', marginTop: 8, textAlign: 'right' },
  photoPreview: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  photoTaken: { fontSize: 14, color: '#16a34a', flex: 1 },
  retakeText: { fontSize: 13, color: '#2563eb', textDecorationLine: 'underline' },
  photoButtons: { flexDirection: 'row', gap: 12 },
  photoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#0891b2',
    borderRadius: 8,
    paddingVertical: 10,
  },
  photoBtnText: { fontSize: 13, color: '#0891b2', fontWeight: '500' },
  actions: { gap: 10, marginTop: 8 },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 14,
  },
  btnDisabled: { backgroundColor: '#9ca3af' },
  actionBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  problemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 12,
  },
  problemBtnText: { fontSize: 14, fontWeight: '600', color: '#dc2626' },
  // Camera
  cameraControls: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 48,
    gap: 24,
  },
  cameraCancelBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
});
