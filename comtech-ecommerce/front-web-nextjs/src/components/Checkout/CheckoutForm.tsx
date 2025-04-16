"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import OrderSummary from "@/components/Checkout/OrderSummary";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';
import { orderService } from '@/services/orderService';
import { customerService } from '@/services';
import { useRouter } from 'next/navigation';

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

export default function CheckoutForm({ orderId } : { orderId: string }) {

  const { status, data: session } = useSession();
  const router = useRouter();
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
                reset({
                  firstName: customerDetail.firstName,
                  lastName: customerDetail.lastName,
                  region: customerDetail.region,
                  street: customerDetail.street,
                  postcode: customerDetail.postcode,
                  city: customerDetail.city,
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

  const onSubmit = async (data: any) => {
    try {
      await orderService.updateOrder(orderId, 'PAID')
        .then(res => {
          console.log(res);
          toast.success(`Your order is payment successfully!`);
          router.push(`/thankyou`);
        });
    }
    catch(error) {
      console.log(`Checkout is failed due to reason: ${error}`);
      toast.error(`Checkout is failed due to reason: ${error}`);
    }
  }

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
                    {/* <div className="col-sm-12">
                      <div className="form-group position-relative">
                        <label className="form-label">Order notes (optional)</label>
                        <textarea
                          rows={5}
                          {...register('note')}
                          className={`form-control ${errors.note ? 'is-invalid' : ''}`}
                          style={{minHeight: 100}}
                          disabled={true}
                        >{}</textarea>
                        {errors.note && <small className="invalid-feedback">{errors.note.message}</small>}
                      </div>
                    </div> */}
                  </div>
                </section>

                <section className="mb-4">
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
                </section>
              </div>
              <div className="col-sm-4">
                <OrderSummary 
                  orderItems={orderItemsData}
                />
                <button 
                  type="submit"
                  className="w-100 btn design-btn gradient-btn py-3"
                >
                  {
                    isSubmitting 
                    ? <FontAwesomeIcon icon={faRefresh} className='text-light' /> 
                    : <><FontAwesomeIcon icon={faCircleCheck} className='text-light me-2' />CHECKOUT</>
                  }
                </button>
              </div>
            </form>
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