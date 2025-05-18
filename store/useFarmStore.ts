import { create } from 'zustand';
import { Farm, FarmPost } from '@/types';
import { mockFarms } from '@/mocks/farmData';
import { mockFarmPosts } from '@/mocks/socialData';

interface FarmState {
  farms: Farm[];
  farmPosts: FarmPost[];
  followedFarms: string[]; // Array of farm IDs
  isLoading: boolean;
  
  // Actions
  fetchFarmData: () => Promise<void>;
  getFarmById: (id: string) => Farm | undefined;
  getFarmsByDeliveryArea: (zipCode: string) => Farm[];
  getPostsByFarmId: (farmId: string) => FarmPost[];
  followFarm: (farmId: string) => void;
  unfollowFarm: (farmId: string) => void;
  isFollowingFarm: (farmId: string) => boolean;
  getFollowedFarms: () => Farm[];
}

const useFarmStore = create<FarmState>((set, get) => ({
  farms: [],
  farmPosts: [],
  followedFarms: [],
  isLoading: true,
  
  fetchFarmData: async () => {
    set({ isLoading: true });
    console.log('Starting to fetch farm data...');
    
    // Simulate a network request with a timeout
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      console.log('Farm data fetched successfully');
      
      // After "fetching", set the mock data
      set({ 
        farms: mockFarms,
        farmPosts: mockFarmPosts,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching farm data:', error);
      set({ isLoading: false });
    }
  },
  
  getFarmById: (id) => {
    return get().farms.find(farm => farm.id === id);
  },
  
  getFarmsByDeliveryArea: (zipCode) => {
    return get().farms.filter(farm => 
      farm.deliveryZones.some(zone => 
        zone.areas.includes(zipCode)
      )
    );
  },
  
  getPostsByFarmId: (farmId) => {
    return get().farmPosts.filter(post => post.farmId === farmId);
  },
  
  followFarm: (farmId) => {
    const { followedFarms } = get();
    if (!followedFarms.includes(farmId)) {
      set({ followedFarms: [...followedFarms, farmId] });
    }
  },
  
  unfollowFarm: (farmId) => {
    const { followedFarms } = get();
    set({ followedFarms: followedFarms.filter(id => id !== farmId) });
  },
  
  isFollowingFarm: (farmId) => {
    return get().followedFarms.includes(farmId);
  },
  
  getFollowedFarms: () => {
    const { farms, followedFarms } = get();
    return farms.filter(farm => followedFarms.includes(farm.id));
  },
}));

export default useFarmStore;