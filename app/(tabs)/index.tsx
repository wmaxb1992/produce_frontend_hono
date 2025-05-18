import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Image, Animated, StyleSheet, Easing, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Filter, Plus, Minus, Grid, List, ArrowUp, Home } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import useThemeStore from '@/store/useThemeStore';
import useProductStore from '@/store/useProductStore';
import useFarmStore from '@/store/useFarmStore';
import defaultColors from '@/constants/colors';
import type { Category, Subcategory, Variety, Product, Farm, FarmPost } from '@/types';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import ProductCard from '@/components/product/ProductCard';
import FarmPostCard from '@/components/farm/FarmPostCard';
import { homeStyles } from '@/styles/layouts/home';
import { 
  Skeleton, 
  ProductCardSkeleton, 
  FarmCardSkeleton,
  CategoryCardSkeleton,
  BannerSkeleton,
  AddressBarSkeleton,
  SearchBarSkeleton
} from '@/components/ui/Skeleton';

// Import our extracted components
import AddressBar from '@/components/home/AddressBar';
import SearchBar from '@/components/home/SearchBar';
import MagicBasketBanner from '@/components/home/MagicBasketBanner';
import CategoriesSection from '@/components/home/CategoriesSection';
import SubcategoriesSection from '@/components/home/SubcategoriesSection';
import VarietiesSection from '@/components/home/VarietiesSection';
import FeaturedFarmsSection from '@/components/home/FeaturedFarmsSection';

