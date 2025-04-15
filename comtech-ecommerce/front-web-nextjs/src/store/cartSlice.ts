import { StateCreator } from 'zustand';
import { CartSlice, StoreState } from './types';

export const createCartSlice: StateCreator<
  StoreState,
  [],
  [],
  CartSlice
> = (set) => ({

  // state
  refreshCart: 0,

  // methods
  incrementRefreshCart: () => set((state) => ({ refreshCart: state.refreshCart + 1 })),
  resetRefreshCart: () => set({ refreshCart: 0 }),

});