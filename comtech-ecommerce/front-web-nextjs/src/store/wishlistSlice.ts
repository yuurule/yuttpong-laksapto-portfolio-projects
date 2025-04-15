import { StateCreator } from 'zustand';
import { WishlistSlice, StoreState } from './types';

export const createWishlistSlice: StateCreator<
  StoreState,
  [],
  [],
  WishlistSlice
> = (set) => ({

  // state
  refreshWishlist: 0,

  // methods
  incrementRefreshWishlist: () => set((state) => ({ refreshWishlist: state.refreshWishlist + 1 })),
  resetRefreshWishlist: () => set({ refreshWishlist: 0 }),

});