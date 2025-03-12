import { useState, useEffect } from 'react';
import { Form  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faClose, faBars } from '@fortawesome/free-solid-svg-icons';
import * as ProductService from '../../services/productService';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  screen_size: z.string(),
  processor: z.string(),
  display: z.string(),
  memory: z.number().positive(),
  storage: z.string(),
  graphic: z.string(),
  operating_system: z.string(),
  camera: z.string().optional(),
  optical_drive: z.string().optional(),
  connection_ports: z.string(),
  wireless: z.string(),
  battery: z.string(),
  color: z.string(),
  width: z.number().positive(),
  depth: z.number().positive(),
  height: z.number().positive(),
  weight: z.number().positive(),
  warranty: z.string().optional(),
  option: z.string().optional(),
});

export default function UpsertProduct() {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(categorySchema),
    // defaultValues: {
    //   name: currentData.name,
    //   description: currentData.description
    // }
  });

  useEffect(() => {

  }, []);

  const onSubmit = async () => {

  }

  return (
    <div className={`page`}>
      
      <div className="row">

        <header className="col-12 d-flex justify-content-between align-items-center mb-4">
          <h1>Add New Product</h1>
          <div>
            <button className='btn btn-success px-5 py-2'><FontAwesomeIcon icon={faSave} className='me-2' />Save</button>
          </div>
        </header>

        <div className='col-sm-12'>
          <div className='row'>
            <div className='col-sm-3'>
              <div className='card mb-3'>
                <div className='card-body'>
                  <figure className='text-center'>
                    <img src="/images/dummy-product.jpg" style={{width: 300}} />
                  </figure>

                  {
                    [...Array(3)].map((i, index) => (
                      <div 
                        key={`product_image_input_${index + 1}`} 
                        className='d-flex justify-content-between align-items-center mb-2 px-3 py-1'
                        style={{border: '1px solid rgba(0,0,0,0.3)', borderRadius: 6}}
                      >
                        <div className='d-flex align-items-center'>
                          <FontAwesomeIcon icon={faBars} className='me-2' />
                          <figure className='mb-0 me-3'>
                            <img src="/images/dummy-product.jpg" style={{width: 75}} className='' />
                          </figure>
                          { index === 0 && <span className='badge text-bg-primary'>Primary</span> }
                        </div>
                        <div>
                          <button className='btn btn-primary me-2'><FontAwesomeIcon icon={faEdit} /></button>
                          <button className='btn btn-danger'><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                      </div>
                    ))
                  }

                  <div className='text-center'>
                    <button className='btn btn-primary px-4 mt-2'>+ Add New Image</button>
                  </div>

                </div>
              </div>
            </div>
            <div className='col-sm-5'>
              <div className='card'>
                <div className='card-body'>
                  <header>
                    <h5>Product Specifications</h5>
                    <hr />
                  </header>
                  <Form className='mt-4'>
                    <dl className='row'>
                      <dt className='col-sm-3 mb-3'>Name</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Screen Size</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Processor</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control as="textarea" rows={2} />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Display</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Memory</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control type="number" />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Storage</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Graphics</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Operating System</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Camera</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Optical Drive</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Connection Ports</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control as="textarea" rows={2} />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Wireless</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control as="textarea" rows={2} />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Battery</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Color</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Dimension (WxDxH)</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className='row'>
                          <div className='col-sm-4'><Form.Control type="number" /></div>
                          <div className='col-sm-4'><Form.Control type="number" /></div>
                          <div className='col-sm-4'><Form.Control type="number" /></div>
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Weight</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control type="number" />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Warranty</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control />
                      </dd>
                      <dt className='col-sm-3 mb-3'>Option</dt>
                      <dd className='col-sm-9 mb-3'>
                        <Form.Control />
                      </dd>
                    </dl>
                  </Form>
                </div>
              </div>
            </div>
            <div className='col-sm-4'>
              <div className='card mb-3'>
                <div className='card-body'>
                  <Form.Group>
                    <Form.Label>Product Detail</Form.Label>
                    <Form.Control as="textarea" rows={12} />
                  </Form.Group>
                </div>
              </div>
              <div className='card mb-3'>
                <div className='card-body'>
                  <header className='d-flex justify-content-between align-items-center mb-3'>
                    <h5>Category</h5>
                    <button className='btn btn-primary'><small>+ Add</small></button>
                  </header>
                  <div className='d-flex mb-2' style={{border: '1px solid rgba(0,0,0,0.3)', borderRadius: 4, padding: 15}}>
                    <button className='btn btn-secondary me-2'><small>Working <FontAwesomeIcon icon={faClose} /></small></button>
                    <button className='btn btn-secondary me-2'><small>Gaming <FontAwesomeIcon icon={faClose} /></small></button>
                  </div>
                </div>
              </div>
              <div className='card'>
                <div className='card-body'>
                  <header className='d-flex justify-content-between align-items-center mb-3'>
                    <h5>Tag</h5>
                    <button className='btn btn-primary'><small>+ Add</small></button>
                  </header>
                  <div className='d-flex mb-2' style={{border: '1px solid rgba(0,0,0,0.3)', borderRadius: 4, padding: 15}}>
                    <button className='btn btn-secondary me-2'><small>Slim <FontAwesomeIcon icon={faClose} /></small></button>
                    <button className='btn btn-secondary me-2'><small>Hi-end <FontAwesomeIcon icon={faClose} /></small></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}