import { Stack, router, useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LevelBadge } from '@/components/level-badge';
import { PlaceholderIcon } from '@/components/placeholder-icon';
import { getCategory, getCertification, getService, servicesInCategory } from '@/lib/catalog';
import { useFilters } from '@/lib/filters-context';
import { theme, tint } from '@/lib/theme';

export default function ServiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { onlyCert } = useFilters();
  const service = getService(id);
  const category = service ? getCategory(service.category) : undefined;

  if (!service || !category) {
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={styles.missingText}>{"That service doesn't exist."}</Text>
      </View>
    );
  }

  const color = category.color;
  const siblings = servicesInCategory(category.id).filter((s) => s.id !== service.id);

  const showCert = (certId: string) => {
    onlyCert(certId);
    router.navigate('/');
  };

  return (
    <>
      <Stack.Screen
        options={{ title: service.shortName, headerStyle: { backgroundColor: color } }}
      />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <View style={[styles.hero, { backgroundColor: color }]}>
          <PlaceholderIcon label={service.shortName} color="#00000033" size={72} />
          <View style={styles.heroText}>
            <Text style={styles.name}>{service.name}</Text>
            <Pressable
              hitSlop={6}
              accessibilityRole="link"
              onPress={() =>
                router.push({ pathname: '/category/[id]', params: { id: category.id } })
              }>
              <Text style={styles.categoryLink}>{category.name} ›</Text>
            </Pressable>
            <LevelBadge level={service.level} inverted />
          </View>
        </View>

        <Card title="What is it?" color={color}>
          <Text style={styles.body}>{service.definition}</Text>
        </Card>

        <Card title="What it's used for" color={color}>
          {service.usedFor.map((u) => (
            <View key={u} style={styles.bulletRow}>
              <View style={[styles.bullet, { backgroundColor: color }]} />
              <Text style={[styles.body, styles.bulletText]}>{u}</Text>
            </View>
          ))}
        </Card>

        <View
          style={[
            styles.scenario,
            { backgroundColor: tint(color, 0.88), borderColor: tint(color, 0.65) },
          ]}>
          <Text style={[styles.cardTitle, { color }]}>Real-world scenario</Text>
          <Text style={styles.company}>{service.scenario.company}</Text>
          <Text style={styles.body}>{service.scenario.story}</Text>
        </View>

        <Card title="Appears on these certifications" color={color}>
          {service.certifications.length === 0 ? (
            <Text style={styles.body}>Not a major topic on current AWS certification exams.</Text>
          ) : (
            <View style={styles.certs}>
              {service.certifications.map((cid) => {
                const cert = getCertification(cid);
                if (!cert) return null;
                return (
                  <Pressable
                    key={cid}
                    onPress={() => showCert(cid)}
                    style={({ pressed }) => [styles.cert, pressed && { opacity: 0.7 }]}
                    accessibilityRole="button"
                    accessibilityLabel={`Show all services on ${cert.name}`}>
                    <Text style={styles.certCode}>{cert.code}</Text>
                    <Text style={styles.certName}>{cert.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
          <Text style={styles.hint}>Tap a certification to see every service on it.</Text>
        </Card>

        {siblings.length > 0 ? (
          <View style={styles.moreWrap}>
            <Text style={styles.moreTitle}>More in {category.name}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moreRow}>
              {siblings.map((s) => (
                <Pressable
                  key={s.id}
                  accessibilityRole="link"
                  onPress={() => router.push({ pathname: '/service/[id]', params: { id: s.id } })}
                  style={({ pressed }) => [styles.moreCard, pressed && { opacity: 0.75 }]}>
                  <PlaceholderIcon label={s.shortName} color={color} size={44} />
                  <Text style={styles.moreName} numberOfLines={2}>
                    {s.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}

function Card({ title, color, children }: { title: string; color: string; children: ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.cardTitle, { color }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center' },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 8,
  },
  heroText: { flex: 1, gap: 6 },
  name: { fontSize: 24, fontWeight: '900', color: '#fff', lineHeight: 29 },
  categoryLink: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '700' },
  card: {
    backgroundColor: theme.card,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.border,
    gap: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  body: { fontSize: 16, lineHeight: 23, color: theme.ink },
  bulletRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bullet: { width: 8, height: 8, borderRadius: 4, marginTop: 8 },
  bulletText: { flex: 1 },
  scenario: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: theme.radius,
    borderWidth: 1,
    gap: 6,
  },
  company: { fontSize: 17, fontWeight: '800', color: theme.ink },
  certs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cert: {
    backgroundColor: theme.brand,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  certCode: { color: theme.accent, fontWeight: '800', fontSize: 12 },
  certName: { color: '#fff', fontWeight: '700', fontSize: 13 },
  hint: { fontSize: 12, color: theme.inkFaint },
  moreWrap: { marginTop: 20 },
  moreTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.ink,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  moreRow: { gap: 10, paddingHorizontal: 16 },
  moreCard: {
    width: 112,
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 12,
    gap: 8,
    alignItems: 'flex-start',
  },
  moreName: { fontSize: 13, fontWeight: '700', color: theme.ink },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingText: { fontSize: 16, color: theme.inkSoft },
});
