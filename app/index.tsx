import ModeButton from '@/components/mode-button';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function Home() {
  const router = useRouter();

  const openMode = (mode: 'museum' | 'monuments' | 'landscape') => {
    // cast to any because expo-router expects specific typed routes in this project
    router.push((`/scan/${mode}` as unknown) as any);
  };

  const { width } = Dimensions.get('window');
  // Responsive tile width: 3 columns on wide screens, 2 on medium, 1 on small
  let cols = 3;
  if (width < 760) cols = 2;
  if (width < 420) cols = 1;
  // compute columns and title size for responsiveness
  const titleSize = width > 900 ? 64 : width > 600 ? 48 : 34;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.bgDecor} pointerEvents="none">
        <View style={styles.glowLeft} />
        <View style={styles.glowRight} />
      </View>

      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: titleSize }]} accessibilityRole="header">ArtBeyondSight</Text>
        <Text style={styles.subtitle}>Experience art and landmarks through music and narration</Text>

        <View style={[styles.rowTop, cols === 1 ? styles.colStack : null]}>
          <ModeButton
            label="Museum"
            subtitle="Paintings & Artworks"
            color="#2563EB"
            iconName="palette"
            iconSize={56}
            style={{ width: '92%', height: 110, borderRadius: 14 }}
            accessibilityLabel="Open Museum mode"
            onPress={() => openMode('museum')}
          />

          <ModeButton
            label="Monuments"
            subtitle="Historic Landmarks"
            color="#B45309"
            iconName="account-balance"
            iconSize={56}
            style={{ width: '92%', height: 110, borderRadius: 14 }}
            accessibilityLabel="Open Monuments mode"
            onPress={() => openMode('monuments')}
          />

          <ModeButton
            label="Landscape"
            subtitle="Natural Scenes"
            color="#059669"
            iconName="terrain"
            iconSize={56}
            style={{ width: '92%', height: 110, borderRadius: 14 }}
            accessibilityLabel="Open Landscape mode"
            onPress={() => openMode('landscape')}
          />
        </View>

        {/* History Button */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push('/history' as any)}
          accessibilityLabel="View analysis history"
        >
          <MaterialIcons name="history" size={24} color="#fff" />
          <Text style={styles.historyText}>View History</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 24, alignItems: 'center', gap: 16 },
  title: { fontSize: 34, fontWeight: '800', color: '#111', marginTop: 8 },
  subtitle: { fontSize: 16, color: '#333', marginBottom: 20, textAlign: 'center' },
  row: { flexDirection: 'row' },
  rowCenter: { flexDirection: 'row', justifyContent: 'center' },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  historyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
