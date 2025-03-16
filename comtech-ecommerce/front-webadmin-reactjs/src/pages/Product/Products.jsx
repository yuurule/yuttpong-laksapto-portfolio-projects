import { useState, useEffect } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus, faChevronLeft, faChevronRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { Link, useNavigate } from 'react-router';
import * as ProductService from '../../services/productService';
import { toast } from 'react-toastify';

export default function Products() {

  const navigate = useNavigate();

  const [loadData, setLoadData] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [showSoftDelete, setShowSoftDelete] = useState(false);
  const [productList, setProductList] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    getAllProduct();
  }, [refresh]);

  const getAllProduct = async () => {
    setLoadData(true);
    try {
      const fetchProducts = await ProductService.getAllProduct();
      setProductList(fetchProducts.data.RESULT_DATA);
    }
    catch(error) {
      console.log(error.message);
      toast.error(`Get all product failed due to: ${error.message}`);
    }
    finally {
      setLoadData(false);
    }
  }

  const handleRefreshData = () => setRefresh(prevState => prevState + 1);

  return (
    <div className={`page`}>
      
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center mb-4">
          <h1>Products</h1>
          <div>
            <Link to="/product/create" className='btn btn-primary text-bg-primary'>+ Add New Product</Link>
          </div>
        </header>

        <div className='col-sm-9'>
          <div className="card">
            <div className="card-body">
              {
                !showSoftDelete
                ?
                <div>
                  <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div className='d-flex'>
                      <button className='btn btn-danger me-2'>Delete</button>
                      <button className='btn btn-danger' onClick={() => setShowSoftDelete(true)}>
                        <FontAwesomeIcon icon={faTrash} className='me-1' />(10)
                      </button>
                    </div>
                    <div>
                      <InputGroup className="">
                        <Form.Control
                          placeholder="Search product"
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
                        {/* <th>SKU</th> */}
                        <th>Product <FontAwesomeIcon icon={faArrowUp} /></th>
                        <th>In Stock <FontAwesomeIcon icon={faArrowUp} /></th>
                        <th>Price <FontAwesomeIcon icon={faArrowUp} /></th>
                        <th>Sale Amount <FontAwesomeIcon icon={faArrowUp} /></th>
                        <th>Revenue <FontAwesomeIcon icon={faMinus} /></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        productList.map((product, index) => (
                          <tr key={`product_${product.id}`}>
                            <td>
                              <Form.Check
                                type={"checkbox"}
                                id={`select-product`}
                                label={``}
                              />
                            </td>
                            {/* <td>{product.sku}</td> */}
                            <td style={{width: 300}}>
                              <Link to="/product/1" className="d-flex align-items-center">
                                <figure className='me-2'>
                                  <img src="/images/dummy-product.jpg" style={{width: 60}} />
                                </figure>
                                <div>
                                  <p className='mb-0'>{product.name}</p>
                                  sku: <small className='opacity-50'>{product.sku}</small>
                                </div>
                              </Link>
                            </td>
                            <td>{product.inStock.inStock}</td>
                            <td>฿{product.price}</td>
                            <td>{product.stockSellEvents.length === 0 ? '0' : 'n/a'}</td>
                            <td>{product.orderItems.length === 0 ? '0' : 'n/a'}</td>
                            <td>
                              <div className='d-flex'>
                                <button 
                                  type="button"
                                  className='btn btn-primary me-2'
                                  onClick={() => {
                                    navigate(`/product/edit/${product.id}`);
                                  }}
                                ><FontAwesomeIcon icon={faEdit} /></button>
                                <button 
                                  type="button"
                                  className='btn btn-danger'
                                  onClick={null}
                                ><FontAwesomeIcon icon={faTrash} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  <div className='d-flex justify-content-center'>
                    <MyPagination />
                  </div>
                </div>
                :
                <div>
                  <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div className='d-flex'>
                      <button className='btn btn-primary me-2' onClick={() => setShowSoftDelete(false)}>
                        <FontAwesomeIcon icon={faArrowLeft} className='me-1' /> Back
                      </button>
                      {/* <button className='btn btn-danger'>Delete</button> */}
                    </div>
                    <div>
                      <InputGroup className="">
                        <Form.Control
                          placeholder="Search product"
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
                        <th>SKU</th>
                        <th>Product <FontAwesomeIcon icon={faArrowUp} /></th>
                        <th>Deleted at</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        [...Array(8)].map((i, index) => (
                          <tr key={`product_row_${index + 1}`}>
                            <td>
                              <Form.Check
                                type={"checkbox"}
                                id={`select-product`}
                                label={``}
                              />
                            </td>
                            <td>471138788</td>
                            <td>
                              <Link to="/product/1" className="d-flex align-items-center">
                                <figure className='me-2'>
                                  <img src="/images/dummy-product.jpg" style={{width: 60}} />
                                </figure>
                                Asus ROG Flow Z13 GZ302EA-RU087WA Off Black
                              </Link>
                            </td>
                            <td>20 Jan 25</td>
                            <td>
                              <div className='d-flex'>
                                <button className='btn btn-primary me-2'>Restore</button>
                                <button className='btn btn-danger'>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  <div className='d-flex justify-content-center'>
                    <MyPagination />
                  </div>
                </div>
              }
              
            </div>
          </div>
        </div>

        <div className='col-sm-3'>
          <div className='card'>
            <div className='card-body'>
              <header>
                <h5>Top 10 sell of the month</h5>
              </header>
              <figure className='text-center'>
                <img src="/images/dummy-product.jpg" />
              </figure>
              <div className='row'>
                <div className='col-6'>
                  <table className='w-100'>
                    <tbody>
                      <tr>
                        <td><small>Sale Amount</small></td>
                        <td className='text-end'>20</td>
                      </tr>
                      <tr>
                        <td><small>Sales off</small></td>
                        <td className='text-end'>-$159.00</td>
                      </tr>
                      <tr>
                        <td><small>Total Views</small></td>
                        <td className='text-end'>3,652</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className='col-6 text-center'>
                  <strong className='h3'>$255,490</strong>
                  <p>Total Revenue</p>
                </div>
              </div>
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
        </div>
        
      </div>
      
    </div>
  )
}