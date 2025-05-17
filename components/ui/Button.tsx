import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import useThemeStore from '@/store/useThemeStore';
import { getTheme } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  children,
  disabled,
  ...rest
}) => {
  // Get the entire store instead of destructuring
  const themeStore = useThemeStore();
  // Get theme values safely
  const currentTheme = themeStore.theme || getTheme(themeStore.themeType || 'light');
  const { colors, borderRadius, spacing } = currentTheme;

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return colors.white;
      case 'outline':
      case 'ghost':
        return colors.primary;
      default:
        return colors.white;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.md,
          borderRadius: borderRadius.sm,
        };
      case 'md':
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: borderRadius.md,
        };
      case 'lg':
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          borderRadius: borderRadius.md,
        };
      default:
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: borderRadius.md,
        };
    }
  };

  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'sm':
        return { fontSize: 14 };
      case 'md':
        return { fontSize: 16 };
      case 'lg':
        return { fontSize: 18 };
      default:
        return { fontSize: 16 };
    }
  };

  const buttonStyles = [
    styles.button,
    getVariantStyles(),
    getSizeStyles(),
    disabled && { opacity: 0.6 },
    style,
  ];

  const textStyles = [
    styles.text,
    getTextSize(),
    { color: getTextColor() },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={isLoading || disabled}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={textStyles}>{children}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;