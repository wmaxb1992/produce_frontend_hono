import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';

interface BorderBeamProps {
  duration?: number;
  delay?: number;
  size?: number;
  color?: string;
  style?: ViewStyle;
  thickness?: number;
  opacity?: number;
}

export const BorderBeam = ({
  duration = 6,
  delay = 0,
  size = 400,
  color = '#FF4500',
  style,
  thickness = 2,
  opacity = 0.7
}: BorderBeamProps) => {
  const rotation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Add delay before starting animation
    const delayTimer = setTimeout(() => {
      // Create infinite rotation animation
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: duration * 1000,
          useNativeDriver: true,
        })
      ).start();
    }, delay * 1000);
    
    return () => clearTimeout(delayTimer);
  }, [rotation, duration, delay]);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.beam,
          {
            width: size,
            height: size,
            borderColor: color,
            borderWidth: thickness,
            opacity: opacity,
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 5,
            transform: [{ rotate: rotateInterpolation }]
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 0,
    pointerEvents: 'none',
  },
  beam: {
    position: 'absolute',
    borderRadius: 500,
    borderStyle: 'solid',
  }
});

export default BorderBeam; 