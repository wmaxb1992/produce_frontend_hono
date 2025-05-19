import React, { useEffect } from 'react';
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
  let theme: any, themeColors: any;
  let bundles: any[] = [];
  let fetchBundles: any;
  
  try {
    const themeStore = useThemeStore();
    theme = themeStore?.theme;
    themeColors = theme?.colors || defaultColors.light;
  } catch (error) {
    console.warn("Error using theme store in SubscriptionBundlesSection:", error);
    themeColors = defaultColors.light;
  }
  
  try {
    const subscriptionStore = useSubscriptionStore();
    bundles = subscriptionStore?.bundles || [];
    fetchBundles = subscriptionStore?.fetchBundles;
  } catch (error) {
    console.warn("Error using subscription store in SubscriptionBundlesSection:", error);
  }

  // Add useEffect to fetch bundles if they're not already loaded
  useEffect(() => {
    if (bundles.length === 0 && typeof fetchBundles === 'function') {
      console.log("Fetching bundles from inside SubscriptionBundlesSection");
      fetchBundles().catch((err: Error) => console.error("Error fetching bundles:", err));
    }
  }, [bundles.length, fetchBundles]);

  const handleBundlePress = (bundleId: string) => {
    // We'll create this screen later
    router.push({
      pathname: "/subscription/[id]",
      params: { id: bundleId }
    } as any);
  };

  // Debug: Check if bundles is actually empty
  console.log("Subscription bundles:", bundles);
  
  // Return null only if bundles is empty - but add debug info first
  if (!bundles || !bundles.length) {
    console.warn("No subscription bundles available");
    return (
      <View style={[styles.section, style]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Subscription Bundles
        </Text>
        <View style={{padding: 16}}>
          <Text style={{color: themeColors.text}}>Loading bundles...</Text>
        </View>
      </View>
    );
  }

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