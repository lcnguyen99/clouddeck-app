import { StyleSheet, Text, View } from 'react-native';

import { tint } from '@/lib/theme';

type Props = {
  label: string;
  color: string;
  size?: number;
};

/**
 * Placeholder icon used for every service and category until real artwork exists.
 * One style everywhere: a rounded tile in the category color with a lighter corner
 * accent and a short white label.
 */
export function PlaceholderIcon({ label, color, size = 48 }: Props) {
  const fontSize = size * (label.length <= 2 ? 0.4 : label.length === 3 ? 0.32 : 0.25);
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: size * 0.28, backgroundColor: color },
      ]}>
      <View
        style={[
          styles.accent,
          {
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: size * 0.35,
            top: -size * 0.28,
            right: -size * 0.28,
            backgroundColor: tint(color, 0.35),
          },
        ]}
      />
      <Text
        style={[styles.label, { fontSize }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        allowFontScaling={false}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  accent: { position: 'absolute', opacity: 0.55 },
  label: { color: '#FFFFFF', fontWeight: '800', letterSpacing: 0.3, paddingHorizontal: 3 },
});
