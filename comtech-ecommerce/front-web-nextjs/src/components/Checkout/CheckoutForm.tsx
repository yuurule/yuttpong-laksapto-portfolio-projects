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
import { orderService, customerService, paymentService, cartService } from '@/services';
import { loadStripe } from '@stripe/stripe-js';
import { createOrderProps, MoneyValueCartTableProps, updateCustomerDetailProps } from '@/types/PropsType';
import { 
  useStripe, 
  useElements, 
  CardElement,
  CardNumberElement, 
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { calculateUsePrice, calculateSubtotal } from '@/utils/utils';


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

export default function CheckoutForm() {

  const { status, data: session } = useSession()

  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [cardHolderName, setCardHolderName] = useState('')
  const [orderItemsData, setOrderItemsData] = useState([])
  const [loadData, setLoadData] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [moneyValue, setMoneyValue] = useState<MoneyValueCartTableProps>({
    cartItems: [],
    subTotal: 0,
    shippingFee: 0,
    vatTotal: 0,
    total: 0,
  });

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

  const formValues = watch()

  useEffect(() => {
    const fetchOrder = async () => {
      setLoadData(true)
      try {
        if(status !== 'loading' && session?.user.id) {
          const cartItems = await cartService.getCartByCustomer(session.user.id);
          //console.log(cartItems.RESULT_DATA)
          const cartData = cartItems.RESULT_DATA;

          if(cartData.length > 0) {
            reset({
              firstName: cartData[0].customer.customerDetail.firstName,
              lastName: cartData[0].customer.customerDetail.lastName,
              address: cartData[0].customer.customerDetail.address,
              subDistrict: cartData[0].customer.customerDetail.subDistrict,
              district: cartData[0].customer.customerDetail.district,
              province: cartData[0].customer.customerDetail.province,
              postcode: cartData[0].customer.customerDetail.postcode,
              country: cartData[0].customer.customerDetail.country,
              phone: cartData[0].customer.customerDetail.phone,
            })
          }

          setOrderItemsData(cartData)
          calculateMoneyValue(cartData)
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
  }, [status]);

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

  const calculateMoneyValue = (cartData: any[]) => {
    const tempResult : MoneyValueCartTableProps = {
      cartItems: [],
      subTotal: 0,
      shippingFee: 0,
      vatTotal: 0,
      total: 0,
    };

    cartData.map((cart: any) => {
      const productPrice = parseFloat(cart.product.price);
      const itemCampaign = cart.product.campaignProducts;
      const usePrice = calculateUsePrice(productPrice, itemCampaign);
      const itemSubTotal = calculateSubtotal(productPrice, itemCampaign, cart.quantity);

      const tempItem: any = {
        id: cart.product.id,
        name: cart.product.name,
        usePrice: usePrice,
        realPrice: productPrice,
        quantity: cart.quantity,
        itemSubTotal: itemSubTotal
      }

      if(itemCampaign.length > 0 && (itemCampaign[0].campaign.startAt !== null && itemCampaign[0].campaign.endAt !== null)) {
        tempItem.campaignId = itemCampaign[0].campaign.id;
        tempItem.discount = parseInt(itemCampaign[0].campaign.discount);
      }

      tempResult.cartItems.push(tempItem);

      tempResult.subTotal += itemSubTotal;
    });

    if(cartData.length > 0) {
      tempResult.shippingFee = tempResult.subTotal >= 5000 ? 0 : 100;
    }
    tempResult.total = tempResult.subTotal + tempResult.shippingFee;
    tempResult.vatTotal = (tempResult.subTotal * 7) / 100;
    tempResult.subTotal = tempResult.subTotal - ((tempResult.subTotal * 7) / 100);

    setMoneyValue(tempResult);
  }

  const onSubmit = async (data: any) => {
    //console.log(data)
    if (!stripe || !elements) {
      // Stripe.js ยังไม่ถูกโหลด
      return
    }

    if(totalPrice <= 0) {
      return
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Create order
      if(session?.user.id) {
        const updateCustomerDetailRequest: updateCustomerDetailProps = {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          address: data.address,
          subDistrict: data.subDistrict,
          district: data.district,
          province: data.province,
          postcode: data.postcode,
          country: data.country,
        }

        const updateCsDetail = await customerService.updateCustomerDetail(session.user.id, updateCustomerDetailRequest)

        const requestData: createOrderProps = {
          customerId: parseInt(session.user.id),
          total: moneyValue.total,
          items: moneyValue.cartItems.map(i => {
            if(i.campaignId) {
              return {
                productId: i.id,
                quantity: i.quantity,
                salePrice: i.usePrice,
                campaignId: i.campaignId,
                discount: i.discount
              }
            }
            else {
              return {
                productId: i.id,
                quantity: i.quantity,
                salePrice: i.usePrice
              }
            }
          }),
          useSameAddress: data.useSameAddr,
          firstName: data.useSameAddr ? data.firstName : data.ship_firstName,
          lastName: data.useSameAddr ? data.lastName : data.ship_lastName,
          phone: data.useSameAddr ? data.phone : data.ship_phone,
          address: data.useSameAddr ? data.address : data.ship_address,
          subDistrict: data.useSameAddr ? data.subDistrict : data.ship_subDistrict,
          district: data.useSameAddr ? data.district : data.ship_district,
          province: data.useSameAddr ? data.province : data.ship_province,
          postcode: data.useSameAddr ? data.postcode : data.ship_postcode,
          country: data.useSameAddr ? data.country : data.ship_country,
        }

        const createOrder = await orderService.createOrder(requestData)
        if(createOrder) {
          // 1. สร้าง Payment Intent ผ่าน API
          const { paymentIntent } = await paymentService.createPaymentIntent(totalPrice, 'thb', createOrder.RESULT_DATA.id);

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
            setIsLoading(false);
            // นำทางไปยังหน้าสำเร็จ
            router.push(`/payment-success?payment_id=${confirmedIntent.id}`);
          } else {
            throw new Error(`Payment status: ${confirmedIntent.status}`);
          }
        }
        else {
          throw new Error(`Checkout failed, cannot create order.`)
        }
      }
      else {
        throw new Error(`Unauthorize, user id is required.`)
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred');
      console.error('Payment error:', error);
      setIsLoading(false);
    }
  }

  return (
    <>
    {
      !loadData
      ?
      <form onSubmit={handleSubmit(onSubmit)} className="row checkout-form">
        <div className="col-lg-8 left-col">
          
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
              !formValues.useSameAddr &&
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
            <small className='alert alert-warning d-block'>
              This is just demo portfolio website, not use real credit card but use this instead<br />
              <strong>Name on card</strong>: Tester<br />
              <strong>Credit card</strong>: 4242 4242 4242 4242<br />
              <strong>Expired</strong>: 12/70<br />
              <strong>CVC</strong>: 123
            </small>
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
        <div className="col-lg-4">
          <OrderSummary 
            orderItems={orderItemsData}
            handleSetTotalPrice={(value) => setTotalPrice(value)}
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
      :
      <p className='h5 text-center opacity-50'>Loading...</p>
    }
    </>
  )
}