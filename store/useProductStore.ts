import { create } from 'zustand';
import { Product, Category, Subcategory, Variety } from '@/types';
import { mockProducts, mockCategories } from '@/mocks/productData';

interface ProductState {
  products: Product[];
  categories: Category[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedVariety: string | null;
  filteredProducts: Product[];
  isLoading: boolean;
  
  // Actions
  fetchProducts: () => Promise<void>;
  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedSubcategory: (subcategoryId: string | null) => void;
  setSelectedVariety: (varietyId: string | null) => void;
  getProductById: (id: string) => Product | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getSubcategoryById: (id: string) => Subcategory | undefined;
  getVarietyById: (id: string) => Variety | undefined;
  getProductsByFarmId: (farmId: string) => Product[];
  getProductsByCategory: (categoryId: string | null) => Product[];
  getProductsBySubcategory: (subcategoryId: string | null) => Product[];
  getProductsByVariety: (varietyId: string | null) => Product[];
  getFreshProducts: (threshold: number) => Product[];
  getPreHarvestProducts: () => Product[];
  getInSeasonProducts: () => Product[];
  getOrganicProducts: () => Product[];
}

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  selectedCategory: null,
  selectedSubcategory: null,
  selectedVariety: null,
  filteredProducts: [],
  isLoading: true,
  
  fetchProducts: async () => {
    set({ isLoading: true });
    console.log('Starting to fetch products...');
    
    // Simulate a network request with a timeout
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Products fetched successfully');
      
      // After "fetching", set the mock data
      set({ 
        products: mockProducts,
        categories: mockCategories,
        filteredProducts: mockProducts,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ isLoading: false });
    }
  },
  
  setSelectedCategory: (categoryId) => {
    set({ 
      selectedCategory: categoryId,
      selectedSubcategory: null,
      selectedVariety: null,
      filteredProducts: categoryId 
        ? get().getProductsByCategory(categoryId)
        : get().products
    });
  },
  
  setSelectedSubcategory: (subcategoryId) => {
    set({ 
      selectedSubcategory: subcategoryId,
      selectedVariety: null,
      filteredProducts: subcategoryId
        ? get().getProductsBySubcategory(subcategoryId)
        : get().selectedCategory
          ? get().getProductsByCategory(get().selectedCategory)
          : get().products
    });
  },
  
  setSelectedVariety: (varietyId) => {
    set({ 
      selectedVariety: varietyId,
      filteredProducts: varietyId
        ? get().getProductsByVariety(varietyId)
        : get().selectedSubcategory
          ? get().getProductsBySubcategory(get().selectedSubcategory)
          : get().selectedCategory
            ? get().getProductsByCategory(get().selectedCategory)
            : get().products
    });
  },
  
  getProductById: (id) => {
    return get().products.find(product => product.id === id);
  },
  
  getCategoryById: (id) => {
    return get().categories.find(category => category.id === id);
  },
  
  getSubcategoryById: (id) => {
    for (const category of get().categories) {
      const subcategory = category.subcategories.find(sub => sub.id === id);
      if (subcategory) return subcategory;
    }
    return undefined;
  },
  
  getVarietyById: (id) => {
    for (const category of get().categories) {
      for (const subcategory of category.subcategories) {
        const variety = subcategory.varieties.find(v => v.id === id);
        if (variety) return variety;
      }
    }
    return undefined;
  },
  
  getProductsByFarmId: (farmId) => {
    return get().products.filter(product => product.farmId === farmId);
  },
  
  getProductsByCategory: (categoryId) => {
    if (!categoryId) return get().products;
    return get().products.filter(product => product.category === categoryId);
  },
  
  getProductsBySubcategory: (subcategoryId) => {
    if (!subcategoryId) return get().products;
    return get().products.filter(product => product.subcategory === subcategoryId);
  },
  
  getProductsByVariety: (varietyId) => {
    if (!varietyId) return get().products;
    return get().products.filter(product => product.variety === varietyId);
  },
  
  getFreshProducts: (threshold) => {
    return get().products.filter(product => 
      product.freshness !== undefined && 
      product.freshness >= threshold && 
      !product.preHarvest
    );
  },
  
  getPreHarvestProducts: () => {
    return get().products.filter(product => product.preHarvest);
  },
  
  getInSeasonProducts: () => {
    return get().products.filter(product => product.inSeason);
  },
  
  getOrganicProducts: () => {
    return get().products.filter(product => product.organic);
  },
}));

export default useProductStore;