import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as CategoryService from '../../services/categoryService';

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
  handleRefreshData
}) {

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
      userId: 1,
      name: data.name,
      description: data.description
    }

    if(action === 'CREATE') {
      try {
        await CategoryService.createCategory(requestData)
          .then(res => {
            console.log(res.RESULT_DATA);
            handleRefreshData();
          });
      }
      catch(error) {
        console.log(`Creating new category error due to: ${error}`);
      }
    }
    else if(action === 'UPDATE') {
      try {
        await CategoryService.updateCategory(currentData.id, requestData)
          .then(res => {
            console.log(res.RESULT_DATA);
            handleRefreshData();
          });
      }
      catch(error) {
        console.log(`Updating category error due to: ${error}`);
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