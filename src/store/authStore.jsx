import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setAuth: (token) => set({ token, isAuthenticated: !!token }),
      clearAuth: () => set({ token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;