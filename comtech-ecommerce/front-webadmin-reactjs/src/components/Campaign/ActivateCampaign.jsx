import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import Form from 'react-bootstrap/Form';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormHelperText, FormControl } from '@mui/material';
import { useForm, Controller  } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as CampaignService from '../../services/campaignService';

dayjs.extend(isSameOrAfter);

const activatCampaignSchema = z.object({
  isActive: z
    .boolean({  required_error: 'required' }),
  startAt: z
    .any()
    .refine((date) => dayjs(date).isValid(), { message: 'วันที่ไม่ถูกต้อง' }),
  endAt: z
    .any()
    .refine((date) => dayjs(date).isValid(), { message: 'วันที่ไม่ถูกต้อง' }),
})
// ใช้ .refine ในระดับฟอร์มเพื่อเปรียบเทียบค่าระหว่างสองฟิลด์
.refine(data => {
  // ตรวจสอบว่ามีค่าทั้งสองฟิลด์ และ endAt ไม่น้อยกว่า startAt
  if (!data.startAt || !data.endAt) return true; // ข้ามการตรวจสอบถ้าฟิลด์ใดฟิลด์หนึ่งว่าง
  
  return dayjs(data.endAt).isSameOrAfter(dayjs(data.startAt));
}, {
  message: "วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น",
  path: ["endAt"] // แสดงข้อความ error ที่ฟิลด์ endAt
});

export default function ActivateCampaign({
  openDialog,
  handleCloseDialog,
  selectedActivateCampaign=null,
  handleRefreshData
}) {

  const authUser = useSelector(state => state.auth.user);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(activatCampaignSchema),
    defaultValues: {
      isActive: selectedActivateCampaign?.isActive,
      startAt: selectedActivateCampaign?.startAt,
      endAt: selectedActivateCampaign?.endAt
    }
  });

  const isActive = watch('isActive');
  const startDate = watch('startAt');

  useEffect(() => {
    if(selectedActivateCampaign) {
      reset(selectedActivateCampaign);
    }
  }, [selectedActivateCampaign]);

  const onSubmit = async (data) => {
    //console.log(data)

    const formattedData = {
      startAt_iso: dayjs(data.startAt).toISOString(),
      endAt_iso: dayjs(data.endAt).toISOString(),
    };

    const requestData = {
      userId: authUser.id,
      isActive: data.isActive,
      startAt: data.isActive === true ? formattedData.startAt_iso : null,
      endAt: data.isActive === true ? formattedData.endAt_iso : null,
    }

    try {
      await CampaignService.activateCampaign(selectedActivateCampaign.id, requestData)
        .then(res => {
          handleRefreshData();
          toast.success(` is successfully!`);
          handleCloseDialog();
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

  return (
    <Dialog open={openDialog}>
    
      <DialogTitle className='pb-0'>
        <p className='h4'>Activate/Deactivate Campaign</p>
        <hr />
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{width: 480}}>
        <DialogContent>
          <div className="form-group mb-4">
            <label className='form-label'>Activate / Deactivate</label>
            <Form.Check
              type="switch"
              id="custom-switch"
              label={isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
              {...register('isActive')}
              isInvalid={!!errors.isActive}
            />
            {
              errors.isActive && (
                <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                  {errors.isActive.message}
                </Form.Control.Feedback>
              )
            }
          </div>

          <div className='row'>
            <div className='col-6'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="startAt"
                  control={control}
                  render={({ field }) => (
                    <FormControl error={!!errors.startAt} fullWidth sx={{ mb: 2 }}>
                      <DatePicker
                        label="Start At"
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        slotProps={{
                          textField: {
                            error: !!errors.startAt,
                            helperText: errors.startAt?.message,
                          }
                        }}
                      />
                    </FormControl>
                  )}
                />
              </LocalizationProvider>
            </div>
            <div className='col-6'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="endAt"
                  control={control}
                  render={({ field }) => (
                    <FormControl error={!!errors.endAt} fullWidth sx={{ mb: 2 }}>
                      <DatePicker
                        label="End At"
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        minDate={startDate ? dayjs(startDate) : undefined}
                        slotProps={{
                          textField: {
                            error: !!errors.endAt,
                            helperText: errors.endAt?.message,
                          }
                        }}
                      />
                    </FormControl>
                  )}
                />
              </LocalizationProvider>
            </div>
          </div>
          
        </DialogContent>
        <DialogActions className='d-flex justify-content-center'>
          <button 
            type="submit"
            className='btn btn-success px-4 me-2'
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faSave} className='me-2' />
            {isSubmitting ? 'Processing...' : 'Save'}
          </button>
          <button 
            type="button"
            className='btn btn-danger px-4'
            disabled={isSubmitting}
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