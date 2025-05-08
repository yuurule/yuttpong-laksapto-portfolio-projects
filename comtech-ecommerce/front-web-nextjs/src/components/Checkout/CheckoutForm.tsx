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

interface CheckoutFormProps {
  orderId: string;
}

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'required' }),
  lastName: z.string().min(1, { message: 'required' }),
  address: z.string().min(1, { message: 'required' }),
  subDistrict: z.string().min(1, { message: 'required' }),
  district: z.string().min(1, { message: 'required' }),
  province: z.string().min(1, { message: 'required' }),
  postcode: z.string().min(1, { message: 'required' }),
  country: z.string().min(1, { message: 'required' }),
  phone: z.string().min(1, { message: 'required' }),

  useSameAddr: z.boolean().optional().default(false),
  
  ship_firstName: z.string().optional(),
  ship_lastName: z.string().optional(),
  ship_address: z.string().optional(),
  ship_subDistrict: z.string().optional(),
  ship_district: z.string().optional(),
  ship_province: z.string().optional(),
  ship_postcode: z.string().optional(),
  ship_country: z.string().optional(),
  ship_phone: z.string().optional(),
})
.superRefine((data, ctx) => {
  if(data.useSameAddr === false) {
    if(!data.ship_firstName || data.ship_firstName.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `required`,
        path: ['ship_firstName']
      });
    }
    if(!data.ship_lastName || data.ship_lastName.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `required`,
        path: ['ship_lastName']
      });
    }
    if(!data.ship_address || data.ship_address.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `required`,
        path: ['ship_address']
      });
    }
    if(!data.ship_subDistrict || data.ship_subDistrict.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `required`,
        path: ['ship_subDistrict']
      });
    }
    if(!data.ship_district || data.ship_district.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `required`,
        path: ['ship_district']
      });
    }
    if(!data.ship_province || data.ship_province.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `required`,
        path: ['ship_province']
      });
    }
    if(!data.ship_postcode || data.ship_postcode.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `required`,
        path: ['ship_postcode']
      });
    }
    if(!data.ship_country || data.ship_country.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `required`,
        path: ['ship_country']
      });
    }
    if(!data.ship_phone || data.ship_phone.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `required`,
        path: ['ship_phone']
      });
    }
  }
})

