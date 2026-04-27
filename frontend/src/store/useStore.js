import { create } from 'zustand';
import axios from 'axios';

// Helper to get initial user from localStorage
const getInitialUser = () => {
  try {
    const adminInfo = localStorage.getItem('adminInfo');
    return adminInfo ? JSON.parse(adminInfo) : null;
  } catch (e) {
    return null;
  }
};

export const useStore = create((set, get) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  user: getInitialUser(),
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('adminInfo');
    set({ user: null });
  },
  
  services: [],
  isLoadingServices: false,
  servicesFetched: false,
  fetchServices: async () => {
    if (get().servicesFetched && get().services.length > 0) return;
    
    set({ isLoadingServices: true });
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services`);
      
      // Filter and sort for the 3 signature services as required by the design
      const uniqueData = Array.from(new Map(data.map(item => [item.name, item])).values());
      const targetNames = ['Haircut', 'Beard Trim', 'Hair Styling'];
      const strictlyThree = uniqueData.filter(item => targetNames.includes(item.name));
      strictlyThree.sort((a, b) => targetNames.indexOf(a.name) - targetNames.indexOf(b.name));
      
      const finalServices = strictlyThree.length > 0 ? strictlyThree : uniqueData;
      set({ services: finalServices, servicesFetched: true });
    } catch (error) {
      console.error('Error fetching services', error);
    } finally {
      set({ isLoadingServices: false });
    }
  }
}));
