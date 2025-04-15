import { create } from "zustand";
import { StoreState } from "./types";

// import slices
import { createCartSlice } from "./cartSlice";
import { createWishlistSlice } from "./wishlistSlice";

const useStore = create<StoreState>()((...args) => ({
  ...createCartSlice(...args),
  ...createWishlistSlice(...args),
}));

export default useStore;
export * from './types';