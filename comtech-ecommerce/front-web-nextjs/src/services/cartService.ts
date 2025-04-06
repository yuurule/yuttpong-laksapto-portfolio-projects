import API from '@/lib/api';

export const cartService = {

  getCartByCustomer: async (customerId: string) => {
    const url = `/api/cart/customer/${parseInt(customerId)}`;
    return API.get<any>(url, true);
  },

  addToCart: async (customerId: string, productId: number, quantity: number) => {
    const requestData = {
      customerId: parseInt(customerId),
      productId: productId,
      quantity: quantity
    }
    const url = `/api/cart/add`;
    return API.post<any>(url, requestData, true);
  },

  updateItemInCart: async (cartItemId: number, quantity: number, actionType?: string) => {
    const requestData: {
      quantity: number;
      actionType?: string;
    } = {
      quantity: quantity
    }

    if(actionType) {
      requestData.actionType = actionType
    }

    const url = `/api/cart/${cartItemId}`;
    return API.put<any>(url, requestData, true);
  },

  deleteCartItems: async (cartItemsId: number[]) => {
    const requestBody = {
      cartItemsId: cartItemsId
    }
    const url = `/api/cart/customer/delete`;
    return API.delete<any>(url, requestBody, true);
  },

}