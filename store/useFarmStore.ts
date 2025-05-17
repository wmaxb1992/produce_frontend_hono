import { create } from 'zustand';
import { Farm, FarmPost } from '@/types';
import { mockFarms } from '@/mocks/farmData';
import { mockFarmPosts } from '@/mocks/socialData';

interface FarmState {
  farms: Farm[];
  farmPosts: FarmPost[];
  followedFarms: string[]; // Array of farm IDs
  
  // Actions
  getFarmById: (id: string) => Farm | undefined;
  getFarmsByDeliveryArea: (zipCode: string) => Farm[];
  getPostsByFarmId: (farmId: string) => FarmPost[];
  followFarm: (farmId: string) => void;
  unfollowFarm: (farmId: string) => void;
  isFollowingFarm: (farmId: string) => boolean;
  getFollowedFarms: () => Farm[];
}

const useFarmStore = create<FarmState>((set, get) => ({
  farms: mockFarms,
  farmPosts: mockFarmPosts,
  followedFarms: [],
  
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