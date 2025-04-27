import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import * as CustomerService from '../../services/customerService';
import * as OrderService from '../../services/orderService';
import { formatTimestamp, formatMoney } from '../../utils/utils';
import MyPagination from '../../components/MyPagination/MyPagination';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function CustomerDetail() {

  const params = useParams();
  const [loadData, setLoadData] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [paidOrders, setPaidOrders] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalPendingExpense, setTotalPendingExpense] = useState(0);
  const [wishlists, setWishlists] = useState([]);

  const [wishlistPageName, setWishlistPageNumber] = useState(1);
  const [wishlistCurrentPage, setWishlistCurrentPage] = useState(1);
  const [wishlistTotalPage, setWishlistTotalPage] = useState(1);

  const data = {
    labels: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม'],
    datasets: [
      {
        label: 'ยอดขาย',
        data: [12, 16, 3, 5, 2],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }
    ]
  };
  
  const options = {
    responsive: true,
    // options ต่างๆ
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadData(true);
      try {
        const customer = await CustomerService.getOneCustomer(params.id);
        const orders = await OrderService.getOrders();
        const wishlists = await CustomerService.getWishlistByCustomer(params.id, {
          page: wishlistPageName,
          pageSize: 3
        });

        const result = customer.data.RESULT_DATA;
        const customerOrders = orders.data.RESULT_DATA.filter(i => i.customerId === parseInt(params.id));
        const paidOrders = customerOrders.filter(i => i.paymentStatus === 'PAID');
        const unPaidOrders = customerOrders.filter(i => i.paymentStatus === 'PENDING');

        let tempTotalExpense = 0;
        let tempTotalUnpaid = 0;
        paidOrders.map(i => {
          tempTotalExpense += parseFloat(i.total);
        });
        unPaidOrders.map(i => {
          tempTotalUnpaid += parseFloat(i.total);
        });

        setCustomerData(result);
        setTotalExpense(tempTotalExpense);
        setTotalPendingExpense(tempTotalUnpaid);
        setPaidOrders(paidOrders);
        setWishlists(wishlists.data.RESULT_DATA);
        setWishlistCurrentPage(wishlists.data.RESULT_META.currentPage);
        setWishlistTotalPage(wishlists.data.RESULT_META.totalPages);
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
  }, [params, wishlistPageName]);

  const handleSelectPage = (pageNumber) => {
    setWishlistPageNumber(pageNumber);
  }

  if(loadData) return <p>Loading...</p>
  if(customerData === null) return <p>Something wrong...</p>

  return (
    <div className={`page`}>
      <header className="page-title smaller">
        <h1>{`${customerData.customerDetail.firstName} ${customerData.customerDetail.lastName}`}</h1>
        <p>Customer detail</p>
      </header>

      <div className="row">
        <header className="col-12 mb-3">
          <div className='d-flex justify-content-end align-items-center'>
            {/* <button className='btn btn-info px-4 me-3'><FontAwesomeIcon icon={faGift} className='me-2' />Send Campign</button> */}
            {/* <button className='btn my-btn red-btn big-btn'>
              <FontAwesomeIcon icon={faCircleXmark} className='me-2' />Suspend
            </button> */}
          </div>
        </header>
        <div className='col-sm-8'>
          <div className='row'>
            <div className='col-12 mb-3'>
              <div className='card'>
                <div className='card-body d-flex justify-content-around align-items-center py-4'>
                  <div>
                    <figure className='userImage'>
                      <img src="/images/dummy-webadmin.jpg" />
                    </figure>
                  </div>
                  <div className='d-flex align-items-center'>
                    <div className='text-center me-5 px-2'>
                      <strong className='h3 d-block mb-1'>
                        ฿{formatMoney(totalExpense)}
                      </strong>
                      <p className='mb-0 opacity-50'>Total Expense</p>
                    </div>
                    <div className='text-center me-5 px-2'>
                      <strong className='h3 d-block mb-1'>
                        ฿{formatMoney(totalPendingExpense)}
                      </strong>
                      <p className='mb-0 opacity-50'>Pending Order</p>
                    </div>
                    <div className='text-center me-5 px-2'>
                      <strong className='h5 d-block mb-1'>
                        {customerData.onDelete === null ? 'Active' : 'Suspend'}
                      </strong>
                      <p className='mb-0 opacity-50'>Status</p>
                    </div>
                    <div className='text-center me-5 px-2'>
                      <strong className='h5 d-block mb-1'>
                        {formatTimestamp(customerData.lastActive)}
                      </strong>
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
                    <h5>Infomation<span></span></h5>
                  </header>
                  <table className='table'>
                    <tbody>
                      <tr>
                        <td style={{width: '35%'}}>
                          <strong>Full Name</strong>
                        </td>
                        <td>{customerData.customerDetail.firstName} {customerData.customerDetail.lastName}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Diaplay Name</strong>
                        </td>
                        <td>{customerData.displayName}</td>
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
                        <td>{customerData.customerDetail.street} {customerData.customerDetail.city} {customerData.customerDetail.region} {customerData.customerDetail.postcode}</td>
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
                    <h5 className='mb-0'>{customerData?.customerDetail?.firstName} {customerData.customerDetail.lastName} Interesting<span></span></h5>
                  </header>
                  <div className='w-100' style={{height: 300}}>
                    <Pie data={data} options={options} />
                  </div>
                </div>
              </div>

              <div className='card'>
                <div className='card-body'>
                  <header>
                    <h5>{customerData?.customerDetail?.firstName} {customerData.customerDetail.lastName} Wishlist<span></span></h5>
                  </header>
                  <table className='table mt-3'>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Date/Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        wishlists.map((wish, index) => (
                          <tr key={`customer_wishlist_row_${wish.id}`}>
                            <td>{wish?.product?.name}</td>
                            <td>{formatTimestamp(wish.assignedAt)}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  <MyPagination
                    currentPage={wishlistCurrentPage}
                    totalPage={wishlistTotalPage}
                    handleSelectPage={handleSelectPage}
                  />
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <div className='col-sm-4'>
          <div className='card mb-3'>
            <div className='card-body'>
              <header>
                <h5>Recent Orders<span></span></h5>
              </header>
              {
                paidOrders.length > 0
                ?
                <table className='table mt-3'>
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
                              <td>฿{formatMoney(order.total)}</td>
                              <td>{formatTimestamp(order.createdAt)}</td>
                            </tr>
                          )
                        }
                      })
                    }
                  </tbody>
                </table>
                :
                <p className='my-3 text-center opacity-50'>Not have order</p>
              }
            </div>
          </div>

          <div className='card mb-3'>
            <div className='card-body'>
              <header className='d-flex justify-content-between align-items-center mb-3'>
                <h5 className='mb-0'>Latest Reviews by {customerData?.customerDetail?.firstName} {customerData.customerDetail.lastName}<span></span></h5>
                {/* <small>Total 20 reviews</small> */}
              </header>
              {
                customerData.createdReviews.map((review, index) => {
                  if(index < 3) {
                    return (
                      <div key={`customer_review_${review.id}`} className='reviewItem'>
                        <p>"{review.message}"</p>
                        <strong>Product</strong> : {review.product.name}<br />
                        <strong>Rating</strong> : {review.rating.toFixed(1)}<br />
                        <strong>At</strong> : {formatTimestamp(review.createdAt)}
                      </div>
                    )
                  }
                })
              }
            </div>
          </div>
         
        </div>
      </div>
    </div>
  )
}