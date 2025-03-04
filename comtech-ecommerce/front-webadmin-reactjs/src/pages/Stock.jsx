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

        <div className='col-sm-7'>
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
                    <th>SKU</th>
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
                        <td>4711387885406</td>
                        <td style={{width: 250}}>Asus ROG Flow Z13 GZ302EA-RU087WA Off Black</td>
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

        <div className='col-sm-5'>
          <div className='card'>
            <div className='card-body'>
              <header>
                <h5>Stock Action History</h5>
              </header>
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
  )
}