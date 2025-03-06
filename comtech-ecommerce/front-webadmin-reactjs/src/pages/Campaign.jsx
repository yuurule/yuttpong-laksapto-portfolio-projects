import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../components/MyPagination/MyPagination';
import { Link } from 'react-router';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import PaginationArrow from '../components/PaginationArrow/PaginationArrow';

export default function Campaign() {


  return (
    <div className={`page`}>
      
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1>Campaigns</h1>
            <Breadcrumbs />
          </div>
          <div>
            <Link to="/product/create" className='btn btn-primary text-bg-primary'>+ Create New Campaign</Link>
          </div>
        </header>

        <div className='col-sm-8'>
          <div className="card">
            <div className="card-body">
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <div className='d-flex'>
                  <button className='btn btn-danger me-2'>Delete</button>
                  <button className='btn btn-danger'>
                    <FontAwesomeIcon icon={faTrash} className='me-1' />(10)
                  </button>
                </div>
                <div>
                  <InputGroup className="">
                    <Form.Control
                      placeholder="Search campaign"
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
                    <th>Campaign Name <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Discount <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Created At <FontAwesomeIcon icon={faMinus} /></th>
                    <th>End At <FontAwesomeIcon icon={faMinus} /></th>
                    <th>Last Update <FontAwesomeIcon icon={faMinus} /></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    [...Array(4)].map((i, index) => (
                      <tr key={`category_row_${index + 1}`}>
                        <td>
                          <Form.Check
                            type={"checkbox"}
                            id={`select-product`}
                            label={``}
                          />
                        </td>
                        <td>Back To School<br /><small style={{opacity: '0.5'}}>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</small></td>
                        <td>-5%</td>
                        <td>20 Jan 25</td>
                        <td>20 Feb 25</td>
                        <td>20 Feb 25</td>
                        <td>
                          <div className='d-flex'>
                            <button className='btn btn-primary me-2'><FontAwesomeIcon icon={faEdit} /></button>
                            <button className='btn btn-danger'><FontAwesomeIcon icon={faTrash} /></button>
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

        <div className='col-sm-4'>
          <div className='card'>
            <div className='card-body'>
              <header className='d-flex justify-content-between align-items-center'>
                <h6>Products in campaign "Back To School"</h6>
                <button className='btn btn-primary'>Add</button>
              </header>
              <table className='table'>
                <thead>
                  <tr>
                    <th></th>
                    <th>Product</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    [...Array(8)].map((i, index) => (
                      <tr key={`product_in_campaign_row_${index + 1}`}>
                        <td>
                          <Form.Check
                            type={"checkbox"}
                            id={`select-product`}
                            label={``}
                          />
                        </td>
                        <td>Asus ROG Zephyrus G16 GU605MI-QR225WS Eclipse Gray</td>
                        <td>$1,250<br /><small><s>$1,400</s></small></td>
                        <td>
                          <button className='btn btn-danger'><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <PaginationArrow />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}