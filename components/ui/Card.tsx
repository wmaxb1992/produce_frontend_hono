import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import useThemeStore from '@/store/useThemeStore';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  variant = 'elevated'
}) => {
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors, borderRadius, shadows } = theme;

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.card,
          ...shadows.md,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          backgroundColor: colors.gray[100],
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: colors.card,
          ...shadows.md,
          borderWidth: 0,
        };
    }
  };

  return (
    <View 
      style={[
        styles.card, 
        { borderRadius: borderRadius.md },
        getVariantStyle(),
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    overflow: 'hidden',
  },
});

export default Card;