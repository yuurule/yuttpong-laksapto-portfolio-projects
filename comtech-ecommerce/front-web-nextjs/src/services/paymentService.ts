import API from '@/lib/api';
import { CreatePaymentResponse, VerifyPaymentResponse } from '@/types/stripe';

export const paymentService = {

  createPaymentIntent : async (amount: number, currency: string = 'thb', orderId: number): Promise<CreatePaymentResponse> => {
    const url = `/api/payment/create-payment-intent`;
    const requestBody = {
      amount: amount,
      currency: currency,
      orderId: orderId,
    }
    return API.post<any>(url, requestBody, true);
  },

  verifyPayment : async (paymentId: string): Promise<VerifyPaymentResponse> => {
    const url = `/api/payment/verify-payment/${paymentId}`;
    return API.get<any>(url, true);
  },
}