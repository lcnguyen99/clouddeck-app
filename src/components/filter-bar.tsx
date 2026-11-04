import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/chip';
import { CERTIFICATIONS, LEVEL_COLORS, LEVELS } from '@/lib/catalog';
import { useFilters } from '@/lib/filters-context';
import { theme } from '@/lib/theme';

const CERT_COLOR = '#232F3E';

export function FilterBar() {
  const { filters, toggleLevel, toggleCert, clear } = useFilters();
  const activeCount = filters.levels.length + filters.certs.length;
  // Selected certifications move to the front so they're visible without scrolling.
  const certs = [
    ...CERTIFICATIONS.filter((c) => filters.certs.includes(c.id)),
    ...CERTIFICATIONS.filter((c) => !filters.certs.includes(c.id)),
  ];

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={[styles.heading, styles.headingInRow]}>Level</Text>
        {activeCount > 0 ? (
          <Pressable onPress={clear} hitSlop={8} accessibilityRole="button">
            <Text style={styles.clear}>Clear filters ({activeCount})</Text>
          </Pressable>
        ) : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {LEVELS.map((l) => (
          <Chip
            key={l}
            label={l}
            color={LEVEL_COLORS[l]}
            selected={filters.levels.includes(l)}
            onPress={() => toggleLevel(l)}
          />
        ))}
      </ScrollView>

      <Text style={[styles.heading, styles.certHeading]}>Certification</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {certs.map((c) => (
          <Chip
            key={c.id}
            label={c.id}
            sublabel={c.name}
            color={CERT_COLOR}
            selected={filters.certs.includes(c.id)}
            onPress={() => toggleCert(c.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 12 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headingInRow: { paddingHorizontal: 0 },
  certHeading: { marginTop: 14 },
  clear: { fontSize: 13, fontWeight: '700', color: '#2563EB', marginBottom: 8 },
  row: { gap: 8, paddingHorizontal: 16 },
});
