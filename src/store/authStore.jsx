import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      user: null,
      favorites: [], // Added favorites array
      setAuth: (token, user) => set({ token, isAuthenticated: !!token, user }),
      clearAuth: () => set({ token: null, isAuthenticated: false, user: null, favorites: [] }),
      addFavorite: (carId) => set((state) => ({
        favorites: state.favorites.includes(carId) ? state.favorites : [...state.favorites, carId],
      })),
      removeFavorite: (carId) => set((state) => ({
        favorites: state.favorites.filter((id) => id !== carId),
      })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;