export default function CheckoutForm({ orderId } : CheckoutFormProps) {

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
    reset,
    setValue,
    watch,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(formSchema)
  });

  const formValues = watch();

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
                reset({
                  firstName: customerDetail.firstName,
                  lastName: customerDetail.lastName,
                  address: customerDetail.address,
                  subDistrict: customerDetail.subDistrict,
                  district: customerDetail.district,
                  province: customerDetail.province,
                  postcode: customerDetail.postcode,
                  country: customerDetail.country,
                  phone: customerDetail.phone,
                })
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

    console.log(data)

    if (!stripe || !elements) {
      // Stripe.js ยังไม่ถูกโหลด
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Check product in stock is have enough here
      //...

      // 1. สร้าง Payment Intent ผ่าน API
      const { paymentIntent } = await paymentService.createPaymentIntent(100);

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
                        />
                        {errors.lastName && <small className="invalid-feedback">{errors.lastName.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          {...register('address')}
                          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        />
                        {errors.address && <small className="invalid-feedback">{errors.address.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Sub district</label>
                        <input
                          type="text"
                          {...register('subDistrict')}
                          className={`form-control ${errors.subDistrict ? 'is-invalid' : ''}`}
                        />
                        {errors.subDistrict && <small className="invalid-feedback">{errors.subDistrict.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">District</label>
                        <input
                          type="text"
                          {...register('district')}
                          className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                        />
                        {errors.district && <small className="invalid-feedback">{errors.district.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Province</label>
                        <input
                          type="text"
                          {...register('province')}
                          className={`form-control ${errors.province ? 'is-invalid' : ''}`}
                        />
                        {errors.province && <small className="invalid-feedback">{errors.province.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Postcode</label>
                        <input
                          type="text"
                          {...register('postcode')}
                          className={`form-control ${errors.postcode ? 'is-invalid' : ''}`}
                        />
                        {errors.postcode && <small className="invalid-feedback">{errors.postcode.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          {...register('country')}
                          className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                        />
                        {errors.country && <small className="invalid-feedback">{errors.country.message}</small>}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group position-relative">
                        <label className="form-label">Phone</label>
                        <input
                          type="text"
                          {...register('phone')}
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        />
                        {errors.phone && <small className="invalid-feedback">{errors.phone.message}</small>}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mb-5">
                  <h6>Shipping Address</h6>
                  <hr />
                  <div className='form-check form-check-inline mb-3'>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      {...register('useSameAddr')}
                    />
                    <label className="form-check-label">Use same address</label>
                  </div>
                  
                  {
                    formValues.useSameAddr === false &&
                    <div className="row form-design form-float-label">
                      <div className="col-sm-6">
                        <div className="form-group position-relative">
                          <label className="form-label">First Name</label>
                          <input
                            type="text"
                            {...register('ship_firstName')}
                            className={`form-control ${errors.ship_firstName ? 'is-invalid' : ''}`}
                          />
                          {errors.ship_firstName && <small className="invalid-feedback">{errors.ship_firstName.message}</small>}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group position-relative">
                          <label className="form-label">Last Name</label>
                          <input
                            type="text"
                            {...register('ship_lastName')}
                            className={`form-control ${errors.ship_lastName ? 'is-invalid' : ''}`}
                          />
                          {errors.ship_lastName && <small className="invalid-feedback">{errors.ship_lastName.message}</small>}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group position-relative">
                          <label className="form-label">Address</label>
                          <input
                            type="text"
                            {...register('ship_address')}
                            className={`form-control ${errors.ship_address ? 'is-invalid' : ''}`}
                          />
                          {errors.ship_address && <small className="invalid-feedback">{errors.ship_address.message}</small>}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group position-relative">
                          <label className="form-label">Sub district</label>
                          <input
                            type="text"
                            {...register('ship_subDistrict')}
                            className={`form-control ${errors.ship_subDistrict ? 'is-invalid' : ''}`}
                          />
                          {errors.ship_subDistrict && <small className="invalid-feedback">{errors.ship_subDistrict.message}</small>}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group position-relative">
                          <label className="form-label">District</label>
                          <input
                            type="text"
                            {...register('ship_district')}
                            className={`form-control ${errors.ship_district ? 'is-invalid' : ''}`}
                          />
                          {errors.ship_district && <small className="invalid-feedback">{errors.ship_district.message}</small>}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group position-relative">
                          <label className="form-label">Province</label>
                          <input
                            type="text"
                            {...register('ship_province')}
                            className={`form-control ${errors.ship_province ? 'is-invalid' : ''}`}
                          />
                          {errors.ship_province && <small className="invalid-feedback">{errors.ship_province.message}</small>}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group position-relative">
                          <label className="form-label">Postcode</label>
                          <input
                            type="text"
                            {...register('ship_postcode')}
                            className={`form-control ${errors.ship_postcode ? 'is-invalid' : ''}`}
                          />
                          {errors.ship_postcode && <small className="invalid-feedback">{errors.ship_postcode.message}</small>}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group position-relative">
                          <label className="form-label">Country</label>
                          <input
                            type="text"
                            {...register('ship_country')}
                            className={`form-control ${errors.ship_country ? 'is-invalid' : ''}`}
                          />
                          {errors.ship_country && <small className="invalid-feedback">{errors.ship_country.message}</small>}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group position-relative">
                          <label className="form-label">Phone</label>
                          <input
                            type="text"
                            {...register('ship_phone')}
                            className={`form-control ${errors.ship_phone ? 'is-invalid' : ''}`}
                          />
                          {errors.ship_phone && <small className="invalid-feedback">{errors.ship_phone.message}</small>}
                        </div>
                      </div>
                    </div>
                  }
                  

                </section>

                <section className="mb-4">
                  <h6>Payment Method</h6>
                  <hr />
                  <div className='row form-design form-float-label'>
                    <div className='col-sm-6 pt-4 mb-3'>
                      <div className="form-group position-relative">
                        <label htmlFor="cardholder-name" className="form-label">
                          Name on Card
                        </label>
                        <input
                          id="cardholder-name"
                          type="text"
                          className="border p-3 bg-white w-100"
                          style={{height: 50}}
                          value={cardHolderName}
                          onChange={(e) => setCardHolderName(e.target.value)}
                          placeholder="John Smith"
                          required
                        />
                      </div>
                    </div>
                    <div className='col-sm-6 pt-4 mb-3'>
                      <div className="form-group position-relative">
                        <label htmlFor="card-number" className="form-label">
                          หมายเลขบัตร
                        </label>
                        <div id="card-number" className="border p-3 bg-white" style={{height: 50}}>
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
                    </div>
                    <div className='col-sm-6 pt-4 mb-3'>
                      <div className="form-group position-relative">
                        <label htmlFor="card-expiry" className="form-label">
                          วันหมดอายุ
                        </label>
                        <div id="card-expiry" className="border p-3 bg-white" style={{height: 50}}>
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
                    </div>
                    <div className='col-sm-6 pt-4 mb-3'>
                      <div className="form-group position-relative">
                        <label htmlFor="card-cvc" className="form-label">
                          CVC
                        </label>
                        <div id="card-cvc" className="border p-3 bg-white" style={{height: 50}}>
                          <CardCvcElement 
                            //options={{ style: ELEMENT_STYLE }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <div className="col-sm-4">
                <OrderSummary 
                  orderItems={orderItemsData}
                />
                <button 
                  type="submit"
                  className="w-100 btn design-btn gradient-btn py-3"
                  disabled={!stripe || isLoading}
                >
                  {
                    isLoading 
                    ? 'กำลังดำเนินการ...'  
                    : <><FontAwesomeIcon icon={faCircleCheck} className='text-light me-2' />CONFIRM CHECKOUT</>
                  }
                </button>
                {errorMessage && (
                  <div className="my-4 p-2 alert alert-danger">
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