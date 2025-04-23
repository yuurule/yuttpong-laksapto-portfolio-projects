import { useState, useEffect } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus, faChevronLeft, faChevronRight, faArrowLeft, faClose } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { Link, useNavigate } from 'react-router';
import * as ProductService from '../../services/productService';
import * as BrandService from '../../services/brandService';
import { toast } from 'react-toastify';
import OrderByBtn from '../../components/OrderByBtn/OrderByBtn';

export default function Products() {

  const navigate = useNavigate();
  const [loadData, setLoadData] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [showSoftDelete, setShowSoftDelete] = useState(false);
  const [productList, setProductList] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const setPageSize = 8;
  const [productParamsQuery, setProductParamsQuery] = useState({
    page: 1,
    pageSize: setPageSize,
    orderBy: 'createdAt',
    orderDir: 'desc',
    search: null,
    inStock: null,
    sale: null,
    totalSale: null,
  });

  const [orderBy, setOrderBy] = useState([
    { column: 'name', value: null },
    { column: 'inStock', value: null },
    { column: 'price', value: null },
    { column: 'sale', value: null }, // quantity of sale
    { column: 'totalSale', value: null }, // total money recieve from sell
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(null);
  const [useSearchQuery, setUseSearchQuery] = useState(null);

  useEffect(() => {
    const fecthData = async () => {
      setLoadData(true);
      try {
        const products = await ProductService.getStatisticProduct(productParamsQuery);
        setProductList(products.data.RESULT_DATA);
        setCurrentPage(products.data.RESULT_META.currentPage);
        setTotalPage(products.data.RESULT_META.totalPages);
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
  }, [refresh, productParamsQuery]);

  const handleRefreshData = () => setRefresh(prevState => prevState + 1);

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
      case 'inStock':
        tempParamsQuery.inStock = newValue;
        break;
      case 'price':
        if(newValue !== null) {
          tempParamsQuery.orderBy = 'price';
          tempParamsQuery.orderDir = newValue;
        }
        break;
      case 'sale':
        tempParamsQuery.sale = newValue;
        break;
      case 'totalSale':
        tempParamsQuery.totalSale = newValue;
        break;
    }

    setProductParamsQuery(tempParamsQuery);
    setOrderBy(tempResult);
  }

  const handleSearchQuery = () => {
    if(searchQuery !== null && searchQuery.trim() !== '') {
      const tempParamsQuery = handleResetParamsQuery();
      tempParamsQuery.search = searchQuery;
      setUseSearchQuery(searchQuery);
      setProductParamsQuery(tempParamsQuery);
    }
  }
  const handleClearSearchQuery = () => {
    setSearchQuery(null);
    setUseSearchQuery(null);
    const tempParamsQuery = handleResetParamsQuery();
    tempParamsQuery.search = null;
    setProductParamsQuery(tempParamsQuery);
  }

  const handleResetParamsQuery = () => {
    return {
      page: 1,
      pageSize: setPageSize,
      orderBy: 'createdAt',
      orderDir: 'desc',
      search: useSearchQuery,
      inStock: null,
      sale: null,
      totalSale: null,
    }
  }

  const handleSelectPage = (pageNumber) => {
    const tempParamsQuery = {...productParamsQuery};
    tempParamsQuery.page = pageNumber;
    setProductParamsQuery(tempParamsQuery);
  }

  if(loadData) return <div>กำลังโหลด...</div> 

  return (
    <div className={`page`}>

      <header className="page-title">
        <h1>Products</h1>
        <p>All product in your stock</p>
      </header>
      
      <div className="row">
        <header className="col-12">
          <div className='d-flex justify-content-end align-items-center mb-3'>
            <Link to="/product/create" className='btn my-btn big-btn'>+ Add New Product</Link>
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
                    <div className="search-input">
                      <InputGroup>
                        <Form.Control
                          value={searchQuery}
                          placeholder="Search product"
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
                          Product
                          <OrderByBtn 
                            currentStatus={orderBy[0].value}
                            handleOnClick={() => handleChangeOrderBy('name')}
                          />
                        </th>
                        <th>
                          In Stock 
                          <OrderByBtn 
                            currentStatus={orderBy[1].value}
                            handleOnClick={() => handleChangeOrderBy('inStock')}
                          />
                        </th>
                        <th>
                          Price 
                          <OrderByBtn 
                            currentStatus={orderBy[2].value}
                            handleOnClick={() => handleChangeOrderBy('price')}
                          />
                        </th>
                        <th>
                          Sale 
                          <OrderByBtn 
                            currentStatus={orderBy[3].value}
                            handleOnClick={() => handleChangeOrderBy('sale')}
                          />
                        </th>
                        <th>
                          Total Revenue 
                          <OrderByBtn 
                            currentStatus={orderBy[4].value}
                            handleOnClick={() => handleChangeOrderBy('totalSale')}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        productList.map((product, index) => (
                          <tr key={`product_${product.id}`}>
                            <td className='selectRow'>
                              <div className='flexCenterXY'>
                                <Form.Check
                                  type={"checkbox"}
                                  id={`select-product`}
                                  label={``}
                                />
                              </div>
                            </td>
                            <td style={{width: '50%'}}>
                              <Link to={`/product/${product.id}`} className="d-flex align-items-center">
                                <figure className='me-2 mb-0'>
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
                    <MyPagination
                      currentPage={currentPage}
                      totalPage={totalPage}
                      handleSelectPage={handleSelectPage}
                    />
                  </div>
                </div>
                :
                <div>
                  <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div className='d-flex'>
                      <button className='btn my-btn narrow-btn gray-btn me-2' onClick={() => setShowSoftDelete(false)}>
                        <FontAwesomeIcon icon={faArrowLeft} className='me-1' /> Back
                      </button>
                      {/* <button className='btn btn-danger'>Delete</button> */}
                    </div>
                    <div className="search-input">
                      <InputGroup>
                        <Form.Control
                          placeholder="Search product"
                        />
                        <Button>
                          <FontAwesomeIcon icon={faSearch} />
                        </Button>
                      </InputGroup>
                    </div>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th className='selectRow'></th>
                        <th>Product <FontAwesomeIcon icon={faArrowUp} /></th>
                        <th>Deleted at</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        [...Array(8)].map((i, index) => (
                          <tr key={`product_row_${index + 1}`}>
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
                              <Link to="/product/1" className="d-flex align-items-center">
                                <figure className='me-2'>
                                  <img src="/images/dummy-product.jpg" style={{width: 60}} />
                                </figure>
                                <div>
                                  <p className='mb-0'>Asus ROG Flow Z13 GZ302EA-RU087WA Off Black</p>
                                  sku: <small className='opacity-50'>123456789</small>
                                </div>
                              </Link>
                            </td>
                            <td>20 Jan 25</td>
                            <td>
                              <div className='d-flex'>
                                <button className='btn btn-primary me-2'>Restore</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  <div className='d-flex justify-content-center'>
                    <MyPagination
                      currentPage={1}
                      totalPage={1}

                    />
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
                <h5>Top 10 sell of the month<span></span></h5>
              </header>
              <figure className='text-center'>
                <img src="/images/dummy-product.jpg" />
              </figure>
              <div className='row mb-3'>
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
              <MyPagination />
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
  )
}