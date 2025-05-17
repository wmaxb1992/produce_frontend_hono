import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp, Info } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';

interface NutrientInfo {
  name: string;
  amount: string;
  dailyValue?: string;
}

interface NutritionalInfoProps {
  servingSize: string;
  calories: number;
  nutrients: {
    macros: NutrientInfo[];
    vitamins: NutrientInfo[];
    minerals: NutrientInfo[];
  };
  style?: any;
}

export const NutritionalInfo = ({
  servingSize,
  calories,
  nutrients,
  style,
}: NutritionalInfoProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Info size={20} color={theme.colors.primary} style={styles.icon} />
          <Text style={styles.title}>Nutritional Information</Text>
        </View>
        {expanded ? (
          <ChevronUp size={20} color={theme.colors.text} />
        ) : (
          <ChevronDown size={20} color={theme.colors.text} />
        )}
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <View style={styles.servingInfo}>
            <Text style={styles.servingText}>Serving Size: {servingSize}</Text>
            <Text style={styles.caloriesText}>{calories} Calories</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Macronutrients</Text>
          {nutrients.macros.map((nutrient, index) => (
            <View key={index} style={styles.nutrientRow}>
              <Text style={styles.nutrientName}>{nutrient.name}</Text>
              <View style={styles.nutrientValues}>
                <Text style={styles.nutrientAmount}>{nutrient.amount}</Text>
                {nutrient.dailyValue && (
                  <Text style={styles.dailyValue}>{nutrient.dailyValue}%</Text>
                )}
              </View>
            </View>
          ))}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Vitamins</Text>
          {nutrients.vitamins.map((nutrient, index) => (
            <View key={index} style={styles.nutrientRow}>
              <Text style={styles.nutrientName}>{nutrient.name}</Text>
              <View style={styles.nutrientValues}>
                <Text style={styles.nutrientAmount}>{nutrient.amount}</Text>
                {nutrient.dailyValue && (
                  <Text style={styles.dailyValue}>{nutrient.dailyValue}%</Text>
                )}
              </View>
            </View>
          ))}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Minerals</Text>
          {nutrients.minerals.map((nutrient, index) => (
            <View key={index} style={styles.nutrientRow}>
              <Text style={styles.nutrientName}>{nutrient.name}</Text>
              <View style={styles.nutrientValues}>
                <Text style={styles.nutrientAmount}>{nutrient.amount}</Text>
                {nutrient.dailyValue && (
                  <Text style={styles.dailyValue}>{nutrient.dailyValue}%</Text>
                )}
              </View>
            </View>
          ))}

          <Text style={styles.disclaimer}>
            * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
          </Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      overflow: 'hidden',
      marginVertical: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    content: {
      padding: 16,
      paddingTop: 0,
    },
    servingInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    servingText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    caloriesText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.gray[200],
      marginVertical: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    nutrientRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    nutrientName: {
      fontSize: 14,
      color: theme.colors.text,
    },
    nutrientValues: {
      flexDirection: 'row',
    },
    nutrientAmount: {
      fontSize: 14,
      color: theme.colors.text,
      marginRight: 8,
    },
    dailyValue: {
      fontSize: 14,
      color: theme.colors.gray[500],
    },
    disclaimer: {
      fontSize: 12,
      color: theme.colors.gray[500],
      fontStyle: 'italic',
      marginTop: 16,
    },
  });

export default NutritionalInfo;