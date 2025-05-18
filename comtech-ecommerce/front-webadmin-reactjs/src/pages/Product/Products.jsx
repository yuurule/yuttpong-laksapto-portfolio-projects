import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch, faArrowUp, faArrowLeft, faClose, faTrashAlt, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { Link, useNavigate } from 'react-router';
import * as ProductService from '../../services/productService';
import { toast } from 'react-toastify';
import OrderByBtn from '../../components/OrderByBtn/OrderByBtn';
import TopTotalSellProduct from '../../components/Product/TopTotalSellProduct';
import { decodeJWT, formatTimestamp, sumTotalSale } from '../../utils/utils';
import { Dialog, DialogContent, DialogActions } from '@mui/material';

export default function Products() {

  const serverPath = import.meta.env.VITE_API_URL;
  const authUser = useSelector(state => state.auth.user);
  const authToken = useSelector(state => state.auth.accessToken)
  const userRole = authToken ? decodeJWT(authToken).role : ''

  const navigate = useNavigate();
  const [loadData, setLoadData] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [showSoftDelete, setShowSoftDelete] = useState(false);
  const [productList, setProductList] = useState([]);
  const [productInTrashList, setProductInTrashList] = useState([]);
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
  const [productTrashParamsQuery, setProductTrashParamsQuery] = useState({
    page: 1,
    pageSize: setPageSize,
    orderBy: 'createdAt',
    orderDir: 'desc',
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
  const [searchQuery, setSearchQuery] = useState('');
  const [useSearchQuery, setUseSearchQuery] = useState(null);

  const [selectedDeleteProducts, setSelectedDeleteProducts] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [onDeleteProducts, setOnDeleteProducts] = useState(false);

  const [trashCurrentPage, setTrashCurrentPage] = useState(1);
  const [trashTotalPage, setTrashTotalPage] = useState(1);

  useEffect(() => {
    const fecthData = async () => {
      setLoadData(true);
      try {
        const products = await ProductService.getStatisticProduct(productParamsQuery);
        const productsInTrash = await ProductService.getAllProductInTrash(productTrashParamsQuery)
        //console.log(products.data.RESULT_DATA);
        setProductList(products.data.RESULT_DATA);
        setCurrentPage(products.data.RESULT_META.currentPage);
        setTotalPage(products.data.RESULT_META.totalPages);

        setProductInTrashList(productsInTrash.data.RESULT_DATA);
        setTrashCurrentPage(productsInTrash.data.RESULT_META.currentPage);
        setTrashTotalPage(productsInTrash.data.RESULT_META.totalPages);
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
  const handleSelectTrashPage = (pageNumber) => {
    const tempParamsQuery = {...productTrashParamsQuery};
    tempParamsQuery.page = pageNumber;
    setProductTrashParamsQuery(tempParamsQuery);
  }

  const handleConfirmDelete = async () => {
    if(userRole === 'ADMIN') {
      setOnDeleteProducts(true);
      try {
        await ProductService.moveProductsToTrash(selectedDeleteProducts, authUser.id)
          .then(res => {
            handleRefreshData();
            toast.success(`Move products to trash is successfully.`);
            setSelectedDeleteProducts([]);
            setOpenDeleteDialog(false);
          })
          .catch(error => {
            throw new Error(`Move products to trash is failed due to: ${error}`);
          }); 
      }
      catch(error) {
        console.log(error);
        toast.error(`${error}`);
      }
      finally {
        setOnDeleteProducts(false);
      }
    }
    else {
      toast.error(`You are in "Guest" mode, this action is not authorize.`)
    }
  }

  if(loadData) return <div>กำลังโหลด...</div> 

  return (
    <div className={`page products-page page-padding-btn`}>

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

        <div className='col-lg-9 mb-3 productsTable-col'>
          <div className="card">
            <div className="card-body">
              {
                !showSoftDelete
                ?
                <div>
                  <div className='utils-head-table'>
                    <div className='utils-btn-group'>
                      <div>
                        <button 
                          className='btn my-btn narrow-btn red-btn me-2'
                          type="button"
                          disabled={(selectedDeleteProducts.length === 0)}
                          onClick={() => setOpenDeleteDialog(true)}
                        >
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
                          <div className='amount-label'>{productInTrashList.length}</div>
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
                  <div className='table-responsive'>
                    <table className="table products-table">
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
                                    checked={(selectedDeleteProducts.filter(i => i === product.id).length > 0)}
                                    onChange={(e) => {
                                      const tempSelectedDeletedProducts = [...selectedDeleteProducts];
                                      if(e.target.checked === true) {
                                        tempSelectedDeletedProducts.push(product.id);
                                        setSelectedDeleteProducts(tempSelectedDeletedProducts);
                                      }
                                      else {
                                        const removeResult = tempSelectedDeletedProducts.filter(i => i !== product.id);
                                        setSelectedDeleteProducts(removeResult);
                                      }
                                    }}
                                  />
                                </div>
                              </td>
                              <td style={{width: '50%'}}>
                                <Link to={`/product/${product.id}`} className="d-flex align-items-center">
                                  <figure className='me-2 mb-0'>
                                    {
                                      product.images.length > 0
                                      ?
                                      <img src={`${serverPath}/${product.images[0].path}`} style={{width: 60}} />
                                      :
                                      <img src="https://placehold.co/60x40" style={{width: 60}} />
                                    }
                                  </figure>
                                  <div>
                                    <p className='mb-0'>{product.name}</p>
                                    sku: <small className='opacity-50'>{product.sku}</small>
                                  </div>
                                </Link>
                              </td>
                              <td>{product.inStock.inStock}</td>
                              <td>฿{parseFloat(product.price).toLocaleString('th-TH')}</td>
                              <td>{product.orderItems.length === 0 ? '0' : sumTotalSale(product.orderItems).saleAmount}</td>
                              <td>{product.orderItems.length === 0 ? '0' : sumTotalSale(product.orderItems).totalSale}</td>
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
                </div>
                :
                <div>
                  <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div className='d-flex'>
                      <button className='btn my-btn narrow-btn gray-btn me-2' onClick={() => setShowSoftDelete(false)}>
                        <FontAwesomeIcon icon={faArrowLeftLong} className='me-1' /> Back
                      </button>
                      {/* <button className='btn btn-danger'>Delete</button> */}
                    </div>
                    <div className="search-input">
                      {/* <InputGroup>
                        <Form.Control
                          placeholder="Search product"
                        />
                        <Button>
                          <FontAwesomeIcon icon={faSearch} />
                        </Button>
                      </InputGroup> */}
                    </div>
                  </div>
                  <div className='table-responsive'>
                    <table className="table">
                      <thead>
                        <tr>
                          <th className='selectRow'></th>
                          <th>Product <FontAwesomeIcon icon={faArrowUp} /></th>
                          <th>Deleted at</th>
                          {/* <th></th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {
                          productInTrashList.map((i, index) => (
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
                                <div className='d-flex'>
                                  <figure className='me-2 mb-0'>
                                    <img src="/images/dummy-product.jpg" style={{width: 60}} />
                                  </figure>
                                  <div>
                                    <p className='mb-0'>{i.name}</p>
                                    sku: <small className='opacity-50'>{i.sku}</small>
                                  </div>
                                </div>
                              </td>
                              <td>{formatTimestamp(i.deletedAt)}</td>
                              {/* <td>
                                <div className='d-flex'>
                                  <button className='btn btn-primary me-2'>Restore</button>
                                </div>
                              </td> */}
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                  <div className='d-flex justify-content-center'>
                    <MyPagination
                      currentPage={trashCurrentPage}
                      totalPage={trashTotalPage}
                      handleSelectPage={handleSelectTrashPage}
                    />
                  </div>
                </div>
              }
              
            </div>
          </div>
        </div>

        <div className='col-md-6 col-lg-3 mb-3 topProductSell-col'>
          <TopTotalSellProduct />
        </div>
        
      </div>
      
      <Dialog open={openDeleteDialog} className='custom-dialog'>
        <DialogContent>
          <p className='h4 text-center'>Do you confirm remove these campaigns to trash?</p>
        </DialogContent>
        <DialogActions className='d-flex justify-content-center'>
          <button 
            type="button"
            className='btn my-btn green-btn big-btn w-50'
            onClick={handleConfirmDelete}
          >
            <FontAwesomeIcon icon={faTrashAlt} className='me-2' />
            Yes, confirm
          </button>
          <button 
            type="button"
            className='btn my-btn red-btn big-btn w-50'
            onClick={() => {
              setSelectedDeleteProducts([]);
              setOpenDeleteDialog(false)
            }}
          ><FontAwesomeIcon icon={faClose} className='me-2' />No, cancel</button>
        </DialogActions>
      </Dialog>
    </div>
  )
}