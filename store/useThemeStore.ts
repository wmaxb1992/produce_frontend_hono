import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme, ThemeType } from '@/constants/theme';
import { ThemeColors } from '@/types';

// Define a default set of colors to use as fallback
const defaultColors: ThemeColors = {
  primary: '#4CAF50',
  secondary: '#FF9800',
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#333333',
  subtext: '#666666',
  border: '#EEEEEE',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  white: '#FFFFFF',
  black: '#000000',
  spring: '#4CAF50',
  summer: '#FF9800',
  fall: '#795548',
  winter: '#2196F3',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  }
};

interface ThemeState {
  themeType: ThemeType;
  theme: ReturnType<typeof getTheme> | null;
  
  // Actions
  setThemeType: (type: ThemeType) => void;
  getThemeValues: () => ReturnType<typeof getTheme>;
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeType: 'light' as ThemeType,
      theme: null,
      
      setThemeType: (type) => {
        const newTheme = getTheme(type);
        set({ themeType: type, theme: newTheme });
      },
      
      getThemeValues: () => {
        const { theme, themeType } = get();
        // If theme is not initialized yet, initialize it with the current themeType
        if (!theme) {
          const newTheme = getTheme(themeType);
          set({ theme: newTheme });
          return newTheme;
        }
        return theme;
      },
      
      toggleTheme: () => {
        const { themeType } = get();
        const newType = themeType === 'light' ? 'dark' : 'light';
        const newTheme = getTheme(newType);
        set({ themeType: newType, theme: newTheme });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Export the default colors for use in components
export { defaultColors };
export default useThemeStore;