import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Variety } from '@/types';
import useThemeStore, { defaultColors } from '@/store/useThemeStore';
import useProductStore from '@/store/useProductStore';

interface VarietyChipProps {
  variety: Variety;
  isSelected: boolean;
}

const VarietyChip: React.FC<VarietyChipProps> = ({ variety, isSelected }) => {
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: defaultColors };
  const colors = theme.colors || defaultColors;
  
  const { setSelectedVariety } = useProductStore();
  
  const handlePress = () => {
    setSelectedVariety(isSelected ? null : variety.id);
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: isSelected ? colors.primary || defaultColors.primary : colors.card || defaultColors.card,
          borderColor: isSelected ? colors.primary || defaultColors.primary : colors.border || defaultColors.border,
        }
      ]}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <Text style={styles.emoji}>{variety.emoji}</Text>
      <Text 
        style={[
          styles.name, 
          { color: isSelected ? colors.white || defaultColors.white : colors.text || defaultColors.text }
        ]}
        numberOfLines={2}
      >
        {variety.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 64,  // 80 * 0.8
    height: 64, // 80 * 0.8
    borderRadius: 10,  // 12 * 0.8
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  name: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default VarietyChip;