// Local styles for components not yet moved to separate style files
const styles = StyleSheet.create({
  container: homeStyles.container,
  filterButton: {
    marginLeft: 8,
  },
  section: {
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
    marginHorizontal: -16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  viewToggle: {
    padding: 8,
  },
  featuredContainer: {
    marginLeft: -16,
  },
  featuredContent: {
    paddingHorizontal: 6,
    gap: 16,
  },
  featuredCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  featuredImageStepper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 8,
  },
  stepper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    overflow: 'hidden',
    paddingHorizontal: 4,
  },
  stepperButton: {
    padding: 2,
  },
  stepperText: {
    paddingHorizontal: 4,
    alignSelf: 'center',
  },
  featuredInfo: {
    padding: 8,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  featuredMeta: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  featuredRating: {
    fontSize: 12,
    color: '#666',
  },
  featuredTime: {
    fontSize: 12,
    color: '#666',
  },
  farmInfo: {
    marginBottom: 8,
  },
  farmName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  farmLocation: {
    fontSize: 11,
    color: '#666',
  },
  addToCartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  filteredProductsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
  },
  filteredProductCard: {
    width: '31%',
    marginBottom: 12,
  },
  varietyListContainer: {
    paddingHorizontal: 16,
  },
  varietySection: {
    marginBottom: 16,
  },
  varietyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  varietyCount: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  varietyRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  varietyName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  varietyDescription: {
    fontSize: 14,
    color: '#666',
  },
  // Header styles
  headerContainer: {
    backgroundColor: 'white',
    paddingTop: 8, 
    paddingBottom: 0,
    borderBottomWidth: 0,
    borderBottomColor: '#E5E5E5',
  },
  addressBarWrapper: {
    marginBottom: 8,
  },
  searchBarWrapper: {
    marginBottom: 4,
    paddingTop: 0,
  },
  mainContainer: {
    flex: 1,
  },
  mainContent: {
    paddingTop: 8,
  }
});

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const router = useRouter();
  const { theme, themeType } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;
  const isDark = themeType === 'dark';
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAddressVisible, setIsAddressVisible] = useState(true);
  
  // Add loading state to force skeleton to show for a minimum time
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  
  // Get data and loading states from stores
  const { 
    products,
    categories,
    isLoading: isProductsLoading,
    fetchProducts
  } = useProductStore();
  
  const {
    farms,
    farmPosts,
    isLoading: isFarmsLoading,
    fetchFarmData
  } = useFarmStore();

  // Check if everything is loading
  const isLoading = isProductsLoading || isFarmsLoading || isLocalLoading;

  // Log loading states for debugging
  useEffect(() => {
    console.log('Loading states:', { 
      isProductsLoading, 
      isFarmsLoading, 
      isLocalLoading, 
      isLoading 
    });
  }, [isProductsLoading, isFarmsLoading, isLocalLoading, isLoading]);

  // Fetch data on mount
  useEffect(() => {
    fetchProducts();
    fetchFarmData();
    
    // Force the loading state to show for at least 2 seconds
    const timer = setTimeout(() => {
      setIsLocalLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [fetchProducts, fetchFarmData]);

  // Create floating animation
  useEffect(() => {
    const floatLoop = () => {
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start(() => floatLoop());
    };

    floatLoop();
    return () => {
      floatingAnim.setValue(0);
    };
  }, []);

  const animatedStyle = {
    transform: [{
      translateY: floatingAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -15],
      })
    }]
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [freshProducts, setFreshProducts] = useState<Product[]>([]);
  const [preHarvestProducts, setPreHarvestProducts] = useState<Product[]>([]);
  const [inSeasonProducts, setInSeasonProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isListView, setIsListView] = useState(true);

  const getFreshProducts = useCallback(() => {
    return products.filter(product => product.freshness != null && product.freshness >= 90 && product.inStock);
  }, [products]);

  const getPreHarvestProducts = useCallback(() => {
    return products.filter(product => product.preHarvest);
  }, [products]);

  const getInSeasonProducts = useCallback(() => {
    return products.filter(product => product.inSeason);
  }, [products]);

  // Update filtered products when filters change
  useEffect(() => {
    let filtered = [...products];
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (selectedSubcategory) {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }
    
    if (selectedVariety) {
      filtered = filtered.filter(product => product.variety === selectedVariety);
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, selectedSubcategory, selectedVariety, products]);

  useEffect(() => {
    setFreshProducts(getFreshProducts());
    setPreHarvestProducts(getPreHarvestProducts());
    setInSeasonProducts(getInSeasonProducts());
  }, [getFreshProducts, getPreHarvestProducts, getInSeasonProducts]);

  // Get the selected category object
  const selectedCategoryObj = selectedCategory
    ? categories.find(cat => cat.id === selectedCategory)
    : null;

  // Get subcategories for the selected category
  const subcategories = selectedCategoryObj?.subcategories ?? [];

  // Get the selected subcategory object
  const selectedSubcategoryObj = selectedSubcategory
    ? subcategories.find(sub => sub.id === selectedSubcategory)
    : null;

  // Get varieties for the selected subcategory
  const varieties = selectedSubcategoryObj?.varieties ?? [];

  const handleClearFilters = () => {
    console.log('Clearing all filters');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedVariety(null);
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setSelectedVariety(null);
  };

  const handleSubcategoryPress = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    setSelectedVariety(null);
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleFarmPress = (farmId: string) => {
    router.push(`/farm/${farmId}`);
  };

  const handlePostPress = (postId: string) => {
    // Navigate to post detail or farm page
    const post = farmPosts.find((p: FarmPost) => p.id === postId);
    if (post) {
      router.push(`/farm/${post.farmId}`);
    }
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    if (scrollPosition > 20 && isAddressVisible) {
      setIsAddressVisible(false);
    } else if (scrollPosition <= 20 && !isAddressVisible) {
      setIsAddressVisible(true);
    }
  };

  // Skeleton loaders for each section
  const renderSkeletonLoader = () => {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        {/* Address and Search Bar Skeleton */}
        <View style={[styles.headerContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.addressBarWrapper}>
            <AddressBarSkeleton />
          </View>
          <View style={styles.searchBarWrapper}>
            <SearchBarSkeleton />
          </View>
        </View>

        {/* Main content */}
        <ScrollView contentContainerStyle={styles.mainContent}>
          {/* Magic Basket Banner Skeleton */}
          <BannerSkeleton />

          {/* Categories Skeleton */}
          <View style={styles.section}>
            <Skeleton height={24} width={120} style={{ marginHorizontal: 16, marginBottom: 12 }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <CategoryCardSkeleton key={index} />
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Featured Farms Skeleton */}
          <View style={styles.section}>
            <Skeleton height={24} width={150} style={{ marginHorizontal: 16, marginBottom: 12 }} />
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.featuredContainer}
              contentContainerStyle={styles.featuredContent}
            >
              {[1, 2, 3].map((_, index) => (
                <FarmCardSkeleton key={index} />
              ))}
            </ScrollView>
          </View>

          {/* Fresh Picks Skeleton */}
          <View style={styles.section}>
            <Skeleton height={24} width={120} style={{ marginHorizontal: 16, marginBottom: 12 }} />
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.featuredContainer}
              contentContainerStyle={styles.featuredContent}
            >
              {[1, 2, 3, 4].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </ScrollView>
          </View>

          {/* Farm Posts Skeleton */}
          <View style={styles.section}>
            <Skeleton height={24} width={150} style={{ marginHorizontal: 16, marginBottom: 12 }} />
            {[1, 2].map((_, index) => (
              <View key={index} style={{ marginHorizontal: 16, marginBottom: 16 }}>
                <Skeleton height={200} width="100%" borderRadius={8} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  if (isLoading) {
    return renderSkeletonLoader();
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor: themeColors.background }]}>
      {/* Fixed header with proper spacing that doesn't shift */}
      <View style={[styles.headerContainer, { backgroundColor: themeColors.background }]}>
        {isAddressVisible && (
          <View style={styles.addressBarWrapper}>
            <AddressBar address="123 Market St, San Francisco, CA 94105" />
          </View>
        )}
        <View style={[
          styles.searchBarWrapper,
          !isAddressVisible && { marginTop: 55 }
        ]}>
          <SearchBar onPress={handleSearchPress} />
        </View>
      </View>

      {/* Main content */}
      <ScrollView
        ref={scrollViewRef}
        style={[styles.container, { backgroundColor: themeColors.background }]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.mainContent}
      >
        {/* Magic Basket Banner */}
        <MagicBasketBanner />

        {/* Categories */}
        <CategoriesSection 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryPress={handleCategoryPress}
          onClearFilters={handleClearFilters}
        />

        {/* Subcategories - Only show if a category is selected */}
        {selectedCategory && subcategories.length > 0 && (
          <SubcategoriesSection 
            subcategories={subcategories}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryPress={handleSubcategoryPress}
          />
        )}

        {/* Varieties - Only show if a subcategory is selected and not in list view */}
        {selectedSubcategory && varieties.length > 0 && !isListView && (
          <VarietiesSection 
            varieties={varieties}
            selectedVariety={selectedVariety}
          />
        )}
        
        {/* Featured Farms - Only show when no category is selected */}
        {!selectedCategory && farms.length > 0 && (
          <FeaturedFarmsSection farms={farms} />
        )}
        
        {/* Fresh Picks - Only show when no category is selected */}
        {!selectedCategory && freshProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                Fresh Picks
              </Text>
            </View>
            
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.featuredContainer}
              contentContainerStyle={styles.featuredContent}
            >
              {freshProducts.map(product => (
                <TouchableOpacity 
                  key={product.id} 
                  style={styles.featuredCard}
                  onPress={() => handleProductPress(product.id)}
                >
                  <View>
                    <Image
                      source={{ uri: product.image }}
                      style={styles.featuredImage}
                    />
                    <View style={styles.featuredImageStepper}>
                      <View style={styles.stepper}>
                        <TouchableOpacity 
                          style={styles.stepperButton}
                          onPress={() => {
                            // Handle decrease quantity
                          }}
                        >
                          <Minus size={16} color={themeColors.text} />
                        </TouchableOpacity>
                        <Text style={styles.stepperText}>1</Text>
                        <TouchableOpacity 
                          style={styles.stepperButton}
                          onPress={() => {
                            // Handle increase quantity
                          }}
                        >
                          <Plus size={16} color={themeColors.text} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredTitle} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <View style={styles.featuredMeta}>
                      <Text style={styles.featuredRating}>
                        {product.rating} ★ ({product.reviewCount})
                      </Text>
                      <Text style={styles.featuredTime}>
                        • {Math.round(Math.random() * 20 + 20)} min
                      </Text>
                    </View>
                    <View style={styles.farmInfo}>
                      <Text style={styles.farmName}>{product.farmName}</Text>
                      <Text style={styles.farmLocation}>San Francisco, CA</Text>
                    </View>
                    
                    <View style={styles.addToCartContainer}>
                      <Text style={styles.featuredPrice}>
                        ${product.price.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {/* Pre-Harvest Products - Only show when no category is selected */}
        {!selectedCategory && preHarvestProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Coming Soon (Pre-Harvest)
            </Text>
            
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.featuredContainer}
              contentContainerStyle={styles.featuredContent}
            >
              {preHarvestProducts.map(product => (
                <TouchableOpacity 
                  key={product.id} 
                  style={styles.featuredCard}
                  onPress={() => handleProductPress(product.id)}
                >
                  <View>
                    <Image
                      source={{ uri: product.image }}
                      style={styles.featuredImage}
                    />
                    <View style={styles.featuredImageStepper}>
                      <View style={[styles.stepper, { backgroundColor: '#e8f5e9' }]}>
                        <Text style={[styles.stepperText, { color: '#43a047' }]}>Reserve</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredTitle} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <View style={styles.featuredMeta}>
                      <Text style={styles.featuredRating}>
                        Available in {product.estimatedHarvestDate ? Math.ceil((new Date(product.estimatedHarvestDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : '?'} days
                      </Text>
                    </View>
                    <View style={styles.farmInfo}>
                      <Text style={styles.farmName}>{product.farmName}</Text>
                      <Text style={styles.farmLocation}>San Francisco, CA</Text>
                    </View>
                    
                    <View style={styles.addToCartContainer}>
                      <Text style={styles.featuredPrice}>
                        ${product.price.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {/* Filtered Products - Show when a filter is applied */}
        {(selectedCategory || selectedSubcategory || selectedVariety) && (
          <View style={styles.section}>
            <View style={[styles.separator, { backgroundColor: themeColors.border }]} />
            <View style={[styles.sectionHeader, { marginHorizontal: 16 }]}>
              <Text style={[styles.sectionTitle, { marginHorizontal: 0, marginBottom: 0 }]}>
                {filteredProducts.length} Products
              </Text>
              <TouchableOpacity
                onPress={() => setIsListView(!isListView)}
                style={styles.viewToggle}
              >
                {isListView ? (
                  <Grid size={24} color={themeColors.text} />
                ) : (
                  <List size={24} color={themeColors.text} />
                )}
              </TouchableOpacity>
            </View>
            
            {isListView ? (
              <ScrollView
                style={styles.varietyListContainer}
                showsVerticalScrollIndicator={false}
              >
                {subcategories.map(subcategory => (
                  <View key={subcategory.id} style={styles.varietySection}>
                    <Text style={[styles.varietyTitle, { color: themeColors.text }]}>
                      {subcategory.name}
                    </Text>
                    <Text style={styles.varietyCount}>
                      {subcategory.varieties?.length || 0} varieties
                    </Text>
                    {subcategory.varieties?.map(variety => (
                      <TouchableOpacity
                        key={variety.id}
                        style={styles.varietyRow}
                        onPress={() => {
                          setSelectedSubcategory(subcategory.id);
                          // You might want to handle variety selection here
                        }}
                      >
                        <Text style={[styles.varietyName, { color: themeColors.text }]}>
                          {variety.emoji} {variety.name}
                        </Text>
                        <Text style={styles.varietyDescription}>
                          {variety.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.filteredProductsContainer}>
                {filteredProducts.map(product => (
                  <View key={product.id} style={styles.filteredProductCard}>
                    <ProductCard 
                      product={product}
                      onPress={() => handleProductPress(product.id)}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        
        {/* From the Farms - Only show when no category is selected */}
        {!selectedCategory && farmPosts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              From the Farms
            </Text>
            
            {farmPosts.slice(0, 3).map(post => (
              <FarmPostCard 
                key={post.id}
                post={post}
                onPress={() => handlePostPress(post.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Home Button at the bottom */}
      <Animated.View style={[
        homeStyles.floatingHomeButton, 
        animatedStyle
      ]}>
        <BlurView intensity={30} tint={isDark ? "dark" : "light"} style={homeStyles.blurContainer} />
        <TouchableOpacity
          style={homeStyles.buttonContent}
          onPress={() => {
            // Scroll to top and reset scroll position
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          }}
        >
          <ArrowUp size={20} color={themeColors.white} />
        </TouchableOpacity>
      </Animated.View>

      {/* Floating Home Button in top right that stays fixed */}
      <View style={[
        homeStyles.floatingTopRightButton
      ]}>
        <BlurView intensity={30} tint={isDark ? "dark" : "light"} style={homeStyles.blurContainer} />
        <TouchableOpacity 
          style={[
            homeStyles.buttonContent, 
            { backgroundColor: themeColors.primary }
          ]}
          onPress={() => {
            // Navigate to home or perform other action
            router.push('/');
          }}
        >
          <Home size={20} color={themeColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;