import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { FiltersProvider } from '@/lib/filters-context';
import { theme } from '@/lib/theme';

// Deep links (e.g. /service/s3) still get the home screen underneath, so Back always works.
export const unstable_settings = { initialRouteName: 'index' };

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: theme.bg, primary: theme.accent },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={navTheme}>
      <FiltersProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.brand },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
            contentStyle: { backgroundColor: theme.bg },
          }}>
          <Stack.Screen name="index" options={{ headerShown: false, title: 'CloudDeck' }} />
        </Stack>
      </FiltersProvider>
    </ThemeProvider>
  );
}
