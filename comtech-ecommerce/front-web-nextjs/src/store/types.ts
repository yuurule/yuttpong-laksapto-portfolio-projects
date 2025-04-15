export interface CartSlice {
  refreshCart: number;
  incrementRefreshCart: () => void;
  resetRefreshCart: () => void;
}

export interface WishlistSlice {
  refreshWishlist: number;
  incrementRefreshWishlist: () => void;
  resetRefreshWishlist: () => void;
}

export type StoreState = CartSlice & WishlistSlice;