import { Form  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';

export default function UpsertProduct() {



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
            <div className='col-sm-4'>
              <div className='card'>
                <div className='card-body'>
                  <figure className='text-center'>
                    <img src="/images/dummy-product.jpg" style={{width: 300}} />
                  </figure>

                  {
                    [...Array(3)].map((i, index) => (
                      <div 
                        key={`product_image_input_${index + 1}`} 
                        className='d-flex justify-content-between align-items-center mb-2 px-3 py-1'
                        style={{border: '1px solid rgba(0,0,0,0.3)'}}
                      >
                        <div className='d-flex align-items-center'>
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
            <div className='col-sm-8'>
              <div className='card'>
                <div className='card-body px-5'>
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
          </div>
        </div>

        {/* const dummySpecs = [
          { name: 'Name', value: 'Asus ROG Zephyrus G16 GU605MI-QR225WS Eclipse Gray' },
          { name: 'Screen Size', value: '16.0 inch' },
          { name: 'Processor', value: 'Intel Core Ultra 9 185H, 2.30GHz up to 5.10GHz, 16C(6P+8E+2PE)/22T, 24 MB Intel Smart Cache' },
          { name: 'Display', value: 'WQXGA 2560x1600, 16:10 aspect ratio' },
          { name: 'Memory', value: '32GB' },
          { name: 'Storage', value: '1TB SSD M.2' },
          { name: 'Graphics', value: 'NVIDIA GeForce RTX 4070 Laptop' },
          { name: 'Operating System', value: 'Windows 11 Home' },
          { name: 'Camera', value: 'FHD 1080p IR Camera for Windows Hello' },
          { name: 'Optical Drive', value: 'No' },
          { name: 'Connection Ports', value: '1x Thunderbolt 4 (DP, Power Delivery), 1x USB-C3.2 (DP, Power Delivery), 2x USB3.2, 1x card reader (SD) (UHS-II, 312MB/s)' },
          { name: 'Wireless', value: 'Wi-Fi 6E(802.11ax) (Triple band) 2*2 + Bluetooth v5.3' },
          { name: 'Battery', value: '90Wh, 4S1P, 4-Cell Li-ion' },
          { name: 'Color', value: 'Eclipse Gray' },
          { name: 'Dimemsion WxDxH', value: '35.40 x 24.60 x 1.64 cm' },
          { name: 'Weight', value: '1.85 Kg' },
          { name: 'Warranty', value: '3 Year Onsite Service / 1 Year Perfect Warranty' },
          { name: 'Option', value: 'Keyboard TH/EN // Microsoft Office Home & Student' },
        ] */}

      </div>
    </div>
  )
}