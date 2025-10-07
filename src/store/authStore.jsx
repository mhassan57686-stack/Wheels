import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      user: null,
      setAuth: (token, user) => set({ token, isAuthenticated: !!token, user }),
      clearAuth: () => set({ token: null, isAuthenticated: false, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;