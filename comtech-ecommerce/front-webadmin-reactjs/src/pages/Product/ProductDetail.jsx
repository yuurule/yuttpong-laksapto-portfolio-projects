import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';

const dummySpecs = [
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
]

export default function ProductDetail() {



  return (
    <div className={`page`}>
      
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center mb-2">
          <div>
            <h1 className='h3 mb-0'>Asus ROG Zephyrus G16 GU605MI-QR225WS Eclipse Gray</h1>
            <p>SKU: 4711387495490</p>
          </div>
          <div className='d-flex'>
            <button className='btn btn-primary px-4 me-3'><FontAwesomeIcon icon={faEdit} className='me-2' />Edit</button>
            <button className='btn btn-danger px-4'><FontAwesomeIcon icon={faTrash} className='me-2' />Delete</button>
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
                      <strong className='h3 d-block mb-1'>$850</strong>
                      <p className='mb-0 opacity-50'>Price</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h3 d-block mb-1'>$52,590</strong>
                      <p className='mb-0 opacity-50'>Total Sale</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h3 d-block mb-1'>$1,880 <FontAwesomeIcon icon={faArrowUp} className='text-success h5' /></strong>
                      <p className='mb-0 opacity-50'>Last Month Sale</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h3 d-block mb-1'>4.0</strong>
                      <p className='mb-0 opacity-50'>Rating</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h3 d-block mb-1'>200</strong>
                      <p className='mb-0 opacity-50'>In Stock</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='card'>
                <div className='card-body'>
                  <header>
                    <h5>Specification</h5>
                    <hr />
                  </header>
                  <table className='table'>
                    <tbody>
                      {
                        dummySpecs.map((i, index) => (
                          <tr key={`specs_row_${index + 1}`}>
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
                    <h5 className='mb-0'>Week Sale Statistic</h5>
                    <small>12 - 17 Jan 2025</small>
                  </header>
                  <div className='d-flex justify-content-center align-items-center' style={{height: 250}}>
                    <p className='mb-0'>"Chart Line Here"</p>
                  </div>
                </div>
              </div>

              <div className='card mb-3'>
                <div className='card-body'>
                  <header className='d-flex justify-content-between align-items-center mb-3'>
                    <h5 className='mb-0'>Review by Customer</h5>
                    <small>Total 20 reviews</small>
                  </header>
                  {
                    [...Array(3)].map((i, inex) => (
                      <div className='card mb-2'>
                        <div className='card-body'>
                          <p>"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae aliquid autem assumenda."</p>
                          <div className='d-flex justify-content-between align-items-center'>
                            <span>By : YuuDev</span>
                            <span>12 Jan 2025, 12:20:33</span>
                          </div>
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

        <div className='col-sm-4'>
          <div className='row'>
            <div className='col-12 mb-3'>
              <div className='card'>
                <div className='card-body'>
                  <header>
                    <h5>Sale History</h5>
                  </header>
                  <table className='table table-striped'>
                    <thead>
                      <tr>
                        <th>Order Number</th>
                        <th>Quantity</th>
                        <th>Date/Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        [...Array(5)].map((i, index) => (
                          <tr key={`sale_history_${index + 1}`}>
                            <td>#42055896</td>
                            <td>x1</td>
                            <td>20 Jan 25, 12:30:55</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className='col-12'>
              <div className='card'>
                <div className='card-body'>
                  <header>
                    <h5>In Stock History</h5>
                  </header>
                  <table className='table table-striped'>
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Quantity</th>
                        <th>Date/Time</th>
                        <th>By User</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        [...Array(5)].map((i, index) => (
                          <tr key={`stock_history_${index + 1}`}>
                            <td>Add</td>
                            <td>x20</td>
                            <td>20 Jan 25, 12:30:55</td>
                            <td>Webadmin</td>
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
      </div>
    </div>
  )
}