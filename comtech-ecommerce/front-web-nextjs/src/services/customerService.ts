import API from '@/lib/api';

export const customerService = {

  signUp: async (
    email: string, 
    password: string,
    displayName: string,
  ): Promise<any> => {
    const url = `/api/customer/auth/register`;
    return API.post<any>(url, { email: email, password: password, displayName: displayName }, false);
  },

  signin: async (
    email: string, 
    password: string
  ): Promise<any> => {
    const url = `/api/customer/auth/login`;
    return API.post<any>(url, { email: email, password: password }, false);
  }, 

  getOneCustomer: async (customerId: number | string) => {
    const url = `/api/customer/${customerId}`;
    return API.get<any>(url, true);
  },

  addReview: async (
    productId: number, 
    rating: number, 
    message: string, 
    customerId: number
  ): Promise<any> => {
    const url = `/api/review/create`;
    const requestBody = {
      productId: productId, 
      rating: rating, 
      message: message, 
      customerId: customerId
    }
    return API.post<any>(url, requestBody, true);
  },

}