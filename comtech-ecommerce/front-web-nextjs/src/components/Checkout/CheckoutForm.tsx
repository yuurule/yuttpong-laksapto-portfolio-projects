"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useSession } from "next-auth/react";
import OrderSummary from "@/components/Checkout/OrderSummary";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';
import { orderService, customerService, paymentService } from '@/services';
import { loadStripe } from '@stripe/stripe-js';
import { 
  useStripe, 
  useElements, 
  CardElement,
  CardNumberElement, 
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const ELEMENT_STYLE = {
  base: {
    fontSize: '16px',
    color: '#424770',
    '::placeholder': {
      color: '#aab7c4',
    },
    ':focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  invalid: {
    color: '#dc3545',
    ':focus': {
      color: '#dc3545',
    },
    '::placeholder': {
      color: '#FFCCA5',
    },
  },
};

interface CheckoutFormProps {
  orderId: string;
  amount: number;
}

const formSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  region: z.string().optional(),
  street: z.string().optional(),
  postcode: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  note: z.string().optional(),
  nameOnCard: z.string().optional(),
  cardNumber: z.string().optional(),
  validThrough: z.string().optional(),
  cvc: z.string().optional(),
});

export default function CheckoutForm({ orderId, amount } : CheckoutFormProps) {

  const { status, data: session } = useSession();

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cardHolderName, setCardHolderName] = useState('');

  const [customerData, setCustomerData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [orderItemsData, setOrderItemsData] = useState([]);
  const [loadData, setLoadData] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isOwnCustomer, setIsOwnCustomer] = useState(false);
  const [notFoundOrder, setNotFoundOrder] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    const fetchOrder = async () => {
      setLoadData(true);
      try {
        const orders = await orderService.getOrders();
        const checkOrderId = orders.RESULT_DATA.find((i: any) => i.id === parseInt(orderId))
        if(checkOrderId) {
          setNotFoundOrder(false);
          if(session?.user.id) {
            const customer = await customerService.getOneCustomer(session.user.id)
            const order = await orderService.getOneOrder(orderId);
            const customerDetail = customer.RESULT_DATA.customerDetail;
  
            if(order.RESULT_DATA.customerId === parseInt(session.user.id)) {
              setIsOwnCustomer(true);
              setOrderData(order.RESULT_DATA);
              setOrderItemsData(order.RESULT_DATA.orderItems);
              setCustomerData(customer.RESULT_DATA);
  
              if(customerDetail) {
                // reset({
                //   firstName: customerDetail.firstName,
                //   lastName: customerDetail.lastName,
                //   region: customerDetail.region,
                //   street: customerDetail.street,
                //   postcode: customerDetail.postcode,
                //   city: customerDetail.city,
                //   phone: customerDetail.phone,
                // })
              }
  
              if(order.RESULT_DATA.paymentStatus === 'PAID') {
                setIsPaid(true);
              }
            }
          }
          else {
            throw new Error('Unauthorize, user id is required.')
          }
        }
      }
      catch(error) {
        console.log(`Fetch order is failed due to reason: ${error}`);
        toast.error(`Fetch order is failed due to reason: ${error}`);
      }
      finally { setLoadData(false); }
    }

    if(status !== 'loading') {
      fetchOrder();
    }
  }, [status, orderId]);

  // const onSubmit = async (data: any) => {
  //   try {
  //     await orderService.updateOrder(orderId, 'PAID')
  //       .then(res => {
  //         console.log(res);
  //         toast.success(`Your order is payment successfully!`);
  //         router.push(`/thankyou`);
  //       });
  //   }
  //   catch(error) {
  //     console.log(`Checkout is failed due to reason: ${error}`);
  //     toast.error(`Checkout is failed due to reason: ${error}`);
  //   }
  // }

  // ฟังก์ชันตรวจสอบการกดปุ่ม Enter ให้ focus ไปช่องถัดไป
  const handleKeyDown = (event: React.KeyboardEvent, nextElementType: string) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const nextElement = elements?.getElement(nextElementType as any);
      if (nextElement) {
        nextElement.focus();
      }
    }
  };

  //const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
  const onSubmit = async (data: any) => {
    //e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js ยังไม่ถูกโหลด
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. สร้าง Payment Intent ผ่าน API
      const { paymentIntent } = await paymentService.createPaymentIntent(amount);

      if (!paymentIntent.client_secret) {
        throw new Error('No client_secret received');
      }

      // 2. ยืนยันการชำระเงินด้วย CardElement
      //const cardElement = elements.getElement(CardElement);
      const cardElement = elements.getElement(CardNumberElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardHolderName, // สามารถรับข้อมูลจากฟอร์มได้
            },
          },
        }
      );

      if (error) {
        throw new Error(error.message || 'Payment failed');
      }

      if (confirmedIntent.status === 'succeeded') {

        // Update order is paid here

        // นำทางไปยังหน้าสำเร็จ
        router.push(`/payment-success?payment_id=${confirmedIntent.id}`);
      } else {
        throw new Error(`Payment status: ${confirmedIntent.status}`);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred');
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    {
      !loadData
      ?
        !notFoundOrder
        ?
          isOwnCustomer
          ?
            !isPaid
            ?
            <>
            {/* <form onSubmit={handleSubmit(onSubmit)} className="row"> */}
            <form onSubmit={handleSubmit(onSubmit)} className="row">
              <div className="col-sm-8 pe-5">
                <section className="mb-5">
                  <h6>Billing Details</h6>
                  <hr />
                  <div className="row form-design form-float-label">
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          {...register('firstName')}
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          disabled={true}
                        />
                        {errors.firstName && <small className="invalid-feedback">{errors.firstName.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          {...register('lastName')}
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          disabled={true}
                        />
                        {errors.lastName && <small className="invalid-feedback">{errors.lastName.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Country / Region</label>
                        <input
                          type="text"
                          {...register('region')}
                          className={`form-control ${errors.region ? 'is-invalid' : ''}`}
                          disabled={true}
                        />
                        {errors.region && <small className="invalid-feedback">{errors.region.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Street address</label>
                        <input
                          type="text"
                          {...register('street')}
                          className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                          disabled={true}
                        />
                        {errors.street && <small className="invalid-feedback">{errors.street.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Postcode</label>
                        <input
                          type="text"
                          {...register('postcode')}
                          className={`form-control ${errors.postcode ? 'is-invalid' : ''}`}
                          disabled={true}
                        />
                        {errors.postcode && <small className="invalid-feedback">{errors.postcode.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Town / City</label>
                        <input
                          type="text"
                          {...register('city')}
                          className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                          disabled={true}
                        />
                        {errors.city && <small className="invalid-feedback">{errors.city.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Phone</label>
                        <input
                          type="text"
                          {...register('phone')}
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          disabled={true}
                        />
                        {errors.phone && <small className="invalid-feedback">{errors.phone.message}</small>}
                      </div>
                    </div>
                  </div>
                </section>

                {/* <section className="mb-4">
                  <h6>Payment Method</h6>
                  <hr />
                  <div className="row form-design form-float-label">
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Name on card</label>
                        <input
                          type="text"
                          {...register('nameOnCard')}
                          className={`form-control ${errors.nameOnCard ? 'is-invalid' : ''}`}
                        />
                        {errors.nameOnCard && <small className="invalid-feedback">{errors.nameOnCard.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Card number</label>
                        <input
                          type="text"
                          {...register('cardNumber')}
                          className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                        />
                        {errors.cardNumber && <small className="invalid-feedback">{errors.cardNumber.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Valid through</label>
                        <input
                          type="text"
                          {...register('validThrough')}
                          className={`form-control ${errors.validThrough ? 'is-invalid' : ''}`}
                        />
                        {errors.validThrough && <small className="invalid-feedback">{errors.validThrough.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">CVC Code</label>
                        <input
                          type="text"
                          {...register('cvc')}
                          className={`form-control ${errors.cvc ? 'is-invalid' : ''}`}
                        />
                        {errors.cvc && <small className="invalid-feedback">{errors.cvc.message}</small>}
                      </div>
                    </div>
                  </div>
                </section> */}
              </div>
              <div className="col-sm-4">
                <label className="block text-sm font-medium mb-2">
                  ยอดชำระ: {amount} บาท
                </label>
                {/* <div className="border rounded p-3 bg-white mb-3">
                  <CardElement options={cardElementOptions} />
                </div> */}

                <div className="mb-4">
                  <label htmlFor="cardholder-name" className="block text-sm font-medium mb-2">
                    ชื่อที่ปรากฏบนบัตร
                  </label>
                  <input
                    id="cardholder-name"
                    type="text"
                    className="w-full p-2 border rounded"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="card-number" className="block text-sm font-medium mb-2">
                    หมายเลขบัตร
                  </label>
                  <div id="card-number" className="border rounded p-3 bg-white">
                    <CardNumberElement 
                      //options={{ style: ELEMENT_STYLE }} 
                      //onKeyDown={(e) => handleKeyDown(e, 'cardExpiry')}
                      onChange={(e) => {
                        // เมื่อกรอกเลขบัตรครบแล้ว จะเลื่อนไปที่ช่องวันหมดอายุอัตโนมัติ
                        if (e.complete) {
                          const expiryElement = elements?.getElement(CardExpiryElement);
                          if (expiryElement) {
                            expiryElement.focus();
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="card-expiry" className="block text-sm font-medium mb-2">
                      วันหมดอายุ
                    </label>
                    <div id="card-expiry" className="border rounded p-3 bg-white">
                      <CardExpiryElement 
                        //options={{ style: ELEMENT_STYLE }}
                        //onKeyDown={(e) => handleKeyDown(e, 'cardCvc')}
                        onChange={(e) => {
                          // เมื่อกรอกวันหมดอายุครบแล้ว จะเลื่อนไปที่ช่อง CVC อัตโนมัติ
                          if (e.complete) {
                            const cvcElement = elements?.getElement(CardCvcElement);
                            if (cvcElement) {
                              cvcElement.focus();
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="card-cvc" className="block text-sm font-medium mb-2">
                      CVC
                    </label>
                    <div id="card-cvc" className="border rounded p-3 bg-white">
                      <CardCvcElement 
                        //options={{ style: ELEMENT_STYLE }} 
                      />
                    </div>
                  </div>
                </div>


                <button 
                  type="submit"
                  className="w-100 btn design-btn gradient-btn py-3"
                >
                  {/* {
                    isSubmitting 
                    ? <FontAwesomeIcon icon={faRefresh} className='text-light' /> 
                    : <><FontAwesomeIcon icon={faCircleCheck} className='text-light me-2' />CHECKOUT</>
                  } */}
                  {isLoading ? 'กำลังดำเนินการ...' : 'ชำระเงิน'}
                </button>
                {/* <button
                  type="submit"
                  disabled={!stripe || isLoading}
                  className="w-100 btn design-btn gradient-btn py-3"
                >
                  {isLoading ? 'กำลังดำเนินการ...' : 'ชำระเงิน'}
                </button> */}
                {errorMessage && (
                  <div className="mb-4 p-2 text-red-700 bg-red-100 rounded">
                    {errorMessage}
                  </div>
                )}
              </div>
            </form>

            {/* <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  ยอดชำระ: {amount} บาท
                </label>
                <div className="border rounded p-3 bg-white">
                  <CardElement options={cardElementOptions} />
                </div>
              </div>

              {errorMessage && (
                <div className="mb-4 p-2 text-red-700 bg-red-100 rounded">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={!stripe || isLoading}
                className="w-100 btn design-btn gradient-btn py-3"
              >
                {isLoading ? 'กำลังดำเนินการ...' : 'ชำระเงิน'}
              </button>
            </form> */}
            </>
            :
            <p className='h5 opacity-50 mb-5'>This order is already payment</p>
          :
          <p className='h5 opacity-50 mb-5'>You not permission to view this order</p>   
        :
        <p className='h5 opacity-50 mb-5'>Not found order</p>
      :
      <p className='h5 text-center opacity-50'>Loading...</p>
    }
    </>
  )
}