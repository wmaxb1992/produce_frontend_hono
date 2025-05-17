import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import useThemeStore from '@/store/useThemeStore';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors, borderRadius } = theme;

  const getVariantColors = (): { bg: string; text: string } => {
    switch (variant) {
      case 'primary':
        return { bg: colors.primary, text: colors.white };
      case 'secondary':
        return { bg: colors.secondary, text: colors.white };
      case 'success':
        return { bg: colors.success, text: colors.white };
      case 'error':
        return { bg: colors.error, text: colors.white };
      case 'warning':
        return { bg: colors.warning, text: colors.black };
      case 'info':
        return { bg: colors.info, text: colors.white };
      default:
        return { bg: colors.gray[200], text: colors.gray[800] };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: borderRadius.xs,
          },
          text: { fontSize: 10 },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: borderRadius.md,
          },
          text: { fontSize: 14 },
        };
      default: // md
        return {
          container: {
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: borderRadius.sm,
          },
          text: { fontSize: 12 },
        };
    }
  };

  const variantColors = getVariantColors();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: variantColors.bg },
        sizeStyles.container,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: variantColors.text },
          sizeStyles.text,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
  },
});

export default Badge;