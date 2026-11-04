import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LevelBadge } from '@/components/level-badge';
import { PlaceholderIcon } from '@/components/placeholder-icon';
import { getCategory, type Service } from '@/lib/catalog';
import { theme } from '@/lib/theme';

export function ServiceRow({ service }: { service: Service }) {
  const color = getCategory(service.category)?.color ?? theme.brand;
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/service/[id]', params: { id: service.id } })}
      accessibilityRole="link"
      accessibilityLabel={`${service.name}, ${service.level}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <PlaceholderIcon label={service.shortName} color={color} size={46} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {service.name}
          </Text>
          <LevelBadge level={service.level} />
        </View>
        <Text style={styles.def} numberOfLines={2}>
          {service.definition}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: theme.card,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.border,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  body: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'space-between' },
  name: { flexShrink: 1, fontSize: 16, fontWeight: '700', color: theme.ink },
  def: { fontSize: 13, lineHeight: 18, color: theme.inkSoft },
});
