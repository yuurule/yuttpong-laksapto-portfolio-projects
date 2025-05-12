import API from '@/lib/api';
import { createOrderProps } from '@/types/PropsType';

export const orderService = {

  getOrders: async (): Promise<any> => {
    const url = `/api/order`;
    return API.get<any>(url, true);
  },

  getOneOrder: async (orderId: string): Promise<any> => {
    const url = `/api/order/${orderId}`;
    return API.get<any>(url, true);
  },

  createOrder: async (data: createOrderProps): Promise<any> => {
    const requestBody: createOrderProps = {
      customerId: data.customerId,
      total: data.total,
      items: data.items,
      useSameAddress: data.useSameAddress,
      firstName: data.firstName ?? undefined,
      lastName: data.lastName ?? undefined,
      phone: data.phone ?? undefined,
      address: data.address ?? undefined,
      subDistrict: data.subDistrict ?? undefined,
      district: data.district ?? undefined,
      province: data.province ?? undefined,
      postcode: data.postcode ?? undefined,
      country: data.country ?? undefined,
    }
    const url = `/api/order/create`;
    return API.post<any>(url, requestBody, true);
  },

  updateOrder: async (orderId: string, paymentStatus: string): Promise<any> => {
    const requestBody = {
      paymentStatus: paymentStatus
    }
    const url = `/api/order/${orderId}/payment`;
    return API.put<any>(url, requestBody, true);
  },

}