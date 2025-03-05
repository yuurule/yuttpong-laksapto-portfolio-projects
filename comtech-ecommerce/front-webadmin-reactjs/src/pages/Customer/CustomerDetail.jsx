import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus, faChevronLeft, faChevronRight, faGift } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { Link } from 'react-router';

const dummyInfo = [
  { name: 'Name', value: 'Yuttapong Laksapto' },
  { name: 'Sign up at', value: '12 Jan 2025, 12:30:55' },
  { name: 'Email', value: 'yudev@gmail.com' },
  { name: 'Phone', value: '0957983628' },
  { name: 'Line ID', value: '-' },
  { name: 'Address', value: '48 Sukhumvit 64/1 Bangkok 10260' },
  { name: 'Shipping Address', value: '48 Sukhumvit 64/1 Bangkok 10260' },
]

export default function CustomerDetail() {


  return (
    <div className={`page`}>
          
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className='h3 mb-0'>Customer Detail</h1>
          </div>
          <div className='d-flex'>
            <button className='btn btn-info px-4 me-3'><FontAwesomeIcon icon={faGift} className='me-2' />Send Campign</button>
            <button className='btn btn-danger px-4'><FontAwesomeIcon icon={faTrash} className='me-2' />Suspend</button>
          </div>
        </header>
        <div className='col-sm-8'>
          <div className='row'>
            <div className='col-12 mb-3'>
              <div className='card'>
                <div className='card-body d-flex justify-content-between align-items-center py-0'>
                  <div>
                    <figure>
                      <img src="/images/dummy-product.jpg" style={{width: 200}} />
                    </figure>
                  </div>
                  <div className='d-flex align-items-center'>
                    <div className='text-center me-5'>
                      <strong className='h3 d-block mb-1'>$3,590</strong>
                      <p className='mb-0 opacity-50'>Total Expense</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h3 d-block mb-1'>$1,880 <FontAwesomeIcon icon={faArrowUp} className='text-success h5' /></strong>
                      <p className='mb-0 opacity-50'>Last Month Expense</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h5 d-block mb-1'>Active</strong>
                      <p className='mb-0 opacity-50'>Status</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h5 d-block mb-1'>20 Jan 2025</strong>
                      <p className='mb-0 opacity-50'>Last Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='card mb-3'>
                <div className='card-body'>
                  <header>
                    <h5>Infomation</h5>
                    <hr />
                  </header>
                  <table className='table'>
                    <tbody>
                      {
                        dummyInfo.map((i, index) => (
                          <tr key={`info_row_${index + 1}`}>
                            <td style={{width: '35%'}}><strong>{i.name}</strong></td>
                            <td>{i.value}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            <div className='col-sm-6'>

              <div className='card mb-3'>
                <div className='card-body'>
                  <header className='d-flex justify-content-between align-items-center'>
                    <h5 className='mb-0'>YuuDev Interesting</h5>
                  </header>
                  <div className='d-flex justify-content-center align-items-center' style={{height: 300}}>
                    <p className='mb-0'>"Pie Chart Here"</p>
                  </div>
                </div>
              </div>

              <div className='card'>
                <div className='card-body'>
                  <header>
                    <h5>Wishlist Products</h5>
                    <hr />
                  </header>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Date/Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        [...Array(3)].map((i, index) => (
                          <tr key={`widthlist_row_${index + 1}`}>
                            <td>Asus ROG Zephyrus G16 GU60</td>
                            <td>20 Jan 2025, 15:30:55</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <div className='col-sm-4'>
          <div className='card mb-3'>
            <div className='card-body'>
              <header>
                <h5>Buy History</h5>
              </header>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Price</th>
                    <th>Date/Time</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    [...Array(5)].map((i, index) => (
                      <tr key={`sale_history_${index + 1}`}>
                        <td>#42055896</td>
                        <td>$2,500</td>
                        <td>20 Jan 25, 12:30:55</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
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

          <div className='card mb-3'>
            <div className='card-body'>
              <header className='d-flex justify-content-between align-items-center mb-3'>
                <h5 className='mb-0'>Review by YuuDev</h5>
                <small>Total 20 reviews</small>
              </header>
              {
                [...Array(3)].map((i, inex) => (
                  <div className='card mb-2'>
                    <div className='card-body'>
                      <p>"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae aliquid autem assumenda."</p>
                      <strong>Rating</strong> : 4.0<br />
                      <strong>On Product</strong> : Asus ROG Zephyrus G16 GU60...<br />
                      <strong>At</strong> : 12 Jan 2025, 12:20:33
                    </div>
                  </div>
                ))
              }
              <div className='w-100 d-flex justify-content-between align-items-center mt-3'>
                <button className='btn btn-link p-0'>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <strong>Page 1/10</strong>
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