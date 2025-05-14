import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch, faArrowUp, faMinus, faClose, faUser, faTrashAlt, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import * as CustomerService from '../../services/customerService';
import { formatTimestamp } from '../../utils/utils';
import ReviewWaitApprove from '../../components/Customer/ReviewWaitApprove';
import OrderByBtn from '../../components/OrderByBtn/OrderByBtn';
import { Dialog, DialogContent, DialogActions } from '@mui/material';

export default function Customers() {

  const authUser = useSelector(state => state.auth.user);
  const [loadData, setLoadData] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [customerList, setCustomerList] = useState([]);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [suspenseCustomerList, setSuspenseCustomerList] = useState([]);
  const setPageSize = 8;
  const [paramsQuery, setParamsQuery] = useState({
    page: 1,
    pageSize: setPageSize,
    orderBy: 'createdAt',
    orderDir: 'desc',
    search: null,
    totalExpense: null
  });
  const [orderBy, setOrderBy] = useState([
    { column: 'name', value: null },
    { column: 'totalExpense', value: null },
    { column: 'createdAt', value: null },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(null);
  const [useSearchQuery, setUseSearchQuery] = useState(null);

  const [selectedSuspenseCustomers, setSelectedSuspenseCustomers] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [onSuspenseCustomers, setOnSuspenseCustomers] = useState(false);

  const [trashParamsQuery, setTrashParamsQuery] = useState({
    page: 1,
    pageSize: setPageSize,
    orderBy: 'createdAt',
    orderDir: 'desc',
  });
  const [showSoftDelete, setShowSoftDelete] = useState(false);
  const [trashCurrentPage, setTrashCurrentPage] = useState(1);
  const [trashTotalPage, setTrashTotalPage] = useState(1);

  useEffect(() => {
    const fecthCustomers = async () => {
      setLoadData(true);
      try {
        const customers = await CustomerService.getStatisticCustomers(paramsQuery);
        const suspenseCustomers = await CustomerService.getSuspenseCustomers(trashParamsQuery);

        setCustomerList(customers.data.RESULT_DATA);
        setCurrentPage(customers.data.RESULT_META.currentPage);
        setTotalPage(customers.data.RESULT_META.totalPages);
        setTotalCustomer(customers.data.RESULT_META.totalItems);

        setSuspenseCustomerList(suspenseCustomers.data.RESULT_DATA);
        setTrashCurrentPage(suspenseCustomers.data.RESULT_META.currentPage);
        setTrashTotalPage(suspenseCustomers.data.RESULT_META.totalPages);
      }
      catch(error) {
        console.log(error);
        toast.error(error);
      } 
      finally {
        setLoadData(false);
      }
    }

    fecthCustomers();
  }, [refresh, paramsQuery]);

  const handleRefreshData = () => setRefresh(prevState => prevState + 1);
  const renderTotalExpense = (ordersData) => {
    let result = 0;
    ordersData.map(i => {
      result += parseFloat(i.total);
    });
    return `฿${result.toLocaleString('th-TH')}`;
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
      case 'name':
        if(newValue !== null) {
          tempParamsQuery.orderBy = 'name';
          tempParamsQuery.orderDir = newValue;
        }
        break;
      case 'totalExpense':
        tempParamsQuery.totalExpense = newValue;
        break;
      case 'discount':
        if(newValue !== null) {
          tempParamsQuery.orderBy = 'discount';
          tempParamsQuery.orderDir = newValue;
        }
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
      orderBy: 'createdAt',
      orderDir: 'desc',
      search: useSearchQuery,
      totalExpense: null
    }
  }
  const handleSelectPage = (pageNumber) => {
    const tempParamsQuery = {...paramsQuery};
    tempParamsQuery.page = pageNumber;
    setParamsQuery(tempParamsQuery);
  }
  const handleConfirmSuspense = async () => {
    setOnSuspenseCustomers(true);
    try {
      await CustomerService.suspenseCustomers(selectedSuspenseCustomers, authUser.id)
        .then(res => {
          handleRefreshData();
          toast.success(`Suspense customers is successfully.`);
          setSelectedSuspenseCustomers([]);
          setOpenDeleteDialog(false);
        })
        .catch(error => {
          throw new Error(`Suspense customers is failed due to: ${error}`);
        }); 
    }
    catch(error) {
      console.log(error.message);
      toast.error(error.message);
    }
    finally {
      setOnSuspenseCustomers(false);
    }
  }
  const handleSelectTrashPage = (pageNumber) => {
    const tempParamsQuery = {...setTrashParamsQuery};
    tempParamsQuery.page = pageNumber;
    setTrashParamsQuery(tempParamsQuery);
  }

  if(loadData) return <>Loading...</>

  return (
    <div className={`page customers-page`}>

      <header className="page-title">
        <h1>Customers</h1>
        <p>All customers</p>
      </header>
          
      <div className="row mt-4">
        <div className='col-lg-9 mb-3'>
          <div className="card">
            <div className="card-body">
              {
                !showSoftDelete
                ?
                <>
                {
                  customerList.length > 0
                  ?
                  <>
                  <div className='utils-head-table'>
                    <div className='utils-btn-group'>
                      <button 
                        className='btn my-btn narrow-btn red-btn me-2'
                        type="button"
                        disabled={(selectedSuspenseCustomers.length === 0)}
                        onClick={() => setOpenDeleteDialog(true)}
                      >
                        Suspense
                      </button>
                      <button 
                        className='btn my-btn narrow-btn gray-btn have-amount-label'
                        type="button"
                        onClick={() => setShowSoftDelete(true)}
                      >
                        on suspended
                        <div className='amount-label'>{suspenseCustomerList.length}</div>
                      </button>
                    </div>
                    <div className="search-input">
                      <InputGroup>
                        <Form.Control
                          value={searchQuery}
                          placeholder="Search customer"
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
                  <div className='table-responsive'>
                    <table className="table customers-table">
                      <thead>
                        <tr>
                          <th className='selectRow'></th>
                          <th>
                            Customer Name
                            <OrderByBtn 
                              currentStatus={orderBy[0].value}
                              handleOnClick={() => handleChangeOrderBy('name')}
                            />
                          </th>
                          <th>Display Name</th>
                          <th>
                            Total Expense 
                            <OrderByBtn 
                              currentStatus={orderBy[1].value}
                              handleOnClick={() => handleChangeOrderBy('totalExpense')}
                            />
                          </th>
                          {/* <th>Account Status </th> */}
                          <th>
                            Sign up At 
                            <OrderByBtn 
                              currentStatus={orderBy[2].value}
                              handleOnClick={() => handleChangeOrderBy('createdAt')}
                            />
                          </th>
                          <th>Last Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          customerList.map((customer, index) => (
                            <tr key={`customer_row_${index + 1}`}>
                              <td className='selectRow'>
                                <div className='flexCenterXY'>
                                  <Form.Check
                                    type={"checkbox"}
                                    id={`select-customer`}
                                    label={``}
                                    checked={(selectedSuspenseCustomers.filter(i => i === customer.id).length > 0)}
                                    onChange={(e) => {
                                      const tempSelectedSuspenseCustomers = [...selectedSuspenseCustomers];
                                      if(e.target.checked === true) {
                                        tempSelectedSuspenseCustomers.push(customer.id);
                                        setSelectedSuspenseCustomers(tempSelectedSuspenseCustomers);
                                      }
                                      else {
                                        const removeResult = tempSelectedSuspenseCustomers.filter(i => i !== customer.id);
                                        setSelectedSuspenseCustomers(removeResult);
                                      }
                                    }}
                                  />
                                </div>
                              </td>
                              <td><Link to={`/customer/${customer.id}`}>{customer?.customerDetail?.firstName} {customer?.customerDetail?.lastName}</Link></td>
                              <td>{customer.displayName}</td>
                              <td>{renderTotalExpense(customer.orders)}</td>
                              {/* <td><span className='badge text-bg-success'>n/a</span></td> */}
                              <td>{formatTimestamp(customer.createdAt)}</td>
                              <td>{formatTimestamp(customer.lastActive)}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                  <div className='d-flex justify-content-center'>
                    <MyPagination
                      currentPage={currentPage}
                      totalPage={totalPage}
                      handleSelectPage={handleSelectPage}
                    />
                  </div>
                  </>
                  :
                  <p className='h5 opacity-50 text-center my-5'>Not have customer right now.</p>
                }
                
                </>
                :
                <>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <div className='d-flex'>
                    <button className='btn my-btn narrow-btn gray-btn me-2' onClick={() => setShowSoftDelete(false)}>
                      <FontAwesomeIcon icon={faArrowLeftLong} className='me-1' /> Back
                    </button>
                  </div>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      {/* <th className='selectRow'></th> */}
                      <th>Customer</th>
                      <th>Deleted at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      suspenseCustomerList.map((i, index) => (
                        <tr key={`suspense_customer_row_${index + 1}`}>
                          {/* <td className='selectRow'>
                            <div className='flexCenterXY'>
                              <Form.Check
                                type={"checkbox"}
                                id={`select-product`}
                                label={``}
                              />
                            </div>
                          </td> */}
                          <td>
                            {i.customerDetail.firstName} {i.customerDetail.lastName}
                          </td>
                          <td>{formatTimestamp(i.onDelete)}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <div className='d-flex justify-content-center'>
                  <MyPagination
                    currentPage={trashCurrentPage}
                    totalPage={trashTotalPage}
                    handleSelectPage={handleSelectTrashPage}
                  />
                </div>
                </>
              }
            </div>
          </div>
        </div>

        <div className='col-lg-3 mb-3'>

          <div className='card mb-3'>
            <div className='card-body'>
              <div className='text-center'>
                <strong className='h1 mb-1 d-block' style={{color: 'var(--main-purple)', fontWeight: 700}}>{totalCustomer}</strong>
                <p className='mb-0 opacity-75'><FontAwesomeIcon icon={faUser} className='me-2' />Total customer</p>
              </div>
            </div>
          </div>

          <ReviewWaitApprove />

        </div>
        
      </div>

      <Dialog open={openDeleteDialog} className='custom-dialog'>
        <DialogContent>
          <p className='h4 text-center'>Do you confirm suspense these customer?</p>
        </DialogContent>
        <DialogActions className='d-flex justify-content-center'>
          <button 
            type="button"
            className='btn my-btn green-btn big-btn w-50'
            onClick={handleConfirmSuspense}
          >
            <FontAwesomeIcon icon={faTrashAlt} className='me-2' />
            Yes, confirm
          </button>
          <button 
            type="button"
            className='btn my-btn red-btn big-btn w-50'
            onClick={() => {
              setSelectedSuspenseCustomers([]);
              setOpenDeleteDialog(false)
            }}
          ><FontAwesomeIcon icon={faClose} className='me-2' />No, cancel</button>
        </DialogActions>
      </Dialog>
      
    </div>
  )
}