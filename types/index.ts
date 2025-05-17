// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  white: string;
  black: string;
  spring: string;
  summer: string;
  fall: string;
  winter: string;
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  fontSizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  fontWeights: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  borderRadius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
  };
  shadows: any;
  themeType: 'light' | 'dark';
}

// Product Types
export interface Variety {
  id: string;
  name: string;
  subcategoryId: string;
  emoji: string;
  description: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  image: string;
  varieties: Variety[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: Subcategory[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  variety?: string;
  farmId: string;
  farmName: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isOrganic?: boolean;
  unit: string;
  weight?: number;
  freshness?: number;
  harvestDate?: string;
  estimatedHarvestDate?: string;
  preHarvest: boolean;
  inSeason: boolean;
  organic: boolean;
}

// Farm Types
export interface Farm {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  deliveryZones: DeliveryZone[];
  rating: number;
  reviewCount: number;
  followers: number;
  certifications: string[];
  specialties: string[];
  foundedYear: number;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface DeliveryZone {
  id: string;
  name: string;
  deliveryDays: string[];
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTime: string;
  areas: string[];
}

// Social Types
export interface FarmPost {
  id: string;
  farmId: string;
  farmName: string;
  farmLogo: string;
  content: string;
  images: string[];
  createdAt: string;
  likes: number;
  comments: number;
  tags: string[];
  products?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
  preferences?: {
    favoriteProducts?: string[];
    favoriteStores?: string[];
    dietaryRestrictions?: string[];
    allergies?: string[];
  };
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
  instructions?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  name: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  farmId: string;
  farmName: string;
  unit: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  estimatedDelivery?: string;
  trackingNumber?: string;
}