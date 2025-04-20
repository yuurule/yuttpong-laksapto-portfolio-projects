import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as TagService from '../../services/tagService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const categorySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'กรุณากรอกชื่อ' })
});

export default function UpsertTag({
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
      name: currentData.name
    }
  });

  useEffect(() => {
    if(currentData) {
      reset(currentData);
    }
  }, [currentData])

  const renderHeader = () => {
    if(action === "CREATE") {
      return "Create New Tag";
    }
    else if(action === "UPDATE") {
      return `Edit Tag "${currentData.name}"`
    }
  }

  const onSubmit = async (data) => {

    const requestData = {
      userId: authUser.id,
      name: data.name
    }

    if(action === 'CREATE') {
      try {
        await TagService.createTag(requestData)
          .then(res => {
            console.log(res.RESULT_DATA);
            handleRefreshData();
            reset(currentData);
            toast.success(`Creating new tag is successfully!`);
          })
          .catch(error => {
            throw new Error(`Creating new tag error due to: ${error}`)
          });
      }
      catch(error) {
        console.log(error);
        toast.error(error);
      }
    }
    else if(action === 'UPDATE') {
      try {
        await TagService.updateTag(currentData.id, requestData)
          .then(res => {
            console.log(res.RESULT_DATA);
            handleRefreshData();
            handleResetToCreate();
            toast.success(`Updating tag is successfully!`);
          })
          .catch(error => {
            throw new Error(`Updating tag error due to: ${error}`)
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
      <h5>{renderHeader()}<span></span></h5>
    </header>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group my-3">
        <label className='form-label'>Tag Name</label>
        <input
          type="text"
          {...register('name')}
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
        />
        {errors.name && <small className="invalid-feedback">{errors.name.message}</small>}
      </div>

      <div className='d-flex justify-content-end'>
        <button type="submit" disabled={isSubmitting} className='btn my-btn blue-btn big-btn px-4'>
          {isSubmitting ? 'Processing...' : `${action === 'CREATE' ? 'Create' : 'Save'}`}
        </button>
      </div>

      
    </form>
    </>
    
  )
}