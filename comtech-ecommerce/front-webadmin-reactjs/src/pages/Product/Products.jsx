import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { Link } from 'react-router';

export default function Products() {



  return (
    <div className={`page`}>
      
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center mb-4">
          <h1>Products</h1>
          <div>
            <Link to="/product/create" className='btn btn-primary text-bg-primary'>+ Add New Product</Link>
          </div>
        </header>

        <div className='col-sm-9'>
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
                    <th></th>
                    <th>SKU</th>
                    <th>Product <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>In Stock <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Price <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Sale Amount <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Revenue <FontAwesomeIcon icon={faMinus} /></th>
                    <th>Sales Off <FontAwesomeIcon icon={faMinus} /></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    [...Array(8)].map((i, index) => (
                      <tr key={`category_row_${index + 1}`}>
                        <td>
                          <Form.Check
                            type={"checkbox"}
                            id={`select-product`}
                            label={``}
                          />
                        </td>
                        <td>471138788</td>
                        <td style={{width: 300}}>
                          <Link to="/product/1" className="d-flex align-items-center">
                            <figure className='me-2'>
                              <img src="/images/dummy-product.jpg" style={{width: 60}} />
                            </figure>
                            Asus ROG Flow Z13 GZ302EA-RU087WA Off Black
                          </Link>
                        </td>
                        <td>25</td>
                        <td>$127.99</td>
                        <td>56</td>
                        <td>$5,480.00</td>
                        <td>-$350.00</td>
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

        <div className='col-sm-3'>
          <div className='card'>
            <div className='card-body'>
              <header>
                <h5>Top 10 sell of the month</h5>
              </header>
              <figure className='text-center'>
                <img src="/images/dummy-product.jpg" />
              </figure>
              <div className='row'>
                <div className='col-6'>
                  <table className='w-100'>
                    <tr>
                      <td><small>Sale Amount</small></td>
                      <td className='text-end'>20</td>
                    </tr>
                    <tr>
                      <td><small>Sales off</small></td>
                      <td className='text-end'>-$159.00</td>
                    </tr>
                    <tr>
                      <td><small>Total Views</small></td>
                      <td className='text-end'>3,652</td>
                    </tr>
                  </table>
                </div>
                <div className='col-6 text-center'>
                  <strong className='h3'>$255,490</strong>
                  <p>Total Revenue</p>
                </div>
              </div>
              <div className='w-100 d-flex justify-content-between align-items-center mt-3'>
                <button className='btn btn-link p-0'>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <strong>1 of 10</strong>
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