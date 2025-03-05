import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faAdd, faMinus } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../components/MyPagination/MyPagination';

export default function Stock() {


  return (
    <div className={`page`}>
          
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center mb-4">
          <h1>Product Stock</h1>
        </header>

        <div className='col-sm-6'>
          <div className="card">
            <div className="card-body">
              <div className='d-flex justify-content-end align-items-center'>
                <div>
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="Search product"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                    />
                    <Button variant="primary" id="button-addon2">
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </InputGroup>
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Product <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>In Stock <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Last Updated</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    [...Array(8)].map((i, index) => (
                      <tr key={`product_stock_row_${index + 1}`}>
                        <td style={{width: 300}}>
                          <div className="d-flex align-items-center">
                            <figure className='me-2'>
                              <img src="/images/dummy-product.jpg" style={{width: 60}} />
                            </figure>
                            <div>
                              Asus ROG Flow Z13 GZ30...<br /><small>SKU:471138788</small>
                            </div>
                          </div>
                        </td>
                        <td>25</td>
                        <td>12 Jan 2025<br /><small>By Webadmin</small></td>
                        <td>
                          <div className='d-flex'>
                            <button className='btn btn-primary me-2'><FontAwesomeIcon icon={faAdd} /></button>
                            <button className='btn btn-danger'><FontAwesomeIcon icon={faMinus} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <div className='d-flex justify-content-center'>
                <MyPagination />
              </div>
            </div>
          </div>
        </div>

        <div className='col-sm-6'>
          <div className='card'>
            <div className='card-body'>
              <header>
              <h5>Stock Action History</h5>
              </header>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Action</th>
                    <th>Amount</th>
                    <th>Date/Time <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>By</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    [...Array(8)].map((i, index) => (
                      <tr key={`stock_action_history_row_${index + 1}`}>
                        <td>Asus ROG Flow Z13<br /><small>SKU:471138788</small></td>
                        <td><span className='badge text-bg-success'>ADD</span></td>
                        <td>20</td>
                        <td>12 Jan 25<br /><small>13:30:55</small></td>
                        <td>Webadmin</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <div className='d-flex justify-content-center'>
                <MyPagination />
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
  )
}