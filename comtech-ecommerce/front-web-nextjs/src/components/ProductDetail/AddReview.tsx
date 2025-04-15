"use client";

import { useSession } from 'next-auth/react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { addReviewAction } from '@/lib/actions';

const formSchema = z.object({
  rating: z.number().nonnegative(),
  message: z.string().min(1, {message: 'Required'}),
});

export default function AddReview({ 
  productId
}: { 
  productId: number
}) {

  const { status, data: session } = useSession();

  const {
      register,
      handleSubmit,
      reset,
      control,
      formState: { errors, isSubmitting }
    } = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        rating: 5,
        message: ""
      }
    });

  const formValue = useWatch({ control })

  const onSubmit = async (data: any) => {
    
    if(session?.user.id && session?.accessToken) {
      const result: any = await addReviewAction({ 
        productId: productId,
        rating: data.rating,
        message: data.message,
        customerId: parseInt(session.user.id),
        accessToken: session.accessToken,
      });

      if(result.success) {
        reset();
        toast.success(result.message);
      }
      else toast.error(result.message);
    }
    else {
      toast.error(`Unauthorized, User id is required`)
    }
  } 

  return(
    <form onSubmit={handleSubmit(onSubmit)} className="form-design">
      <div className='row'>
        <div className='col-sm-6 mb-3'>
          <div className="form-group">
            <label className="form-label">Your rating</label>
            <div className='d-flex align-items-center'>
              <input
                type="range"
                step="1"
                min="0"
                max="5"
                {...register('rating', { valueAsNumber: true })}
                className={`w-100 me-4 ${errors.rating ? 'is-invalid' : ''}`}
                style={{border: 'none'}}
              />
              <strong className='h4'>{ formValue.rating }</strong>
            </div>
            {errors.rating && <small className="invalid-feedback">{errors.rating.message}</small>}
          </div>
        </div>
        <div className='col-sm-12 mb-3'>
          <div className="form-group">
            <textarea
              rows={5}
              placeholder='Your review'
              {...register('message')}
              className={`form-control ${errors.message ? 'is-invalid' : ''}`}
            ></textarea>
            {errors.message && <small className="invalid-feedback">{errors.message.message}</small>}
          </div>
        </div>
        <div className='col-12'>
          <button 
            type="submit"
            className="btn design-btn px-5"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}