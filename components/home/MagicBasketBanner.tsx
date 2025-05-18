import React from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { bannerStyles } from '@/styles/components/home/banner';
import BorderBeam from '@/components/ui/BorderBeam';

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
      
      <BorderBeam 
        duration={8}
        size={300}
        color="#FF4500"
        thickness={3}
        opacity={0.6}
      />
      <BorderBeam 
        duration={6}
        delay={2}
        size={280}
        color="#1E90FF"
        thickness={2}
        opacity={0.5}
      />
      <BorderBeam 
        duration={10}
        delay={1}
        size={320}
        color="#9932CC"
        thickness={1.5}
        opacity={0.4}
      />
    </TouchableOpacity>
  );
};

export default MagicBasketBanner; 