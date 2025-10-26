import ModeButton from '@/components/mode-button';
// decorative icons removed from this screen
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';


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

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { fontSize: titleSize }]} accessibilityRole="header">ArtBeyondSight</Text>
        <Text style={styles.subtitle}>Turning Art into Music</Text>

        <View style={styles.taglineRow} pointerEvents="none">
          <Text style={styles.taglineIcon}>♪</Text>
          <Text style={styles.taglineText}>Accessible • Inclusive • Immersive</Text>
        </View>

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

        {/* History Button removed */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#071026' },
  container: { padding: 24, alignItems: 'center', gap: 16 },
  // layout for the mode buttons row
  rowTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  colStack: { flexDirection: 'column' },
  // decorative background glows
  bgDecor: { position: 'absolute', top: 0, left: 0, right: 0, height: 300, pointerEvents: 'none' },
  glowLeft: { position: 'absolute', width: 360, height: 360, borderRadius: 180, backgroundColor: 'rgba(37,99,235,0.12)', left: -120, top: -120 },
  glowRight: { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(5,150,105,0.10)', right: -100, top: -80 },
  title: { fontSize: 34, fontWeight: '800', color: '#dbe9ff', marginTop: 8 },
  subtitle: { fontSize: 16, color: '#cbd6e6', marginBottom: 20, textAlign: 'center' },
  taglineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 18, gap: 8 },
  taglineIcon: { color: '#d6b3ff', fontSize: 18, marginRight: 6 },
  taglineText: { color: '#d6b3ff', fontSize: 16 },
  row: { flexDirection: 'row' },
  rowCenter: { flexDirection: 'row', justifyContent: 'center' },
  // history button removed
});
