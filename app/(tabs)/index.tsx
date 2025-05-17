import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ViewStyle, TextStyle, ImageStyle, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, Home as HomeIcon, Plus, Minus } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import useProductStore from '@/store/useProductStore';
import useFarmStore from '@/store/useFarmStore';
import defaultColors from '@/constants/colors';
import { spacing, borderRadius } from '@/constants/theme';
import type { Category, Subcategory, Variety, Product, Farm, FarmPost } from '@/types';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import ProductCard from '@/components/product/ProductCard';
import CategoryCard from '@/components/product/CategoryCard';
import SubcategoryCard from '@/components/product/SubcategoryCard';
import VarietyChip from '@/components/product/VarietyChip';
import SeasonalBadge from '@/components/product/SeasonalBadge';
import FarmCard from '@/components/farm/FarmCard';
import FarmPostCard from '@/components/farm/FarmPostCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultColors.light.background,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 48,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchText: {
    marginLeft: 8,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: defaultColors.light.text,
  },
  filterButton: {
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoriesSectionHeader: {
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: defaultColors.light.text,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  clearButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 8,
  },
  subcategoriesContainer: {
    marginHorizontal: 0,
  },
  subcategoriesContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  varietiesContainer: {
    flexDirection: 'row',
  },
  farmsContainer: {
    flexDirection: 'row',
  },
  productsContainer: {
    flexDirection: 'row',
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  subcategoryList: {
    paddingHorizontal: 16,
  },
  varietyList: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  productList: {
    paddingHorizontal: 16,
  },
  farmList: {
    paddingHorizontal: 16,
  },
  farmPostList: {
    paddingHorizontal: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterText: {
    color: defaultColors.light.text,
    marginRight: 8,
  },
  selectedFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedFilter: {
    backgroundColor: defaultColors.light.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedFilterText: {
    color: defaultColors.light.white,
    marginRight: 4,
  },
  removeFilterButton: {
    padding: 4,
  },
  removeFilterIcon: {
    color: defaultColors.light.white,
  },
  filteredFarmsContainer: {
    marginTop: 16,
  },
  filteredProductsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  filteredProductCard: {
    width: '31%',
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
    marginHorizontal: -16,
  },
  featuredContainer: {
    marginLeft: -16,
  },
  featuredContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  featuredCard: {
    width: 240,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 144,
    resizeMode: 'cover',
  },
  featuredInfo: {
    padding: 12,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featuredRating: {
    fontSize: 14,
    color: '#666',
  },
  featuredTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  featuredPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  farmInfo: {
    marginTop: 4,
  },
  farmName: {
    fontSize: 13,
    color: '#666',
  },
  farmLocation: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  addToCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    overflow: 'hidden',
  },
  stepperButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 12,
  }
});



interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const router = useRouter();
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;

  const { products, categories } = useProductStore();
  const { farms, farmPosts } = useFarmStore();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [freshProducts, setFreshProducts] = useState<Product[]>([]);
  const [preHarvestProducts, setPreHarvestProducts] = useState<Product[]>([]);
  const [inSeasonProducts, setInSeasonProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

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

  const handleClearSubcategory = () => {
    console.log('Clearing subcategory filter');
    setSelectedSubcategory(null);
    setSelectedVariety(null);
  };

  const handleClearVariety = () => {
    console.log('Clearing variety filter');
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

  // Filter updates are handled by the useEffect above

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Address Input */}
      <TouchableOpacity 
        style={[styles.addressBar, { backgroundColor: themeColors.card }]}
        onPress={() => router.push('/user/addresses')}
      >
        <View style={styles.addressContent}>
          <Text style={[styles.addressLabel, { color: themeColors.subtext }]}>
            Deliver to
          </Text>
          <Text style={[styles.addressText, { color: themeColors.text }]} numberOfLines={1}>
            123 Market St, San Francisco, CA 94105
          </Text>
        </View>
      </TouchableOpacity>

      {/* Search Bar */}
      <TouchableOpacity
        style={[styles.searchBar, { backgroundColor: themeColors.card }]}
        onPress={handleSearchPress}
      >
        <Search size={20} color={themeColors.subtext} />
        <Text style={[styles.searchText, { color: themeColors.subtext }]}>
          Search for farms, products...
        </Text>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Categories
          </Text>
          {selectedCategory && (
            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: themeColors.card }]}
              onPress={handleClearFilters}
            >
              <HomeIcon size={20} color={themeColors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category: Category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Subcategories - Only show if a category is selected */}
      {selectedCategory && subcategories.length > 0 && (
        <View style={[styles.section, { marginTop: 0 }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.subcategoriesContainer}
            contentContainerStyle={styles.subcategoriesContent}
          >
            {subcategories.map((subcategory: Subcategory) => (
              <SubcategoryCard
                key={subcategory.id}
                subcategory={subcategory}
                isSelected={selectedSubcategory === subcategory.id}
                onPress={() => handleSubcategoryPress(subcategory.id)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Varieties - Only show if a subcategory is selected */}
      {selectedSubcategory && varieties.length > 0 && (
        <View style={[styles.section, { marginTop: 0 }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.varietiesContainer}
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
      )}
      
      {/* Featured Farms - Only show when no category is selected */}
      {!selectedCategory && farms.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Featured Farms
          </Text>
          
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.farmsContainer}
          >
            {farms.map(farm => (
              <FarmCard 
                key={farm.id}
                farm={farm}
              />
            ))}
          </ScrollView>
        </View>
      )}
      
      {/* Fresh Picks - Only show when no category is selected */}
      {!selectedCategory && freshProducts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Fresh Picks
            </Text>
            <TouchableOpacity>
              <HomeIcon size={24} color={themeColors.text} />
            </TouchableOpacity>
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
                <Image
                  source={{ uri: product.image }}
                  style={styles.featuredImage}
                />
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
            style={styles.productsContainer}
          >
            {preHarvestProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onPress={() => handleProductPress(product.id)}
              />
            ))}
          </ScrollView>
        </View>
      )}
      
      {/* Filtered Products - Show when a filter is applied */}
      {(selectedCategory || selectedSubcategory || selectedVariety) && (
        <View style={styles.section}>
          <View style={[styles.separator, { backgroundColor: themeColors.border }]} />
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            {filteredProducts.length} Products
          </Text>
          
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
  );
}

export default HomeScreen;