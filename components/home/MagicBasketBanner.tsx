import React, { useRef, useState } from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { bannerStyles } from '@/styles/components/home/banner';
import BorderBeam from '@/components/ui/BorderBeam';

const MagicBasketBanner: React.FC = () => {
  const router = useRouter();
  const bannerRef = useRef<View>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Get screen width to calculate actual banner width (90% of screen)
  const screenWidth = Dimensions.get('window').width;
  const BANNER_WIDTH = screenWidth * 0.9; // 90% of screen width as defined in bannerStyles
  const BANNER_HEIGHT = 130;  // From bannerStyles
  const BANNER_RADIUS = 12;   // From bannerStyles

  return (
    <View style={styles.bannerWrapper}>
      <TouchableOpacity 
        style={bannerStyles.container}
        onPress={() => router.push('/magic-basket')}
      >
        {/* Only show border beams after image loads */}
        {imageLoaded && (
          <>
            <BorderBeam 
              duration={8}
              width={BANNER_WIDTH}
              height={BANNER_HEIGHT}
              color="#FF4500"
              thickness={3}
              opacity={0.6}
              borderRadius={BANNER_RADIUS}
              style={styles.absoluteFill}
            />
            <BorderBeam 
              duration={6}
              delay={2}
              width={BANNER_WIDTH}
              height={BANNER_HEIGHT}
              color="#1E90FF"
              thickness={2}
              opacity={0.5}
              borderRadius={BANNER_RADIUS}
              style={styles.absoluteFill}
            />
            <BorderBeam 
              duration={10}
              delay={1}
              width={BANNER_WIDTH}
              height={BANNER_HEIGHT}
              color="#9932CC"
              thickness={1.5}
              opacity={0.4}
              borderRadius={BANNER_RADIUS}
              style={styles.absoluteFill}
            />
          </>
        )}
        
        <Image 
          source={require('@/assets/images/banner_gif.gif')}
          style={bannerStyles.background}
          resizeMode="cover"
          onLoad={() => setImageLoaded(true)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  bannerWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    height: 130, // Same height as the banner
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  }
});

export default MagicBasketBanner; 