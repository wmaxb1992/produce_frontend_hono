import { Platform } from 'react-native';
import colors from './colors';

export type ThemeType = 'light' | 'dark';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const shadows = {
  light: Platform.select({
    ios: {
      sm: {
        shadowColor: colors.light.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      md: {
        shadowColor: colors.light.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      lg: {
        shadowColor: colors.light.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    },
    android: {
      sm: { elevation: 2 },
      md: { elevation: 4 },
      lg: { elevation: 8 },
    },
    default: {
      sm: {
        shadowColor: colors.light.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      md: {
        shadowColor: colors.light.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      lg: {
        shadowColor: colors.light.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    },
  }),
  dark: Platform.select({
    ios: {
      sm: {
        shadowColor: colors.dark.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      md: {
        shadowColor: colors.dark.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      lg: {
        shadowColor: colors.dark.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    },
    android: {
      sm: { elevation: 2 },
      md: { elevation: 4 },
      lg: { elevation: 8 },
    },
    default: {
      sm: {
        shadowColor: colors.dark.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      md: {
        shadowColor: colors.dark.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      lg: {
        shadowColor: colors.dark.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    },
  }),
};

export const getTheme = (themeType: ThemeType) => {
  return {
    colors: colors[themeType],
    spacing,
    fontSizes,
    fontWeights,
    borderRadius,
    shadows: shadows[themeType],
    themeType, // Include the theme type in the theme object
  };
};