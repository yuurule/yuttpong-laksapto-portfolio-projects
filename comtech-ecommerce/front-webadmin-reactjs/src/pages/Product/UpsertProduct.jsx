import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { Link } from 'react-router';

export default function UpsertProduct() {



  return (
    <div className={`page`}>
      
      <div className="row">

        <header className="col-12 d-flex justify-content-between align-items-center mb-4">
          <h1>Add New Product</h1>
          {/* <div>
            <button className='btn btn-primary'>+ Add New Product</button>
          </div> */}
        </header>

        <div className='col-sm-12'>
          <div className='row'>
            <div className='col-sm-4'>
              <div className='card'>
                <div className='card-body'>
                  <figure className='text-center'>
                    <img src="/images/dummy-product.jpg" style={{width: 300}} />
                  </figure>
                </div>
              </div>
            </div>
            <div className='col-sm-8'>
              <div className='card'>
                <div className='card-body'>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}