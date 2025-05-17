import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'react-native';
import useThemeStore, { defaultColors } from '@/store/useThemeStore';
import { getTheme } from '@/constants/theme';

export default function RootLayout() {
  const [loaded] = useFonts({
    // Add any custom fonts here if needed
  });

  const colorScheme = useColorScheme();
  const themeStore = useThemeStore();
  
  // Initialize theme if not already set
  useEffect(() => {
    // If theme is not initialized, initialize it with the device color scheme
    if (!themeStore.theme) {
      const deviceTheme = colorScheme === 'dark' ? 'dark' : 'light';
      themeStore.setThemeType(deviceTheme);
    }
    
    // Log the theme for debugging
    console.log('Theme initialized:', themeStore.themeType);
  }, []);
  
  // Get the current theme values
  const theme = themeStore.getThemeValues();
  const colors = theme.colors || defaultColors;

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style={themeStore.themeType === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background || defaultColors.background,
          },
          headerTintColor: colors.text || defaultColors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.background || defaultColors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}