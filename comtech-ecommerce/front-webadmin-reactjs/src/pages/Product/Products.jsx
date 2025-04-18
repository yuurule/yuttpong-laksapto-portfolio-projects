import { useState, useEffect } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus, faChevronLeft, faChevronRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { Link, useNavigate } from 'react-router';
import * as ProductService from '../../services/productService';
import * as BrandService from '../../services/brandService';
import { toast } from 'react-toastify';

export default function Products() {

  const navigate = useNavigate();

  const [loadData, setLoadData] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [showSoftDelete, setShowSoftDelete] = useState(false);
  const [productList, setProductList] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [productParamsQuery, setProductParamsQuery] = useState({
    page: null,
    pageSize: null,
    noPagination: true,
    brands: [],
    categories: [],
    tags: [],
    orderBy: 'createdAt',
    orderDir: 'desc'
  });

  useEffect(() => {
    const fecthData = async () => {
      setLoadData(true);
      try {
        const brands = await BrandService.getBrands();
        const tempProductParamsQuery = {...productParamsQuery};
        tempProductParamsQuery.brands = brands.data.RESULT_DATA.map(i => (i.id));
        const products = await ProductService.getAllProduct(tempProductParamsQuery);
        setProductList(products.data.RESULT_DATA);
        setProductParamsQuery(tempProductParamsQuery);
      }
      catch(error) {
        console.log(error);
        toast.error(error);
      }
      finally {
        setLoadData(false);
      }
    }

    fecthData();
  }, [refresh]);

  const handleRefreshData = () => setRefresh(prevState => prevState + 1);

  if(loadData) return <div>กำลังโหลด...</div> 

  return (
    <div className={`page`}>

      <header className="page-title">
        <h1>Products</h1>
        <p>All product in your stock</p>
      </header>
      
      <div className="row">
        <header className="col-12 d-flex justify-content-end align-items-center mb-3">
          <div>
            <Link to="/product/create" className='btn my-btn big-btn'>Add New Product</Link>
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
                    <div className='d-flex align-items-center'>
                      <div>
                        <button className='btn my-btn narrow-btn red-btn me-2'>
                          <FontAwesomeIcon icon={faTrash} className='me-2' />
                          Move to trash
                        </button>
                      </div>
                      <div>
                        <button 
                          className='btn my-btn narrow-btn gray-btn have-amount-label' 
                          onClick={() => setShowSoftDelete(true)}
                        >
                          In Trash
                          <div className='amount-label'>10</div>
                        </button>
                      </div>
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
                        <th>Sale <FontAwesomeIcon icon={faArrowUp} /></th>
                        <th>Total Revenue <FontAwesomeIcon icon={faMinus} /></th>
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
                            <td>฿{parseFloat(product.price).toLocaleString('th-TH')}</td>
                            <td>{product.stockSellEvents.length === 0 ? '0' : 'n/a'}</td>
                            <td>{product.orderItems.length === 0 ? '0' : 'n/a'}</td>
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