import { create } from 'zustand';

// Helper to get initial user from localStorage
const getInitialUser = () => {
  try {
    const adminInfo = localStorage.getItem('adminInfo');
    return adminInfo ? JSON.parse(adminInfo) : null;
  } catch (e) {
    return null;
  }
};

export const useStore = create((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  user: getInitialUser(),
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('adminInfo');
    set({ user: null });
  }
}));
