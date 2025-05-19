import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import useThemeStore from '@/store/useThemeStore';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import defaultColors from '@/constants/colors';
import SubscriptionBundleCard from '@/components/subscription/SubscriptionBundleCard';

interface SubscriptionBundlesSectionProps {
  style?: any;
}

const SubscriptionBundlesSection: React.FC<SubscriptionBundlesSectionProps> = ({ style }) => {
  const router = useRouter();
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;
  const { bundles } = useSubscriptionStore();

  const handleBundlePress = (bundleId: string) => {
    // We'll create this screen later
    router.push({
      pathname: "/subscription/[id]",
      params: { id: bundleId }
    } as any);
  };

  if (!bundles.length) return null;

  return (
    <View style={[styles.section, style]}>
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
        Subscription Bundles
      </Text>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bundlesContainer}
        contentContainerStyle={styles.bundlesContent}
      >
        {bundles.map(bundle => (
          <SubscriptionBundleCard 
            key={bundle.id}
            bundle={bundle}
            onPress={() => handleBundlePress(bundle.id)}
            style={undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  bundlesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  bundlesContent: {
    paddingRight: 16,
  }
});

export default SubscriptionBundlesSection; 