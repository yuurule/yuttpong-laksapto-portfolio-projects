"use client";

import OrderSummary from "@/components/Checkout/OrderSummary";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  firstName: z.string().min(1, {message: 'Required'}),
  lastName: z.string().min(1, {message: 'Required'}),
  region: z.string().min(1, {message: 'Required'}),
  street: z.string().min(1, {message: 'Required'}),
  postcode: z.string().min(1, {message: 'Required'}),
  city: z.string().min(1, {message: 'Required'}),
  phone: z.string().min(1, {message: 'Required'}),
  note: z.string(),
  nameOnCard: z.string(),
  cardNumber: z.string(),
  validThrough: z.string(),
  cvc: z.string(),
});

export default function CheckoutForm() {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: any) => {
    
  }

  return (
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
                <label className="form-label">Country / Region</label>
                <input
                  type="text"
                  {...register('region')}
                  className={`form-control ${errors.region ? 'is-invalid' : ''}`}
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
                />
                {errors.phone && <small className="invalid-feedback">{errors.phone.message}</small>}
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group position-relative">
                <label className="form-label">Order noteds (optional)</label>
                <textarea
                  rows={5}
                  {...register('note')}
                  className={`form-control ${errors.note ? 'is-invalid' : ''}`}
                ></textarea>
                {errors.note && <small className="invalid-feedback">{errors.note.message}</small>}
              </div>
            </div>
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
        <OrderSummary />
        <button 
          type="submit"
          className="w-100 btn design-btn gradient-btn py-3"
        >
          PLACE ORDER
        </button>
      </div>
    </form>
  )
}