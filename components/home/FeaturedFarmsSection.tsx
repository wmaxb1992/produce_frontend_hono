import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';
import FarmCard from '@/components/farm/FarmCard';
import { farmsSectionStyles } from '@/styles/components/home/farmsSection';
import type { Farm } from '@/types';

interface FeaturedFarmsSectionProps {
  farms: Farm[];
}

const FeaturedFarmsSection: React.FC<FeaturedFarmsSectionProps> = ({ farms }) => {
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;

  if (!farms.length) return null;

  return (
    <View style={farmsSectionStyles.section}>
      <Text style={[farmsSectionStyles.sectionTitle, { color: themeColors.text }]}>
        Featured Farms
      </Text>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={farmsSectionStyles.farmsContainer}
      >
        {farms.map(farm => (
          <FarmCard 
            key={farm.id}
            farm={farm}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default FeaturedFarmsSection; 