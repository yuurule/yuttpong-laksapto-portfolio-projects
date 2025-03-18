import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as CampaignService from '../../services/campaignService';

const campaignSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'required' }),
  description: z
    .string()
    .min(1, { message: 'required' }),
  discount: z
    .coerce
    .number()
    .min(1, { message: 'required' }),
});

export default function UpsertCampaign({
  openDialog,
  handleCloseDialog,
  upsertAction=null,
  selectedEditCampaign=null,
  handleRefreshData,
  handleResetToCreate
}) {

  const authUser = useSelector(state => state.auth.user);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: selectedEditCampaign?.name,
      description: selectedEditCampaign?.description,
      discount: selectedEditCampaign?.discount
    }
  });

  useEffect(() => {
    if(selectedEditCampaign) {
      reset(selectedEditCampaign);
    }
  }, [selectedEditCampaign]);


  const onSubmit = async (data) => {
    
    const requestData = {
      userId: authUser.id,
      name: data.name,
      discount: data.discount,
      description: data.description
    }

    if(upsertAction === 'CREATE') {
      try {
        await CampaignService.createCampaign(requestData)
          .then(res => {
            handleRefreshData();
            reset(selectedEditCampaign);
            toast.success(`Creating new campaign is successfully!`);
            handleCloseDialog();
          })
          .catch(error => {
            throw new Error(`Creating new campaign error due to: ${error}`)
          });
      }
      catch(error) {
        console.log(error);
        toast.error(error);
      }
    }
    else if(upsertAction === 'EDIT') {
      try {
        await CampaignService.updateCampaign(selectedEditCampaign.id, requestData)
          .then(res => {
            handleRefreshData();
            handleResetToCreate();
            toast.success(`Update campaign is successfully!`);
            handleCloseDialog();
          })
          .catch(error => {
            throw new Error(`Update new campaign error due to: ${error}`)
          });
      }
      catch(error) {
        console.log(error);
        toast.error(error);
      }
    }

  }

  return (
    <Dialog open={openDialog}>
    
      <DialogTitle className='pb-0'>
        <h4>{upsertAction === 'CREATE' && 'Creat New'}{upsertAction === 'EDIT' && 'Edit'} Campaign</h4>
        <hr />
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{width: 480}}>
        <DialogContent>
          <div className="form-group mb-3">
            <label className='form-label'>Campaign Name</label>
            <input
              type="text"
              {...register('name')}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && <small className="invalid-feedback">{errors.name.message}</small>}
          </div>

          <div className="form-group mb-3">
            <label className='form-label'>Discount Value (%)</label>
            <input
              type="number"
              min={0}
              {...register('discount')}
              className={`form-control ${errors.discount ? 'is-invalid' : ''}`}
            />
            {errors.discount && <small className="invalid-feedback">{errors.discount.message}</small>}
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
        </DialogContent>
        <DialogActions className='d-flex justify-content-center'>
          <button 
            type="submit"
            className='btn btn-success px-4 me-2'
          >
            <FontAwesomeIcon icon={faSave} className='me-2' />
            {isSubmitting ? 'Processing...' : `${upsertAction === 'CREATE' ? 'Create' : 'Save'}`}
          </button>
          <button 
            type="button"
            className='btn btn-danger px-4'
            onClick={() => {
              handleCloseDialog();
              reset();
            }}
          ><FontAwesomeIcon icon={faClose} className='me-2' />Cancel</button>
        </DialogActions>
      </form>

    </Dialog>
  )
}