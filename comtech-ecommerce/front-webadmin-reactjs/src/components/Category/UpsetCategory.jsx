import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as CategoryService from '../../services/categoryService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const categorySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'กรุณากรอกชื่อ' }),
  description: z
    .string()
    .min(1, { message: 'กรุณากรอกคำอธิบาย' }),
});

export default function UpsertCategory({
  action='CREATE',
  currentData,
  handleRefreshData,
  handleResetToCreate
}) {

  const authUser = useSelector(state => state.auth.user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: currentData.name,
      description: currentData.description
    }
  });

  useEffect(() => {
    if(currentData) {
      reset(currentData);
    }
  }, [currentData])

  const renderHeader = () => {
    if(action === "CREATE") {
      return "Create New Category";
    }
    else if(action === "UPDATE") {
      return `Update Category "${currentData.name}"`
    }
  }

  const onSubmit = async (data) => {

    const requestData = {
      userId: authUser.id,
      name: data.name,
      description: data.description
    }

    if(action === 'CREATE') {
      try {
        await CategoryService.createCategory(requestData)
          .then(res => {
            //console.log(res.RESULT_DATA);
            handleRefreshData();
            reset(currentData);
            toast.success(`Creating new category is successfully!`);
          })
          .catch(error => {
            throw new Error(`Creating new category error due to: ${error}`)
          });
      }
      catch(error) {
        console.log(error);
        toast.error(error);
      }
    }
    else if(action === 'UPDATE') {
      try {
        await CategoryService.updateCategory(currentData.id, requestData)
          .then(res => {
            //console.log(res.RESULT_DATA);
            handleRefreshData();
            handleResetToCreate();
            toast.success(`Updating category is successfully!`);
          })
          .catch(error => {
            throw new Error(`Updating category error due to: ${error}`)
          });
      }
      catch(error) {
        console.log(error);
        toast.error(error);
      }
    }
  }

  return (
    <>
    <header>
      <h5>{renderHeader()}</h5>
      <hr />
    </header>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group mb-3">
        <label className='form-label'>Category Name</label>
        <input
          type="text"
          {...register('name')}
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
        />
        {errors.name && <small className="invalid-feedback">{errors.name.message}</small>}
      </div>

      <div className="form-group mb-3">
        <label className='form-label'>Description</label>
        <textarea
          rows={5}
          {...register('description')}
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
        ></textarea>
        {errors.description && <small className="invalid-feedback">{errors.description.message}</small>}
      </div>

      <div className='d-flex justify-content-end'>
        <button type="submit" disabled={isSubmitting} className='btn btn-primary px-4'>
          {isSubmitting ? 'Processing...' : `${action === 'CREATE' ? 'Create' : 'Save'}`}
        </button>
      </div>

      
    </form>
    </>
    
  )
}