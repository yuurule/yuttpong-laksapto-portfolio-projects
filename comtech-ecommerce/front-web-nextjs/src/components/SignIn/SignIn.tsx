"use client";

import React, { useState } from "react";
import { signIn } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().min(1, {message: 'Required'}),
  password: z.string().min(1, {message: 'Required'}),
});

export default function SignIn({
  handleClose,
  handleSetActionType
}: {
  handleClose: () => void,
  handleSetActionType: (value: string) => void,
}) {

  const url = usePathname();
  const router = useRouter();
  const [error, setError] = useState("");

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
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    
    if (result?.error) {
      if(result.status === 401) {
        setError('Your credentails is not correct');
      }
    } else {
      handleClose();
      router.push(url);
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="form-design form-float-label"
    >
      <div className="card-body">
        <strong className="h4 text-center d-block mb-2">Sign In</strong>
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
          <div className="col-12 mb-4">
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
          <div className="col-12">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn design-btn w-100 py-2 mb-2"
            >{ isSubmitting ? '...Checking' : 'SIGN IN' }</button>
          </div>
        </div>
      </div>
      <p className='text-center mb-0'>
        Not have account yet? 
        <button 
          type="button"
          className='btn btn-link p-0 ms-2'
          onClick={() => {
            reset();
            handleSetActionType('signup');
          }}
        > New sign up</button>
      </p>
    </form>
  )
}