import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Category } from '@/types';
import useThemeStore, { defaultColors } from '@/store/useThemeStore';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onPress?: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onPress }) => {
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: defaultColors };
  const colors = theme.colors || defaultColors;
  
  const handlePress = () => {
    onPress?.(category.id);
  };
  
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        style={[
          styles.container, 
          { 
            backgroundColor: 'transparent',
            borderColor: colors.gray[200] || '#EEEEEE',
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={[
          styles.imageContainer,
          isSelected && {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 8,
          }
        ]}>
          <Image 
            source={category.image.startsWith('http') 
              ? { uri: category.image }
              : category.image === '/assets/images/cat_vegetables.png'
                ? require('../../assets/images/cat_vegetables.png')
                : category.image === '/assets/images/cat_herbs.png'
                  ? require('../../assets/images/cat_herbs.png')
                  : require('../../assets/images/cat_fruits.png')
            }
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>

      <Text 
        style={[
          styles.name, 
          { color: colors.text || defaultColors.text }
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 80,
    alignItems: 'center',
    marginRight: 12,
  },
  container: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 2,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

});

export default CategoryCard;