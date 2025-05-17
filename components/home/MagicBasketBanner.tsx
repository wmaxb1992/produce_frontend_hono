import React from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { bannerStyles } from '@/styles/components/home/banner';

const MagicBasketBanner: React.FC = () => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={bannerStyles.container}
      onPress={() => router.push('/magic-basket')}
    >
      <Image 
        source={require('@/assets/images/banner_gif.gif')}
        style={bannerStyles.background}
        resizeMode="cover"
      />
      <View style={bannerStyles.content}>
        <View style={bannerStyles.textContent}>
          <Text style={bannerStyles.title}>Magic Basket</Text>
          <Text style={bannerStyles.subtitle}>
            Get a personalized basket curated just for you
          </Text>
        </View>
        <View style={bannerStyles.button}>
          <Text style={bannerStyles.buttonText}>Try Now</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MagicBasketBanner; 