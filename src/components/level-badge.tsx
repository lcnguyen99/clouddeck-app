import { StyleSheet, Text, View } from 'react-native';

import { LEVEL_COLORS, type Level } from '@/lib/catalog';
import { tint } from '@/lib/theme';

export function LevelBadge({ level, inverted = false }: { level: Level; inverted?: boolean }) {
  const color = LEVEL_COLORS[level];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: inverted ? 'rgba(255,255,255,0.22)' : tint(color, 0.85) },
      ]}>
      <View style={[styles.dot, { backgroundColor: inverted ? '#fff' : color }]} />
      <Text style={[styles.text, { color: inverted ? '#fff' : color }]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 11, fontWeight: '700' },
});
