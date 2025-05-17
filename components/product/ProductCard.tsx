import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Sparkles } from 'lucide-react-native';
import { Product } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import useThemeStore from '@/store/useThemeStore';
import useCartStore from '@/store/useCartStore';
import useUserStore from '@/store/useUserStore';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  showFarm?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, showFarm = false }) => {
  const router = useRouter();
  
  // Add error handling for theme store
  let theme;
  let colors;
  
  try {
    const themeStore = useThemeStore();
    theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: {} };
    colors = theme.colors || {};
  } catch (error) {
    console.error("Error accessing theme store:", error);
    // Fallback to light theme colors
    colors = {
      text: '#333333',
      subtext: '#666666',
      primary: '#4CAF50',
      error: '#F44336',
      card: '#FFFFFF',
      gray: {
        400: '#BDBDBD',
      },
      white: '#FFFFFF',
      success: '#4CAF50',
      warning: '#FF9800',
      info: '#2196F3',
    };
  }
  
  // Add error handling for cart store
  let addToCart = (product: Product, quantity: number) => {
    console.warn("addToCart function not available");
  };
  
  try {
    const cartStore = useCartStore();
    if (cartStore && typeof cartStore.addItem === 'function') {
      addToCart = cartStore.addItem;
    }
  } catch (error) {
    console.error("Error accessing cart store:", error);
  }
  
  // Add error handling for user store
  let user = null;
  let addFavoriteProduct = (id: string) => {};
  let removeFavoriteProduct = (id: string) => {};
  let isFavorite = false;
  
  try {
    const userStore = useUserStore();
    user = userStore.user;
    if (typeof userStore.addFavoriteProduct === 'function') {
      addFavoriteProduct = userStore.addFavoriteProduct;
    }
    if (typeof userStore.removeFavoriteProduct === 'function') {
      removeFavoriteProduct = userStore.removeFavoriteProduct;
    }
    isFavorite = user?.preferences?.favoriteProducts?.includes(product.id) || false;
  } catch (error) {
    console.error("Error accessing user store:", error);
  }
  
  // Calculate days since harvest
  const daysSinceHarvest = product.preHarvest 
    ? 0 
    : Math.floor((new Date().getTime() - new Date(product.harvestDate || new Date()).getTime()) / (1000 * 3600 * 24));
  
  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };
  
  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavoriteProduct(product.id);
    } else {
      addFavoriteProduct(product.id);
    }
  };
  
  return (
    <Card style={styles.card}>
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.container}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.image }} 
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={[styles.favoriteButton, { backgroundColor: colors.card || '#FFFFFF' }]}
            onPress={toggleFavorite}
          >
            <Heart 
              size={18} 
              color={isFavorite ? colors.error || '#F44336' : colors.gray?.[400] || '#BDBDBD'} 
              fill={isFavorite ? colors.error || '#F44336' : 'none'}
            />
          </TouchableOpacity>
          
          {product.organic && (
            <View style={styles.badgeContainer}>
              <Badge 
                text="Organic" 
                variant="success" 
                size="sm"
              />
            </View>
          )}
          
          {product.preHarvest && (
            <View style={[styles.badgeContainer, { top: product.organic ? 28 : 8 }]}>
              <Badge 
                text="Pre-Harvest" 
                variant="info" 
                size="sm"
              />
            </View>
          )}
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={[styles.name, { color: colors.text || '#333333' }]} numberOfLines={1}>
            {product.name}
          </Text>
          
          {showFarm && product.farmName && (
            <Text style={[styles.farmName, { color: colors.subtext || '#666666' }]} numberOfLines={1}>
              From {product.farmName}
            </Text>
          )}
          
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text || '#333333' }]}>
              ${product.price.toFixed(2)} <Text style={styles.unit}>/ {product.unit}</Text>
            </Text>
            
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.primary || '#4CAF50' }]}
              onPress={handleAddToCart}
            >
              <Sparkles size={18} color={colors.white || '#FFFFFF'} />
            </TouchableOpacity>
          </View>
          
          {!product.preHarvest && product.freshness !== undefined && (
            <View style={styles.freshnessContainer}>
              <View style={styles.freshnessBar}>
                <View 
                  style={[
                    styles.freshnessIndicator, 
                    { 
                      width: `${product.freshness}%`,
                      backgroundColor: product.freshness > 70 
                        ? colors.success || '#4CAF50' 
                        : product.freshness > 40 
                          ? colors.warning || '#FF9800' 
                          : colors.error || '#F44336'
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.freshnessText, { color: colors.subtext || '#666666' }]}>
                {daysSinceHarvest === 0 ? 'Harvested today' : `${daysSinceHarvest} day${daysSinceHarvest !== 1 ? 's' : ''} ago`}
              </Text>
            </View>
          )}
          
          {product.preHarvest && product.estimatedHarvestDate && (
            <Text style={[styles.preHarvestText, { color: colors.info || '#2196F3' }]}>
              Est. harvest: {new Date(product.estimatedHarvestDate).toLocaleDateString()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginRight: 0,
    width: '100%',
    borderRadius: 12,
  },
  container: {
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 130,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  contentContainer: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  farmName: {
    fontSize: 12,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  unit: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  freshnessContainer: {
    marginTop: 4,
  },
  freshnessBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  freshnessIndicator: {
    height: '100%',
    borderRadius: 2,
  },
  freshnessText: {
    fontSize: 12,
  },
  preHarvestText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default ProductCard;