export interface PaymentIntent {
  id: string;
  amount: number;
  status: string;
  client_secret: string | null;
}

export interface CreatePaymentResponse {
  paymentIntent: PaymentIntent;
}

export interface VerifyPaymentResponse {
  success: boolean;
  payment?: {
    id: string;
    amount: number;
    status: string;
    created: number;
  };
  error?: string;
}