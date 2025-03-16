import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function AddProductInCampaign({
  openDialog,
  handleCloseDialog,
}) {


  return (
    <Dialog open={openDialog}>
    
      <DialogTitle className='pb-0'>
        <p className='h4 mb-0'>Select Products</p>
        <small className='opacity-50'>Result 80 items</small>
        <hr />
      </DialogTitle>
      
      {/* <form onSubmit={handleSubmit(onSubmit)} style={{width: 550}}> */}
        <DialogContent style={{width: 600}}>
          
          <div className='row'>

            <div className='col-3'>
              <strong>Product Brand</strong>
              <Form.Check
                type="checkbox"
                label="Asus"
              />
              
              <strong className='mt-3 d-block'>Category</strong>
              <Form.Check
                type="checkbox"
                label="Gaming"
              />
            </div>

            <div className='col-9'>
              <div style={{maxHeight: 600, overflowY: 'auto'}}>
                {
                  [...Array(10)].map((i, index) => (
                    <div key={`product_list_${index}`} className='card w-100 mb-3'>
                      <div className='card-body d-flex justify-content-between'>
                        <div className='d-flex'>
                          <Form.Check
                            type="checkbox"
                            label=""
                          />
                          <p className='mb-0'>Product name</p>
                        </div>
                        <p className='mb-0'>฿59,990</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

          </div>

        </DialogContent>
        <DialogActions className='d-flex justify-content-center'>
          <button 
            type="submit"
            className='btn btn-success px-4 me-2'
          >
            <FontAwesomeIcon icon={faSave} className='me-2' />
            {/* {isSubmitting ? 'Processing...' : 'Add'} */}
            Confirm Add
          </button>
          <button 
            type="button"
            className='btn btn-danger px-4'
            onClick={() => {
              handleCloseDialog();
            }}
          ><FontAwesomeIcon icon={faClose} className='me-2' />Cancel</button>
        </DialogActions>
      {/* </form> */}

    </Dialog>
  )
}