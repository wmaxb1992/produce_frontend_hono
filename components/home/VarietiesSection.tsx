import React from 'react';
import { View, ScrollView } from 'react-native';
import VarietyChip from '@/components/product/VarietyChip';
import { varietiesSectionStyles } from '@/styles/components/home/varietiesSection';
import type { Variety } from '@/types';

interface VarietiesSectionProps {
  varieties: Variety[];
  selectedVariety: string | null;
}

const VarietiesSection: React.FC<VarietiesSectionProps> = ({
  varieties,
  selectedVariety,
}) => {
  if (!varieties.length) return null;

  return (
    <View style={[varietiesSectionStyles.section, { marginTop: 0 }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={varietiesSectionStyles.container}
      >
        {varieties.map((variety: Variety) => (
          <VarietyChip
            key={variety.id}
            variety={variety}
            isSelected={selectedVariety === variety.id}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default VarietiesSection; 