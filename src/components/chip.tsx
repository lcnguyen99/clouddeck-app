import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '@/lib/theme';

type Props = {
  label: string;
  sublabel?: string;
  color?: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, sublabel, color = theme.brand, selected = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={4}
      style={({ pressed }) => [
        styles.chip,
        { borderColor: color },
        selected && { backgroundColor: color },
        pressed && { opacity: 0.7 },
      ]}>
      <Text style={[styles.label, { color: selected ? '#fff' : color }]}>{label}</Text>
      {sublabel ? (
        <Text style={[styles.sublabel, { color: selected ? '#fff' : theme.inkSoft }]}>
          {sublabel}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#fff',
  },
  label: { fontSize: 13, fontWeight: '700' },
  sublabel: { fontSize: 12, fontWeight: '500' },
});
