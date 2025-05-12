"use client"

import React, { useState, useEffect } from 'react'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { customerService } from '@/services'

const formSchema = z.object({
  email: z.string().optional().nullable(),
  displayName: z.string().min(1, { message: 'required' }),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  lineId: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  subDistrict: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  postcode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
})

export default function MyAccountForm() {

  const { status, data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const {
    register, 
    reset,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(formSchema)
  })
  const formValues = watch()

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true)
      try {
        if(status !== 'loading' && session?.user.id) {
          const customer = await customerService.getOneCustomer(session.user.id)
          console.log(customer.RESULT_DATA)
          const result = customer.RESULT_DATA
          reset({
            email: result.email,
            displayName: result.displayName,
            firstName: result.customerDetail.firstName,
            lastName: result.customerDetail.lastName,
            phone: result.customerDetail.phone,
            lineId: result.customerDetail.lineId,
            address: result.customerDetail.address,
            subDistrict: result.customerDetail.subDistrict,
            district: result.customerDetail.district,
            province: result.customerDetail.province,
            postcode: result.customerDetail.postcode,
            country: result.customerDetail.country,
          })
        }
      }
      catch(error) {
        console.log(`Fetch customer is failed due to reason: ${error}`);
        toast.error(`Fetch customer is failed due to reason: ${error}`);
      }
      finally { setLoading(false); }
    }

    fetchCustomer()
  }, [status])

  const onSubmit = async (data: any) => {
    console.log(data)
    alert('Comming soon')
  }

  // if(loading) return <p>Loading...</p>

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-account-form">

      <div className="box-label mb-5">
        <strong className="box-label-header">My Infomation</strong>
        <dl className="row">

          <dt className="col-sm-3">Email Address</dt>
          <dd className="col-sm-9">
            <input
              type="text"
              {...register('email')}
              disabled={true}
              className={`form-control w-50 mb-2 ${errors.email ? 'is-invalid' : ''}`}
            />
          </dd>

          <dt className="col-sm-3">Display Name</dt>
          <dd className="col-sm-9">
            <input
              type="text"
              {...register('displayName')}
              className={`form-control w-50 mb-2 ${errors.displayName ? 'is-invalid' : ''}`}
            />
          </dd>

          <dt className="col-sm-3">First name</dt>
          <dd className="col-sm-9">
            <input
              type="text"
              {...register('firstName')}
              className={`form-control w-50 mb-2 ${errors.firstName ? 'is-invalid' : ''}`}
            />
          </dd>

          <dt className="col-sm-3">Last Name</dt>
          <dd className="col-sm-9">
            <input
              type="text"
              {...register('lastName')}
              className={`form-control w-50 mb-2 ${errors.lastName ? 'is-invalid' : ''}`}
            />
          </dd>

          <dt className="col-sm-3">Phone</dt>
          <dd className="col-sm-9">
            <input
              type="text"
              {...register('phone')}
              className={`form-control w-50 mb-2 ${errors.phone ? 'is-invalid' : ''}`}
            />
          </dd>

          <dt className="col-sm-3">Line ID</dt>
          <dd className="col-sm-9">
            <input
              type="text"
              {...register('lineId')}
              className={`form-control w-50 mb-2 ${errors.lineId ? 'is-invalid' : ''}`}
            />
          </dd>

        </dl>
      </div>

      <div className="box-label mb-3">
        <strong className="box-label-header">Address</strong>
        <dl className="row">

          <dt className="col-sm-3">Address</dt>
          <dd className="col-sm-9">
            <textarea
              rows={3}
              {...register('address')}
              className={`form-control w-50 mb-2 ${errors.address ? 'is-invalid' : ''}`}
            />
          </dd>

          <dt className="col-sm-3">Sub district</dt>
          <dd className="col-sm-9">
            <input
              type="text"
              {...register('subDistrict')}
              className={`form-control w-50 mb-2 ${errors.subDistrict ? 'is-invalid' : ''}`}
            />
          </dd>

          <dt className="col-sm-3">District</dt>
          <dd className="col-sm-9">
            <input
              type="text"
              {...register('district')}
              className={`form-control w-50 mb-2 ${errors.district ? 'is-invalid' : ''}`}
            />
          </dd>

          <dt className="col-sm-3">Post Code</dt>
          <dd className="col-sm-9">
            <input
              type="text"
              {...register('postcode')}
              className={`form-control w-50 mb-2 ${errors.postcode ? 'is-invalid' : ''}`}
            />
          </dd>

          <dt className="col-sm-3">Province</dt>
          <dd className="col-sm-9">
            <input
              type="text"
              {...register('province')}
              className={`form-control w-50 mb-2 ${errors.province ? 'is-invalid' : ''}`}
            />
          </dd>

          <dt className="col-sm-3">Country</dt>
          <dd className="col-sm-9">
            <input
              type="text"
              {...register('country')}
              className={`form-control w-50 mb-2 ${errors.country ? 'is-invalid' : ''}`}
            />
          </dd>

        </dl>
      </div>

      <div className="d-flex justify-content-end">
        <button 
          type="submit"
          className="btn design-btn px-5"
          disabled={isSubmitting}
        >
          {
            isSubmitting 
            ? 'กำลังดำเนินการ...'  
            : <><FontAwesomeIcon icon={faSave} className='text-light me-2' />Save</>
          }
        </button>
      </div>
    </form>
  )
}