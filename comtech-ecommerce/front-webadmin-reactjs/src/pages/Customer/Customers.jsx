import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch, faArrowUp, faMinus } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import * as CustomerService from '../../services/customerService';
import { formatTimestamp } from '../../utils/utils';
import ReviewWaitApprove from '../../components/Customer/ReviewWaitApprove';
import OrderByBtn from '../../components/OrderByBtn/OrderByBtn';

export default function Customers() {

  const [loadData, setLoadData] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [customerList, setCustomerList] = useState([]);
  const [paramsQuery, setParamsQuery] = useState({
    page: 1,
    pageSize: 8,
    orderBy: 'createdAt',
    orderDir: 'desc',
    search: null,
    totalExpense: null
  });
  const [orderBy, setOrderBy] = useState([
    { column: 'name', value: null },
    { column: 'expense', value: null },
    { column: 'createdAt', value: null },
  ]);

  useEffect(() => {
    const fecthCustomers = async () => {
      setLoadData(true);
      try {
        const customers = await CustomerService.getStatisticCustomers(paramsQuery);
        const resultData = customers.data.RESULT_DATA;
        setCustomerList(resultData);
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

  const renderTotalExpense = (ordersData) => {
    let result = 0;
    ordersData.map(i => {
      result += parseFloat(i.total);
    });
    return `฿${result.toLocaleString('th-TH')}`;
  }

  const handleChangeOrderBy = (columnName) => {
    const tempResult = [...orderBy];
    tempResult.map(i => {
      if(i.column === columnName) {
        if(i.value === null) i.value = 'desc';
        else if(i.value === 'desc') i.value = 'asc';
        else if(i.value === 'asc') i.value = null;
      }
      else {
        i.value = null;
      }
    });
    setOrderBy(tempResult);
  }

  if(loadData) return <>Loading...</>

  return (
    <div className={`page`}>

      <header className="page-title">
        <h1>Customers</h1>
        <p>All customers</p>
      </header>
          
      <div className="row mt-4">
        <div className='col-sm-8'>
          <div className="card">
            <div className="card-body">
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <div className='d-flex'>
                  <button className='btn my-btn narrow-btn red-btn me-2'>Suspend</button>
                  <button className='btn my-btn narrow-btn gray-btn have-amount-label'>
                    on suspended
                    <div className='amount-label'>10</div>
                  </button>
                </div>
                <div className="search-input">
                  <InputGroup className="">
                    <Form.Control
                      placeholder="Search customer"
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
                      Customer 
                      <OrderByBtn 
                        currentStatus={orderBy[0].value}
                        handleOnClick={() => handleChangeOrderBy('name')}
                      />
                    </th>
                    <th>
                      Total Expense 
                      <OrderByBtn 
                        currentStatus={orderBy[1].value}
                        handleOnClick={() => handleChangeOrderBy('expense')}
                      />
                    </th>
                    <th>Account Status </th>
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
                              id={`select-product`}
                              label={``}
                            />
                          </div>
                        </td>
                        <td><Link to={`/customer/${customer.id}`}>{customer?.customerDetail?.firstName} {customer?.customerDetail?.lastName}</Link></td>
                        <td>{renderTotalExpense(customer.orders)}</td>
                        <td><span className='badge text-bg-success'>n/a</span></td>
                        <td>{formatTimestamp(customer.createdAt)}</td>
                        <td>{formatTimestamp(customer.lastActive)}</td>
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

        <div className='col-sm-4'>

          <div className='row'>
            <div className='col-sm-6'>
              <div className='card mb-3'>
                <div className='card-body'>
                  <header className='d-flex justify-content-between align-items-center'>
                    <h5 className='mb-0'>Total Customer<span></span></h5>
                  </header>
                  {/* <div className='d-flex justify-content-center align-items-center'>
                    <p className='mb-0'>"Pie Chart Here"</p>
                  </div> */}
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='card mb-3'>
                <div className='card-body'>
                  <header className='d-flex justify-content-between align-items-center'>
                    <h5 className='mb-0'>New Register<span></span></h5>
                  </header>
                  {/* <div className='d-flex justify-content-center align-items-center'>
                    <p className='mb-0'>"Pie Chart Here"</p>
                  </div> */}
                </div>
              </div>
            </div>
            <div className='col-12'>
              <ReviewWaitApprove />
            </div>
          </div>

        </div>
        
      </div>
      
    </div>
  )
}