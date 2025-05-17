import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react-native';
import { View, Text } from 'react-native';
import useThemeStore from '@/store/useThemeStore';
import useCartStore from '@/store/useCartStore';
import { getTheme } from '@/constants/theme';

export default function TabsLayout() {
  const { theme, themeType } = useThemeStore();
  // Use the theme from the store if available, otherwise use a default theme
  const currentTheme = theme || getTheme(themeType || 'light');
  const { colors } = currentTheme;
  
  const { getTotalItems } = useCartStore();
  const cartItemCount = getTotalItems();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View>
              <ShoppingBag size={size} color={color} />
              {cartItemCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -8,
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    width: 18,
                    height: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}