import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus, faChevronLeft, faChevronRight, faGift } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { useParams, Link } from 'react-router';
import { toast } from 'react-toastify';
import * as CustomerService from '../../services/customerService';
import { formatTimestamp } from '../../utils/utils';

export default function CustomerDetail() {

  const params = useParams();

  const [loadData, setLoadData] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [paidOrders, setPaidOrders] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoadData(true);
      try {
        const customer = await CustomerService.getOneCustomer(params.id);
        console.log(customer.data.RESULT_DATA);
        const result = customer.data.RESULT_DATA;
        const ordersPaidResult = result.orders.filter(i => i.paymentStatus === 'PAID');

        let tempTotalExpense = 0;
        ordersPaidResult.map(i => {
          tempTotalExpense += parseInt(i.total);
        });

        setCustomerData(result);
        setTotalExpense(tempTotalExpense);
        setPaidOrders(ordersPaidResult);
      }
      catch(error) {
        console.log(error);
        toast.error(error);
      }
      finally {
        setLoadData(false);
      }
    }

    fetchData();
  }, [params]);

  if(loadData) return <p>Loading...</p>
  if(customerData === null) return <p>Something wrong...</p>

  return (
    <div className={`page`}>
          
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className='h3 mb-0'>{`${customerData.customerDetail.firstName} ${customerData.customerDetail.lastName}`}</h1>
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
                      <strong className='h3 d-block mb-1'>{totalExpense.toLocaleString('th-TH')}</strong>
                      <p className='mb-0 opacity-50'>Total Expense</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h3 d-block mb-1'>$1,880 <FontAwesomeIcon icon={faArrowUp} className='text-success h5' /></strong>
                      <p className='mb-0 opacity-50'>Last Month Expense</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h5 d-block mb-1'>{customerData.onDelete === null ? 'Active' : 'Suspend'}</strong>
                      <p className='mb-0 opacity-50'>Status</p>
                    </div>
                    <div className='text-center me-5'>
                      <strong className='h5 d-block mb-1'>{formatTimestamp(customerData.lastActive)}</strong>
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
                      <tr>
                        <td style={{width: '35%'}}>
                          <strong>Name</strong>
                        </td>
                        <td>{customerData.customerDetail.firstName} {customerData.customerDetail.lastName}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Sign up at</strong>
                        </td>
                        <td>{formatTimestamp(customerData.createdAt)}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Email</strong>
                        </td>
                        <td>{customerData.email}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Phone</strong>
                        </td>
                        <td>{customerData.customerDetail.phone}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Line id</strong>
                        </td>
                        <td>{customerData.customerDetail.lineId}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Address</strong>
                        </td>
                        <td>n/a</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Shipping Address</strong>
                        </td>
                        <td>n/a</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            <div className='col-sm-6'>

              <div className='card mb-3'>
                <div className='card-body'>
                  <header className='d-flex justify-content-between align-items-center'>
                    <h5 className='mb-0'>{customerData?.customerDetail?.firstName} Interesting</h5>
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
                        customerData.wishlists.map((wish, index) => (
                          <tr key={`customer_wishlist_row_${wish.id}`}>
                            <td>{wish?.product?.name}</td>
                            <td>{formatTimestamp(wish.assignedAt)}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
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
                    paidOrders.map((order, index) => {
                      if(index < 5) {
                        return (
                          <tr key={`order_history_${order.id}`}>
                            <td>#{order.id}</td>
                            <td>฿{parseFloat(order.total).toLocaleString('th-TH')}</td>
                            <td>{formatTimestamp(order.createdAt)}</td>
                          </tr>
                        )
                      }
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div className='card mb-3'>
            <div className='card-body'>
              <header className='d-flex justify-content-between align-items-center mb-3'>
                <h5 className='mb-0'>Reviews by {customerData?.customerDetail?.firstName}</h5>
                {/* <small>Total 20 reviews</small> */}
              </header>
              {
                customerData.createdReviews.map((review, index) => (
                  <div key={`customer_review_${review.id}`} className='card mb-2'>
                    <div className='card-body'>
                      <p>"{review.message}"</p>
                      <strong>Rating</strong> : {review.rating.toFixed(1)}<br />
                      <strong>Product</strong> : {review.product.name}<br />
                      <strong>At</strong> : {formatTimestamp(review.createdAt)}
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