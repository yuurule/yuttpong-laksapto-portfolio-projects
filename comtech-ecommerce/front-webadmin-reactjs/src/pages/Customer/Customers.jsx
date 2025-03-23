import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import * as CustomerService from '../../services/customerService';
import { formatTimestamp } from '../../utils/utils';
import ReviewWaitApprove from '../../components/Customer/ReviewWaitApprove';

export default function Customers() {

  const [loadData, setLoadData] = useState(false);
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    const fecthCustomers = async () => {
      setLoadData(true);
      try {
        const customers = await CustomerService.getCustomers();
        setCustomerList(customers.data.RESULT_DATA);
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
  }, []);

  const renderTotalExpense = (ordersData) => {
    let result = 0;
    ordersData.map(i => {
      result += parseFloat(i.total);
    });
    return `฿${result.toLocaleString('th-TH')}`;
  }

  if(loadData) return <>Loading...</>

  return (
    <div className={`page`}>
          
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center mb-4">
          <h1>Customers</h1>
        </header>

        <div className='col-sm-8'>
          <div className="card">
            <div className="card-body">
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <div className='d-flex'>
                  <button className='btn btn-danger me-2'>Suspend</button>
                  <button className='btn btn-danger'>
                    <FontAwesomeIcon icon={faTrash} className='me-1' />(10)
                  </button>
                </div>
                <div>
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
                    <th></th>
                    <th>Customer <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Total Expense <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Account Status <FontAwesomeIcon icon={faMinus} /></th>
                    <th>Sign up At <FontAwesomeIcon icon={faMinus} /></th>
                    <th>Last Active <FontAwesomeIcon icon={faMinus} /></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    customerList.map((customer, index) => (
                      <tr key={`customer_row_${index + 1}`}>
                        <td>
                          <Form.Check
                            type={"checkbox"}
                            id={`select-product`}
                            label={``}
                          />
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

          <div className='card mb-3'>
            <div className='card-body'>
              <header className='d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>Total Customer</h5>
              </header>
              {/* <div className='d-flex justify-content-center align-items-center'>
                <p className='mb-0'>"Pie Chart Here"</p>
              </div> */}
            </div>
          </div>

          <div className='card mb-3'>
            <div className='card-body'>
              <header className='d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>New Register</h5>
              </header>
              {/* <div className='d-flex justify-content-center align-items-center'>
                <p className='mb-0'>"Pie Chart Here"</p>
              </div> */}
            </div>
          </div>

          <ReviewWaitApprove />

        </div>
        
      </div>
      
    </div>
  )
}