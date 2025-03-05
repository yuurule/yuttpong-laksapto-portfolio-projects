import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faAdd, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../components/MyPagination/MyPagination';

export default function Orders() {



  return (
    <div className={`page`}>
              
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center mb-4">
          <h1>Orders</h1>
        </header>

        <div className='col-sm-8'>
          <div className="card">
            <div className="card-body">
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <div>
                  <div className="dropdown">
                    <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Shipping Actions
                    </button>
                    <ul class="dropdown-menu">
                      <li><a className="dropdown-item" href="#">Mark as Waiting</a></li>
                      <li><a className="dropdown-item" href="#">Mark as Prepare Shipping</a></li>
                      <li><a className="dropdown-item" href="#">Mark as Shipping</a></li>
                      <li><a className="dropdown-item" href="#">Mark as Finish Shipping</a></li>
                    </ul>
                  </div>
                  {/* <button className='btn btn-danger'>
                    <FontAwesomeIcon icon={faTrash} className='me-1' />(10)
                  </button> */}
                </div>
                <div>
                  <InputGroup className="">
                    <Form.Control
                      placeholder="Search order"
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
                    <th></th>
                    <th>#Order ID <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Price <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>By Customer <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Created At <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Status</th>
                    <th>Shipping</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    [...Array(8)].map((i, index) => (
                      <tr key={`product_stock_row_${index + 1}`}>
                        <td>
                          <Form.Check
                            type={"checkbox"}
                            id={`select-product`}
                            label={``}
                          />
                        </td>
                        <td>471138788</td>
                        <td>$1,250.00</td>
                        <td>Yammy Laksapto</td>
                        <td>12 Jan 2025</td>
                        <td>Payment Success<br /><small>12 Jan 2025</small></td>
                        <td>Waiting</td>
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

        <div className='col-sm-4'>
          <div className='card'>
            <div className='card-body'>
              <header>
                <h5>Order Detail</h5>
                <hr />
              </header>
              <div style={{fontSize: '0.9rem'}}>
                <p className='mb-0'><strong>#Order Id</strong> : 471138788</p>
                <p className='mb-0'><strong>Created At</strong> : 12 Jan 2025, 12:30:55</p>
                <p className='mb-0'><strong>Customer</strong> : Yuttapong Laksapto</p> 
                <p className='mb-0'><strong>Address</strong> : 48 Sukhumvit 64/1 Bangkok 10260</p> 
                <p className='mb-0'><strong>Email</strong> : yuu@gmail.com</p> 
                <p><strong>Phone</strong> : 0957983628</p> 
              </div>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    [...Array(3)].map((i, index) => (
                      <tr key={`stock_action_history_row_${index + 1}`}>
                        <td>Asus ROG Flow Z13 GZ302EA-RU087WA</td>
                        <td>x1</td>
                        <td>$599.00<br /><small><s>$640.00</s></small></td>
                      </tr>
                    ))
                  }
                  <tr>
                    <td colSpan={2}>+ vat(7%)</td>
                    <td>$150.00</td>
                  </tr>
                  <tr>
                    <td colSpan={2}><strong>Total Price</strong></td>
                    <td>$2,750.00</td>
                  </tr>
                </tbody>
              </table>
              <p className='text-center h5 mb-0'>Pending</p>
              <p className='text-center mb-0'><small>__ __ __</small></p>
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
  )
}