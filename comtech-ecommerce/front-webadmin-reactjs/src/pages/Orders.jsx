import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClose } from '@fortawesome/free-solid-svg-icons';
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
  const setPageSize = 8;
  const [paramsQuery, setParamsQuery] = useState({
    page: 1,
    pageSize: setPageSize,
    pagination: true,
    orderBy: 'createdAt',
    orderDir: 'desc',
    search: null,
    paymentStatus: null,
    deliveryStatus: null,
  });
  const [orderBy, setOrderBy] = useState([
    { column: 'orderId', value: null },
    { column: 'total', value: null },
    { column: 'createdAt', value: null },
    { column: 'paymentStatus', value: null },
    { column: 'deliveryStatus', value: null },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(null);
  const [useSearchQuery, setUseSearchQuery] = useState(null);

  useEffect(() => {
    const fecthOrders = async () => {
      setLoadData(true);
      try {
        const orders = await OrderService.getOrders(paramsQuery);
        //console.log(orders.data.RESULT_DATA);
        setOrderList(orders.data.RESULT_DATA);
        setCurrentPage(orders.data.RESULT_META.currentPage);
        setTotalPage(orders.data.RESULT_META.totalPages);
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
  }, [paramsQuery]);

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
    let newValue = null;
    tempResult.map(i => {
      if(i.column === columnName) {
        if(i.value === null) {
          i.value = 'desc';
          newValue = 'desc';
        }
        else if(i.value === 'desc') {
          i.value = 'asc';
          newValue = 'asc';
        }
        else if(i.value === 'asc') {
          i.value = null;
          newValue = null;
        }
      }
      else {
        i.value = null;
      }
    });

    const tempParamsQuery = handleResetParamsQuery();
    switch(columnName) {
      case 'orderId':
        if(newValue !== null) {
          tempParamsQuery.orderBy = 'orderId';
          tempParamsQuery.orderDir = newValue;
        }
        break;
      case 'total':
        if(newValue !== null) {
          tempParamsQuery.orderBy = 'total';
          tempParamsQuery.orderDir = newValue;
        }
        break;
      case 'createdAt':
        if(newValue !== null) {
          tempParamsQuery.orderBy = 'createdAt';
          tempParamsQuery.orderDir = newValue;
        }
        break;
      case 'paymentStatus':
        tempParamsQuery.paymentStatus = newValue;
        break;
      case 'deliveryStatus':
        tempParamsQuery.deliveryStatus = newValue;
        break;
    }

    setParamsQuery(tempParamsQuery);
    setOrderBy(tempResult);
  }

  const handleChangeOrderByStatus = (newValue, columnName) => {
    const tempResult = [...orderBy];
    const tempParamsQuery = handleResetParamsQuery();
    switch(columnName) {
      case 'paymentStatus':
        tempResult.paymentStatus = newValue;
        tempParamsQuery.paymentStatus = newValue;
        break;
      case 'deliveryStatus':
        tempResult.deliveryStatus = newValue;
        tempParamsQuery.deliveryStatus = newValue;
        break;
    }

    setParamsQuery(tempParamsQuery);
    setOrderBy(tempResult);
  }

  const handleSearchQuery = () => {
    if(searchQuery !== null && searchQuery.trim() !== '') {
      const tempParamsQuery = handleResetParamsQuery();
      tempParamsQuery.search = searchQuery;
      setUseSearchQuery(searchQuery);
      setParamsQuery(tempParamsQuery);
    }
  }
  const handleClearSearchQuery = () => {
    setSearchQuery(null);
    setUseSearchQuery(null);
    const tempParamsQuery = handleResetParamsQuery();
    tempParamsQuery.search = null;
    setParamsQuery(tempParamsQuery);
  }
  const handleResetParamsQuery = () => {
    return {
      page: 1,
      pageSize: setPageSize,
      pagination: true,
      orderBy: 'createdAt',
      orderDir: 'desc',
      search: useSearchQuery,
      paymentStatus: null,
      deliveryStatus: null,
    }
  }
  const handleSelectPage = (pageNumber) => {
    const tempParamsQuery = {...paramsQuery};
    tempParamsQuery.page = pageNumber;
    setParamsQuery(tempParamsQuery);
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
              
                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <div>
                    {/* <div className="dropdown">
                      <button className="btn my-btn narrow-btn purple-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Shipping Actions
                      </button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">Mark as Pending</a></li>
                        <li><a className="dropdown-item" href="#">Mark as Delivering</a></li>
                        <li><a className="dropdown-item" href="#">Mark as Completed</a></li>
                        <li><a className="dropdown-item" href="#">Mark as Cancel</a></li>
                      </ul>
                    </div> */}
                    {/* <button className='btn btn-danger'>
                      <FontAwesomeIcon icon={faTrash} className='me-1' />(10)
                    </button> */}
                  </div>
                  <div className='search-input'>
                    <InputGroup>
                      <Form.Control
                        value={searchQuery}
                        placeholder="Search by order id or customer name"
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                        }}
                      />
                      {
                        (searchQuery !== null && (searchQuery.trim()) !== '') &&
                        <Button
                          type="button"
                          style={{borderRight: 'none'}}
                          title="clear search"
                          onClick={handleClearSearchQuery}
                        >
                          <FontAwesomeIcon icon={faClose} />
                        </Button>
                      }
                      <Button
                        type="button"
                        onClick={handleSearchQuery}
                      >
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
                            className={`btn btn-link p-0 dropdown-toggle text-dark`} 
                            style={{textDecoration: 'none'}}
                            type="button" 
                            data-bs-toggle="dropdown"
                          ><strong>Status</strong></button>
                          <ul className="dropdown-menu">
                            {
                              ['all', 'pending', 'paid', 'failed', 'cancel'].map((i, index) => (
                                <button 
                                  key={`order_status_dropdown_item_${index + 1}`}
                                  className='dropdown-item'
                                  type="button"
                                  onClick={() => {
                                    if(i !== 'all') {
                                      const newValue = i.toUpperCase();
                                      handleChangeOrderByStatus(newValue, 'paymentStatus');
                                    }
                                    else {
                                      handleChangeOrderByStatus(null, 'paymentStatus');
                                    }
                                  }}
                                >{i}</button>
                              ))
                            }
                          </ul>
                        </div>
                      </th>
                      {/* <th>
                        <div className="dropdown">
                          <button 
                            className={`btn btn-link p-0 dropdown-toggle text-dark`} 
                            style={{textDecoration: 'none'}}
                            type="button" 
                            data-bs-toggle="dropdown"
                          ><strong>Shipping</strong></button>
                          <ul className="dropdown-menu">
                            {
                              ['all', 'pending', 'delivering', 'completed'].map((i, index) => (
                                <button 
                                  key={`order_shipping_status_dropdown_item_${index + 1}`}
                                  className='dropdown-item'
                                  onClick={() => {
                                    if(i !== 'all') {
                                      const newValue = i.toUpperCase();
                                      handleChangeOrderByStatus(newValue, 'deliveryStatus');
                                    }
                                    else {
                                      handleChangeOrderByStatus(null, 'deliveryStatus');
                                    }
                                  }}
                                >{i}</button>
                              ))
                            }
                          </ul>
                        </div>
                      </th> */}
                      {/* <th className='px-0'></th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      orderList.length > 0
                      ?
                      <>
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
                              <button
                                className='btn btn-link p-0'
                                style={{textDecoration: 'none'}}
                                type="button"
                                onClick={() => handlePreviewOrder(order.id)}
                              >
                                {/* {order.id} */}
                                20250130-000001
                              </button>
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
                            {/* <td><small className='badge text-bg-success'>{order.status}</small></td> */}
                            {/* <td className='px-0'>
                              <button
                                type="button"
                                className='btn my-btn narrow-btn purple-btn'
                                onClick={() => {
                                  handlePreviewOrder(order.id)
                                }}
                              ><small>Detail</small></button>
                            </td> */}
                          </tr>
                        ))
                      }
                      </>
                      :
                      <tr>
                        <td colSpan={7}>
                          <p className='my-5 text-center'>Not have order</p>
                        </td>
                      </tr>
                    }
                    
                  </tbody>
                </table>
                {
                  orderList.length ?
                  <div className='d-flex justify-content-center'>
                    <MyPagination
                      currentPage={currentPage}
                      totalPage={totalPage}
                      handleSelectPage={handleSelectPage}
                    />
                  </div>
                  : null
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