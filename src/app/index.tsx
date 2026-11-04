import { router } from 'expo-router';
import { useMemo } from 'react';
import {
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterBar } from '@/components/filter-bar';
import { PlaceholderIcon } from '@/components/placeholder-icon';
import { ServiceRow } from '@/components/service-row';
import {
  CATEGORIES,
  SERVICES,
  filterServices,
  hasActiveFilters,
  type Category,
  type Service,
} from '@/lib/catalog';
import { useFilters } from '@/lib/filters-context';
import { theme, tint } from '@/lib/theme';

type Section = { category: Category; data: Service[] };

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { filters, setQuery, clear } = useFilters();
  const active = hasActiveFilters(filters);

  const matches = useMemo(() => filterServices(SERVICES, filters), [filters]);
  const sections = useMemo<Section[]>(
    () =>
      active
        ? CATEGORIES.map((category) => ({
            category,
            data: matches.filter((s) => s.category === category.id),
          })).filter((s) => s.data.length > 0)
        : [],
    [active, matches],
  );

  const contentWidth = Math.min(width, 900);
  const columns = contentWidth >= 720 ? 4 : contentWidth >= 520 ? 3 : 2;
  const tileWidth = (contentWidth - 32 - (columns - 1) * 10) / columns;

  const header = (
    <View>
      <View style={[styles.hero, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.brand}>
          Cloud<Text style={{ color: theme.accent }}>Deck</Text>
        </Text>
        <Text style={styles.tagline}>{SERVICES.length} AWS services explained for beginners</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={filters.query}
            onChangeText={setQuery}
            placeholder="Search: S3, queue, database…"
            placeholderTextColor={theme.inkFaint}
            style={styles.searchInput}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="while-editing"
            accessibilityLabel="Search services"
          />
        </View>
      </View>

      <FilterBar />

      {active ? (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {matches.length} {matches.length === 1 ? 'service' : 'services'} found
          </Text>
          <Pressable onPress={clear} hitSlop={8} accessibilityRole="button">
            <Text style={styles.resetLink}>Show all categories</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.grid}>
          <Text style={styles.sectionTitle}>Browse by category</Text>
          <View style={styles.gridInner}>
            {CATEGORIES.map((c) => (
              <CategoryTile
                key={c.id}
                category={c}
                width={tileWidth}
                count={SERVICES.filter((s) => s.category === c.id).length}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SectionList
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      sections={sections}
      keyExtractor={(s) => s.id}
      ListHeaderComponent={header}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <View style={styles.groupHeader}>
          <View style={[styles.groupDot, { backgroundColor: section.category.color }]} />
          <Text style={[styles.groupTitle, { color: section.category.color }]}>
            {section.category.name}
          </Text>
          <Text style={styles.groupCount}>{section.data.length}</Text>
        </View>
      )}
      renderItem={({ item }) => <ServiceRow service={item} />}
      ListEmptyComponent={
        active ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No services match</Text>
            <Text style={styles.emptyText}>Try a different word or remove a filter.</Text>
          </View>
        ) : undefined
      }
    />
  );
}

function CategoryTile({
  category,
  count,
  width,
}: {
  category: Category;
  count: number;
  width: number;
}) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/category/[id]', params: { id: category.id } })}
      accessibilityRole="link"
      style={({ pressed }) => [
        styles.tile,
        {
          width,
          backgroundColor: tint(category.color, 0.88),
          borderColor: tint(category.color, 0.7),
        },
        pressed && styles.pressed,
      ]}
      accessibilityLabel={`${category.name}, ${count} services`}>
      <View style={styles.tileTop}>
        <PlaceholderIcon label={category.abbr} color={category.color} size={44} />
        <View style={[styles.countPill, { backgroundColor: category.color }]}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </View>
      <Text style={[styles.tileName, { color: category.color }]} numberOfLines={2}>
        {category.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center' },
  hero: {
    backgroundColor: theme.brand,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  brand: { fontSize: 34, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  tagline: { fontSize: 15, color: '#CBD5E1', marginTop: 4, marginBottom: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 20, color: theme.inkFaint, marginRight: 6 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: theme.ink,
    ...Platform.select({ web: { outlineWidth: 0 } }),
  },
  grid: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: theme.ink, marginBottom: 12 },
  gridInner: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { borderRadius: theme.radius, padding: 14, borderWidth: 1, minHeight: 118, gap: 12 },
  tileTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  countPill: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 2 },
  countText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  tileName: { fontSize: 15, fontWeight: '800', lineHeight: 19 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  resultsText: { fontSize: 15, fontWeight: '700', color: theme.ink },
  resetLink: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  groupDot: { width: 10, height: 10, borderRadius: 5 },
  groupTitle: { fontSize: 14, fontWeight: '800', flex: 1 },
  groupCount: { fontSize: 13, fontWeight: '700', color: theme.inkFaint },
  empty: { alignItems: 'center', padding: 40, gap: 6 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: theme.ink },
  emptyText: { fontSize: 14, color: theme.inkSoft },
});
