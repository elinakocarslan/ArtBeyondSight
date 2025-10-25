import ModeButton from '@/components/mode-button';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  const openMode = (mode: 'museum' | 'monuments' | 'landscape') => {
    // cast to any because expo-router expects specific typed routes in this project
    router.push((`/scan/${mode}` as unknown) as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title} accessibilityRole="header">ArtBeyondSight</Text>
        <Text style={styles.subtitle}>Experience art and landmarks through music and narration</Text>

        <View style={styles.row}>
          <ModeButton
            label="Museum"
            subtitle="Paintings & Galleries"
            color="#3B82F6"
            iconName="palette"
            accessibilityLabel="Open Museum mode"
            onPress={() => openMode('museum')}
          />

          <ModeButton
            label="Monuments"
            subtitle="Landmarks & Statues"
            color="#A0522D"
            iconName="landscape"
            accessibilityLabel="Open Monuments mode"
            onPress={() => openMode('monuments')}
          />
        </View>

        <View style={styles.rowCenter}>
          <ModeButton
            label="Landscape"
            subtitle="Nature & Scenery"
            color="#16A34A"
            iconName="terrain"
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
