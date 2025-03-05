import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { Link } from 'react-router';

export default function Customers() {



  return (
    <div className={`page`}>
          
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center mb-4">
          <h1>Customers</h1>
        </header>

        <div className='col-sm-7'>
          <div className="card">
            <div className="card-body">
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <div className='d-flex'>
                  <button className='btn btn-danger me-2'>Suspend</button>
                  <button className='btn btn-danger'>
                    <FontAwesomeIcon icon={faTrash} className='me-1' />(10)
                  </button>
                </div>
                <div>
                  <InputGroup className="">
                    <Form.Control
                      placeholder="Search customer"
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
                    <th>Customer <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Total Expense <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Account Status <FontAwesomeIcon icon={faMinus} /></th>
                    <th>Sign up At <FontAwesomeIcon icon={faMinus} /></th>
                    <th>Last Active <FontAwesomeIcon icon={faMinus} /></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    [...Array(15)].map((i, index) => (
                      <tr key={`customer_row_${index + 1}`}>
                        <td>
                          <Form.Check
                            type={"checkbox"}
                            id={`select-product`}
                            label={``}
                          />
                        </td>
                        <td><Link to="/customer/1">Yuttapong Laksapto</Link></td>
                        <td>$5,480.00</td>
                        <td><span className='badge text-bg-success'>active</span></td>
                        <td>12 Jan 25</td>
                        <td>12 Jan 25</td>
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

        <div className='col-sm-5'>

          <div className='card mb-3'>
            <div className='card-body'>
              <header className='d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>Customer Interesting</h5>
              </header>
              <div className='d-flex justify-content-center align-items-center' style={{height: 360}}>
                <p className='mb-0'>"Pie Chart Here"</p>
              </div>
            </div>
          </div>

          <div className='card'>
            <div className='card-body'>
              <header>
                <h5>Review Waiting For Approve</h5>
              </header>
              <div className='d-flex justify-content-between align-items-center'>
                <strong>Review</strong>
                <div className='d-flex'>
                  <button className='btn btn-primary me-2'><FontAwesomeIcon icon={faEdit} /></button>
                  <button className='btn btn-danger'><FontAwesomeIcon icon={faTrash} /></button>
                </div>
              </div>
              <hr />
              <div>
                <p style={{maxHeight: 120, overflowY: 'auto'}}>"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum cum saepe dolores reprehenderit inventore dolorum corrupti, harum itaque, eos unde nobis soluta. Repellat nulla est nobis aliquid! Corrupti, magni quaerat."</p>
                <div className='d-flex justify-content-between align-items-center'>
                  <p className='mb-0'><strong>By</strong>: Yuttapong</p>
                  <p className='mb-0'><strong>At</strong>: 12 Jan 25, 12:30:55</p>
                </div>
                <p className='mb-0'><strong>On Product</strong>: Asus ROG Flow Z13 GZ302EA-RU087WA </p>
              </div>
              <div className='w-100 d-flex justify-content-between align-items-center mt-3'>
                <button className='btn btn-link p-0'>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <strong>1 of 50</strong>
                <button className='btn btn-link p-0'>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>

        </div>
        
      </div>
      
    </div>
  )
}