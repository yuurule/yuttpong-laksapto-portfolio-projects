"use client";

import React, { useState } from "react";
import TextInput from "@/components/FormInput/TextInput";
import { renderLabelInput } from "@/utils/rendering";
import { signIn } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { customerService } from "@/services";
import { toast } from "react-toastify";

const formSchema = z.object({
  email: z.string().min(1, {message: 'Required'}),
  displayName: z.string().min(1, {message: 'Required'}),
  password: z.string().min(1, {message: 'Required'}),
  confirmPassword: z.string().min(1, {message: 'Required'}),
});

export default function SignUp({
  handleClose,
  handleSetActionType
}: {
  handleClose: () => void,
  handleSetActionType: (value: string) => void,
}) {

  const url = usePathname();
  const router = useRouter();
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(formSchema)
  });
  
  const onSubmit = async (data: any) => {
    setError("")

    if(data.password !== data.confirmPassword) {
      setError('Your confirm password is not correct');
      return;
    }

    try {
      const newRegister = await customerService.signUp(
        data.email,
        data.password,
        data.displayName
      );

      if(newRegister) {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        
        if (result?.error) {
          throw new Error(result.error)
        } else {
          handleClose();
          router.push(url);
        }
      }
    }
    catch(error: any) {
      setError(error.response.data.message);
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="form-design form-float-label"
    >
      <div className="card-body">
        <strong className="h4 text-center d-block mb-2">New Sign Up</strong>
        <div className="row px-4">
          { 
            error !== "" && 
            <div className="col-12">
              <small className="alert alert-danger py-2 d-block">{error}</small>
            </div> 
          }
          <div className="col-12 mb-2">
            <div className="form-group position-relative">
              <label className="form-label">Email</label>
              <input
                type="email"
                {...register('email')}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              />
              {errors.email && <small className="invalid-feedback">{errors.email.message}</small>}
            </div>
          </div>
          <div className="col-12 mb-2">
            <div className="form-group position-relative">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                {...register('displayName')}
                className={`form-control ${errors.displayName ? 'is-invalid' : ''}`}
              />
              {errors.displayName && <small className="invalid-feedback">{errors.displayName.message}</small>}
            </div>
          </div>
          <div className="col-12 mb-2">
            <div className="form-group position-relative">
              <label className="form-label">Password</label>
              <input
                type="password"
                {...register('password')}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              />
              {errors.password && <small className="invalid-feedback">{errors.password.message}</small>}
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="form-group position-relative">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              />
              {errors.confirmPassword && <small className="invalid-feedback">{errors.confirmPassword.message}</small>}
            </div>
          </div>
          <div className="col-12">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn design-btn w-100 py-2 mb-2"
            >{ isSubmitting ? '...Checking' : 'SIGN UP' }</button>
          </div>
        </div>
      </div>
      <p className='text-center mb-0'>
        Already have account? 
        <button 
          type="button"
          className='btn btn-link p-0 ms-2'
          onClick={() => {
            reset();
            handleSetActionType('signin');
          }}
        > Sign in</button>
      </p>
    </form>
  )
}