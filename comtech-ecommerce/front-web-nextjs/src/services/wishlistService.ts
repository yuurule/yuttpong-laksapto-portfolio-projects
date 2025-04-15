import API from '@/lib/api';

export const wishlistService = {

  addWishlist: async (productId: number, customerId: number): Promise<any> => {
    const url = `/api/wishlist/add`;
    const requestBody = {
      productId: productId,
      customerId: customerId,
    }
    return API.post<any>(url, requestBody, true);
  },

  removeWishlist: async(wishlistId: number): Promise<any> => {
    const url = `/api/wishlist/${wishlistId}`;
    return API.delete<any>(url, {}, true);
  }

}