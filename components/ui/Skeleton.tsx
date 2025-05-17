import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { useTheme } from '@/store/useThemeStore';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}: SkeletonProps) => {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  
  const translateX = useSharedValue(-300);
  
  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming(300, { 
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      -1,
      false
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  
  const baseColor = isDark ? theme.colors.gray[800] : theme.colors.gray[200];
  const highlightColor = isDark ? theme.colors.gray[700] : theme.colors.gray[100];
  
  return (
    <View 
      style={[
        styles.container, 
        { width, height, borderRadius },
        style
      ]}
    >
      <Animated.View style={[styles.shimmer, animatedStyle]}>
        <LinearGradient
          colors={[baseColor, highlightColor, baseColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

export const ProductCardSkeleton = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={styles.productCard}>
      <Skeleton height={160} borderRadius={8} />
      <View style={styles.productContent}>
        <Skeleton width="70%" height={18} style={styles.mb8} />
        <Skeleton width="40%" height={16} style={styles.mb8} />
        <Skeleton width="60%" height={16} style={styles.mb8} />
        <Skeleton width="30%" height={20} />
      </View>
    </View>
  );
};

export const FarmCardSkeleton = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={styles.farmCard}>
      <Skeleton height={120} borderRadius={8} />
      <View style={styles.farmContent}>
        <Skeleton width="80%" height={18} style={styles.mb8} />
        <Skeleton width="60%" height={16} style={styles.mb8} />
        <Skeleton width="90%" height={14} />
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.isDark ? theme.colors.gray[800] : theme.colors.gray[200],
      overflow: 'hidden',
    },
    shimmer: {
      width: '100%',
      height: '100%',
    },
    gradient: {
      flex: 1,
    },
    productCard: {
      borderRadius: 8,
      backgroundColor: theme.colors.card,
      overflow: 'hidden',
      marginBottom: 16,
    },
    productContent: {
      padding: 12,
    },
    farmCard: {
      borderRadius: 8,
      backgroundColor: theme.colors.card,
      overflow: 'hidden',
      marginBottom: 16,
    },
    farmContent: {
      padding: 12,
    },
    mb8: {
      marginBottom: 8,
    },
  });

export default Skeleton;