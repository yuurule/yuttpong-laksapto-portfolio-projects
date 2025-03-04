import { Form, Pagination  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Products() {



  return (
    <div className={`page`}>
      
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center">
          <h1>Products</h1>
          <div>
            <button className='btn btn-danger me-3'>Delete</button>
            <button className='btn btn-primary'>Create New</button>
          </div>
        </header>
        <div className='col-12'>
          <div className="card mt-4">
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>In Stock</th>
                    <th>Total Sale</th>
                    <th>Total Revenue</th>
                    <th>Create At</th>
                    <th></th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
  )
}