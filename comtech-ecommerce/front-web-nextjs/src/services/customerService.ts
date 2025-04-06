import API from '@/lib/api';

export const customerService = {

  signin: async (email: string, password: string): Promise<any> => {
    const url = `/api/customer/auth/login`;
    return API.post<any>(url, { email: email, password: password }, false);
  }, 

}