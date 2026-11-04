import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterBar } from '@/components/filter-bar';
import { PlaceholderIcon } from '@/components/placeholder-icon';
import { ServiceRow } from '@/components/service-row';
import { filterServices, getCategory, servicesInCategory } from '@/lib/catalog';
import { useFilters } from '@/lib/filters-context';
import { theme } from '@/lib/theme';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const category = getCategory(id);
  const { filters } = useFilters();

  const all = useMemo(() => servicesInCategory(id), [id]);
  // The search box lives on the home screen; within a category only level/cert filters apply.
  const shown = useMemo(() => filterServices(all, { ...filters, query: '' }), [all, filters]);

  if (!category) {
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={styles.missingText}>{"That category doesn't exist."}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{ title: category.name, headerStyle: { backgroundColor: category.color } }}
      />
      <FlatList
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        data={shown}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => <ServiceRow service={item} />}
        ListHeaderComponent={
          <View>
            <View style={[styles.banner, { backgroundColor: category.color }]}>
              <PlaceholderIcon label={category.abbr} color="#00000033" size={56} />
              <View style={styles.bannerText}>
                <Text style={styles.desc}>{category.description}</Text>
                <Text style={styles.count}>
                  {shown.length === all.length
                    ? `${all.length} services`
                    : `${shown.length} of ${all.length} services match your filters`}
                </Text>
              </View>
            </View>
            <FilterBar />
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>No services here match your filters.</Text>}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  bannerText: { flex: 1, gap: 6 },
  desc: { color: '#fff', fontSize: 15, lineHeight: 21, fontWeight: '600' },
  count: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '700' },
  empty: { textAlign: 'center', color: theme.inkSoft, padding: 32, fontSize: 15 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingText: { fontSize: 16, color: theme.inkSoft },
});
