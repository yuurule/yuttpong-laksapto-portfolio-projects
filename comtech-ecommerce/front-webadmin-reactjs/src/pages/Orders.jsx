import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faAdd, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../components/MyPagination/MyPagination';
import { toast } from 'react-toastify';
import * as OrderService from '../services/orderService';
import { formatTimestamp } from '../utils/utils';
import { Link } from 'react-router';
import OrderByBtn from '../components/OrderByBtn/OrderByBtn';

export default function Orders() {

   const [loadData, setLoadData] = useState(false);
   const [orderList, setOrderList] = useState([]);
   const [selectOrderData, setSelectOrderData] = useState(null);
   const [orderBy, setOrderBy] = useState([
    { column: 'orderId', value: '' },
    { column: 'total', value: '' },
    { column: 'createdAt', value: '' },
  ]);

   useEffect(() => {
    const fecthOrders = async () => {
      setLoadData(true);
      try {
        const orders = await OrderService.getOrders();
        //console.log(orders.data.RESULT_DATA);
        setOrderList(orders.data.RESULT_DATA);
      }
      catch(error) {
        console.log(error);
        toast.error(error);
      } 
      finally {
        setLoadData(false);
      }
    }

    fecthOrders();
  }, []);

  const handlePreviewOrder = (orderId) => {
    const resultOrder = orderList.find(i => i.id === orderId);
    setSelectOrderData(resultOrder);
  }

  const renderCalculateVat = (price) => {
    return (price * 7) / 100;
  }
  const renderCalculateBeforeVat = (totalPrice) => {
    const vat = (totalPrice * 7) / 100;
    return totalPrice - vat;
  }

  const handleChangeOrderBy = (columnName) => {
    const tempResult = [...orderBy];
    tempResult.map(i => {
      if(i.column === columnName) {
        if(i.value === '') i.value = 'desc';
        else if(i.value === 'desc') i.value = 'asc';
        else if(i.value === 'asc') i.value = '';
      }
      else {
        i.value = '';
      }
    });
    setOrderBy(tempResult);
  }

  if(loadData) return <>Loading...</>

  return (
    <div className={`page`}>

      <header className="page-title">
        <h1>Orders</h1>
        <p>All orders from customers</p>
      </header>
              
      <div className="row mt-4">
        <div className='col-sm-8'>
          <div className="card">
            <div className="card-body">
              {
                orderList.length > 0
                ?
                <>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <div>
                    <div className="dropdown">
                      <button className="btn my-btn narrow-btn purple-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Shipping Actions
                      </button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">Mark as Waiting</a></li>
                        <li><a className="dropdown-item" href="#">Mark as Prepare Shipping</a></li>
                        <li><a className="dropdown-item" href="#">Mark as Shipping</a></li>
                        <li><a className="dropdown-item" href="#">Mark as Finish Shipping</a></li>
                      </ul>
                    </div>
                    {/* <button className='btn btn-danger'>
                      <FontAwesomeIcon icon={faTrash} className='me-1' />(10)
                    </button> */}
                  </div>
                  <div className='search-input'>
                    <InputGroup className="">
                      <Form.Control
                        placeholder="Search by order id or customer name"
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
                      <th className='selectRow'></th>
                      <th>
                        #Order ID 
                        <OrderByBtn 
                          currentStatus={orderBy[0].value}
                          handleOnClick={() => handleChangeOrderBy('orderId')}
                        />
                      </th>
                      <th>
                        Price 
                        <OrderByBtn 
                          currentStatus={orderBy[1].value}
                          handleOnClick={() => handleChangeOrderBy('total')}
                        />
                      </th>
                      <th>By Customer</th>
                      <th>
                        Created At 
                        <OrderByBtn 
                          currentStatus={orderBy[2].value}
                          handleOnClick={() => handleChangeOrderBy('createdAt')}
                        />
                      </th>
                      <th>
                        <div className="dropdown">
                          <button 
                            className={`btn btn-link p-0 dropdown-toggle`} 
                            type="button" 
                            data-bs-toggle="dropdown"
                          >Status</button>
                          <ul className="dropdown-menu">
                            {
                              ['all', 'pending', 'paid', 'failed', 'cencel'].map((i, index) => (
                                <button 
                                  key={`order_status_dropdown_item_${index + 1}`}
                                  className='dropdown-item'
                                  onClick={() => {}}
                                >{i}</button>
                              ))
                            }
                          </ul>
                        </div>
                      </th>
                      <th>
                        <div className="dropdown">
                          <button 
                            className={`btn btn-link p-0 dropdown-toggle`} 
                            type="button" 
                            data-bs-toggle="dropdown"
                          >Shipping</button>
                          <ul className="dropdown-menu">
                            {
                              ['waiting', 'prepare shipping', 'shipping', 'completed'].map((i, index) => (
                                <button 
                                  key={`order_shipping_status_dropdown_item_${index + 1}`}
                                  className='dropdown-item'
                                  onClick={() => {}}
                                >{i}</button>
                              ))
                            }
                          </ul>
                        </div>
                      </th>
                      <th className='px-0'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      orderList.map((order, index) => (
                        <tr key={`product_stock_row_${index + 1}`}>
                          <td className='selectRow'>
                            <div className='flexCenterXY'>
                              <Form.Check
                                type={"checkbox"}
                                id={`select-product`}
                                label={``}
                              />
                            </div>
                          </td>
                          <td>
                            <Link
                              to={null}
                              onClick={() => handlePreviewOrder(order.id)}
                            >{order.id}</Link>
                          </td>
                          <td>฿{parseFloat(order.total).toLocaleString('th-TH')}</td>
                          <td>
                            {order?.customer?.customerDetail?.firstName} {order?.customer?.customerDetail?.lastName}
                          </td>
                          <td>{formatTimestamp(order.createdAt)}</td>
                          <td>
                            <small className='badge text-bg-success'>{order.paymentStatus}</small>
                            {/* <br /><small>12 Jan 2025</small> */}
                          </td>
                          <td><small className='badge text-bg-success'>{order.status}</small></td>
                          <td className='px-0'>
                            <button
                              type="button"
                              className='btn my-btn narrow-btn purple-btn'
                              onClick={() => {
                                handlePreviewOrder(order.id)
                              }}
                            ><small>Detail</small></button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <div className='d-flex justify-content-center'>
                  <MyPagination />
                </div>
                </>
                :
                <p className='my-5 text-center'>Not have order yet.</p>
              }
            </div>
          </div>
        </div>

        <div className='col-sm-4'>
          <div className='card'>
            <div className='card-body'>
              {
                selectOrderData !== null
                ?
                <>
                <header>
                  <h5>Order Detail<span></span></h5>
                </header>
                <div className="mt-3" style={{fontSize: '0.9rem'}}>
                  <p className='mb-0'><strong>#Order Id</strong> : {selectOrderData.id}</p>
                  <p className='mb-0'><strong>Created At</strong> : {formatTimestamp(selectOrderData.createdAt)}</p>
                  <p className='mb-0'><strong>Customer</strong> : {selectOrderData?.customer?.customerDetail?.firstName} {selectOrderData?.customer?.customerDetail?.lastName}</p> 
                  <p className='mb-0'><strong>Address</strong> : n/a</p> 
                  <p className='mb-0'><strong>Email</strong> : n/a</p> 
                  <p><strong>Phone</strong> : n/a</p> 
                </div>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>product</th>
                      <th>quantity</th>
                      <th>price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      selectOrderData.orderItems.map((item, index) => (
                        <tr key={`order_item_row_${index + 1}`}>
                          <td>{item.product.name}</td>
                          <td>x{item.quantity}</td>
                          <td>
                            ฿{parseFloat(item.sale_price).toLocaleString('th-TH')}
                            <br /><small className='opacity-50'><s>฿{parseFloat(item.product.price).toLocaleString('th-TH')}</s></small>
                          </td>
                        </tr>
                      ))
                    }
                    <tr>
                      <td colSpan={2}>Net price</td>
                      <td>฿{renderCalculateBeforeVat(parseFloat(selectOrderData.total)).toLocaleString('th-TH')}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}>+ vat(7%)</td>
                      <td>฿{renderCalculateVat(parseFloat(selectOrderData.total)).toLocaleString('th-TH')}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}><strong>Total Price</strong></td>
                      <td>฿{parseFloat(selectOrderData.total).toLocaleString('th-TH')}</td>
                    </tr>
                  </tbody>
                </table>
                <p className='text-center h5 mb-0'>"{selectOrderData?.paymentStatus}"</p>
                {
                  selectOrderData?.paymentStatus === "PAID" &&
                  <p className='text-center mb-0'><small>{formatTimestamp(selectOrderData?.updatePaymentAt)}</small></p>
                }
                </>
                :
                <p className='h5 text-center my-5'>Order Preview</p>
              }
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
  )
}