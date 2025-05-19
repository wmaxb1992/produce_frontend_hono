import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Leaf, Apple, Flower2, Calendar, Clock, Check, Info, ShoppingBag } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import useCartStore from '@/store/useCartStore';
import defaultColors from '@/constants/colors';
import RoundButton from '@/components/ui/RoundButton';
import { RadioButton } from '@/components/ui/RadioButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SubscriptionBundle } from '@/types';

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme?.colors || defaultColors.light;
  const { bundles } = useSubscriptionStore();
  const { addItem } = useCartStore();
  
  const [bundle, setBundle] = useState<SubscriptionBundle | null>(null);
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [deliveryDay, setDeliveryDay] = useState<string>('Wednesday');
  
  // Find the bundle based on the id
  useEffect(() => {
    if (id && bundles.length > 0) {
      const foundBundle = bundles.find(b => b.id === id);
      if (foundBundle) {
        setBundle(foundBundle);
      }
    }
  }, [id, bundles]);
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleSubscribe = () => {
    if (bundle) {
      // Add the subscription bundle to cart
      addItem({
        id: bundle.id,
        name: `${frequency === 'weekly' ? 'Weekly' : 'Monthly'} ${bundle.name}`,
        price: frequency === 'weekly' ? bundle.weeklyPrice : bundle.monthlyPrice,
        image: bundle.image,
        quantity: 1,
        type: 'subscription',
        metadata: {
          frequency,
          deliveryDay,
          bundleId: bundle.id
        }
      }, 1);
      
      // Navigate to checkout
      router.push('/checkout');
    }
  };
  
  if (!bundle) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }
  
  const price = frequency === 'weekly' ? bundle.weeklyPrice : bundle.monthlyPrice;
  const regularPrice = bundle.price;
  const savings = regularPrice - price;
  const savingsPercentage = Math.round((savings / regularPrice) * 100);
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.card }]} 
            onPress={handleGoBack}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: bundle.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.discountText}>Save {bundle.discountPercentage}%</Text>
            </View>
          </View>
          
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>{bundle.name}</Text>
            
            {bundle.farmName && (
              <Text style={[styles.farmName, { color: colors.subtext }]}>
                From {bundle.farmName}
              </Text>
            )}
            
            <Text style={[styles.description, { color: colors.text }]}>
              {bundle.description}
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={[styles.statItem, { backgroundColor: colors.success + '10' }]}>
                <Leaf size={18} color={colors.success} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {bundle.items.vegetables}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>
                  Vegetables
                </Text>
              </View>
              
              <View style={[styles.statItem, { backgroundColor: colors.warning + '10' }]}>
                <Apple size={18} color={colors.warning} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {bundle.items.fruits}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>
                  Fruits
                </Text>
              </View>
              
              <View style={[styles.statItem, { backgroundColor: colors.info + '10' }]}>
                <Flower2 size={18} color={colors.info} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {bundle.items.herbs}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>
                  Herbs
                </Text>
              </View>
            </View>
            
            <View style={[styles.section, styles.subscriptionSection]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Subscription Options
              </Text>
              
              <View style={styles.optionContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  Delivery Frequency
                </Text>
                
                <SegmentedControl
                  options={[
                    { label: 'Weekly', value: 'weekly' },
                    { label: 'Monthly', value: 'monthly' }
                  ]}
                  selectedValue={frequency}
                  onChange={(value: string) => setFrequency(value as 'weekly' | 'monthly')}
                  style={{ marginTop: 8 }}
                />
              </View>
              
              <View style={styles.optionContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  Delivery Day
                </Text>
                
                <View style={styles.radioGroup}>
                  {['Monday', 'Wednesday', 'Friday'].map((day) => (
                    <RadioButton
                      key={day}
                      label={day}
                      selected={deliveryDay === day}
                      onSelect={() => setDeliveryDay(day)}
                    />
                  ))}
                </View>
              </View>
              
              <View style={[styles.pricingCard, { backgroundColor: colors.card }]}>
                <View style={styles.pricingRow}>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.priceLabel, { color: colors.subtext }]}>
                      {frequency === 'weekly' ? 'Weekly Price' : 'Monthly Price'}
                    </Text>
                    <Text style={[styles.price, { color: colors.text }]}>
                      ${price.toFixed(2)}
                    </Text>
                  </View>
                  
                  <View style={styles.savingsContainer}>
                    <Text style={[styles.savingsLabel, { color: colors.subtext }]}>
                      Regular Price
                    </Text>
                    <Text style={[styles.regularPrice, { color: colors.error }]}>
                      ${regularPrice.toFixed(2)}
                    </Text>
                  </View>
                </View>
                
                <View style={[styles.savingsBadge, { backgroundColor: colors.success + '20' }]}>
                  <Text style={[styles.savingsText, { color: colors.success }]}>
                    You save ${savings.toFixed(2)} ({savingsPercentage}%)
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                What's Included
              </Text>
              
              <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <View style={styles.infoRow}>
                  <Calendar size={18} color={colors.primary} style={styles.infoIcon} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    {frequency === 'weekly' ? 'Weekly' : 'Monthly'} delivery on {deliveryDay}s
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Clock size={18} color={colors.primary} style={styles.infoIcon} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Flexible subscription - skip, pause, or cancel anytime
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Check size={18} color={colors.primary} style={styles.infoIcon} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Peak freshness guaranteed, harvested within 24-48 hours
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Info size={18} color={colors.primary} style={styles.infoIcon} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Contents may vary slightly based on seasonal availability
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.bundleItems, { color: colors.text }]}>
                Current Bundle Contents:
              </Text>
              
              {/* This would ideally map through actual product data */}
              <View style={styles.productsContainer}>
                <ProductRow name="Carrots" quantity="1 bunch" />
                <ProductRow name="Red Potatoes" quantity="1.5 lbs" />
                <ProductRow name="Cucumbers" quantity="2 medium" />
                <ProductRow name="Broccoli" quantity="1 head" />
                <ProductRow name="Yellow Squash" quantity="2 medium" />
                <ProductRow name="Zucchini" quantity="2 medium" />
                <ProductRow name="Lettuce" quantity="1 head" />
                <ProductRow name="Fennel" quantity="1 bulb" />
                <ProductRow name="Bok Choy" quantity="1 bunch" />
                <ProductRow name="Kohlrabi" quantity="1 medium" />
                {bundle.items.herbs > 0 && <ProductRow name="Fresh Herbs" quantity="assorted" />}
              </View>
            </View>
          </View>
        </ScrollView>
        
        <View style={[styles.bottomBar, { backgroundColor: colors.card }]}>
          <View style={styles.priceColumn}>
            <Text style={[styles.bottomPrice, { color: colors.text }]}>
              ${price.toFixed(2)}
            </Text>
            <Text style={[styles.bottomPriceLabel, { color: colors.subtext }]}>
              per {frequency === 'weekly' ? 'week' : 'month'}
            </Text>
          </View>
          
          <RoundButton 
            onPress={handleSubscribe}
            label="Subscribe Now"
            icon={<ShoppingBag size={18} color="white" />}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </>
  );
}

// Define ProductRow component inline
const ProductRow = ({ name, quantity }: { name: string; quantity: string }) => {
  const { theme } = useThemeStore();
  const colors = theme?.colors || defaultColors.light;
  
  return (
    <View style={styles.productRow}>
      <Text style={[styles.productName, { color: colors.text }]}>{name}</Text>
      <Text style={[styles.productQuantity, { color: colors.subtext }]}>{quantity}</Text>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 210,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  farmName: {
    fontSize: 16,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    width: (width - 48) / 3,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    marginTop: 24,
  },
  subscriptionSection: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionContainer: {
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  radioGroup: {
    marginTop: 8,
  },
  pricingCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceContainer: {},
  priceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  savingsContainer: {
    alignItems: 'flex-end',
  },
  savingsLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  regularPrice: {
    fontSize: 18,
    fontWeight: '500',
    textDecorationLine: 'line-through',
  },
  savingsBadge: {
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  bundleItems: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  productsContainer: {
    marginTop: 8,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  productName: {
    fontSize: 14,
  },
  productQuantity: {
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  priceColumn: {
    marginRight: 16,
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  bottomPriceLabel: {
    fontSize: 12,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
}); 