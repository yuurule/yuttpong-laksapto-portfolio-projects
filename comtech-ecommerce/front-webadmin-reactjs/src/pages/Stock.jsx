import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faAdd, faMinus, faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../components/MyPagination/MyPagination';
import * as ProductService from '../services/productService';
import * as StockService from '../services/stockService';
import * as BrandService from '../services/brandService';
import { formatTimestamp } from '../utils/utils';
import StockActionHistory from '../components/Stock/StockActionHistory';
import StockSellActionHistory from '../components/Stock/StockSellActionHistory';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import OrderByBtn from '../components/OrderByBtn/OrderByBtn';

const inStockSchema = z.object({
  actionType: z.enum(['ADD', 'REMOVE']),
  quantity: z
    .coerce
    .number()
    .min(1, { message: 'required' }),
  description: z
    .string()
    .optional()
})
.refine(
  data => !(data.actionType === "REMOVE" && (data.description === undefined || data.description.trim() === "")),
  {
    message: "กรุณากรอกเหตุผลในการ remove",
    path: ["description"]
  }
);

export default function Stock() {

  const authUser = useSelector(state => state.auth.user);

  const [loadData, setLoadData] = useState(false);
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
  const [products, setProducts] = useState([]);
  const [stockActions, setStockActions] = useState([]);
  const [stockSellActions, setStockSellActions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState(null); // 'ADD', 'REMOVE'
  const [openManageStockDialog, setOpenManageStockDialog] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(null);
  const [useSearchQuery, setUseSearchQuery] = useState(null);

  const [orderBy, setOrderBy] = useState([
    { column: 'name', value: null },
    { column: 'inStock', value: null },
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(inStockSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoadData(true);
      try {
        const products = await ProductService.getStatisticProduct(productParamsQuery);
        const stockActions = await StockService.getAllStockAction();
        const stockSellActions = await StockService.getAllStockSellAction();

        setProducts(products.data.RESULT_DATA);
        setCurrentPage(products.data.RESULT_META.currentPage);
        setTotalPage(products.data.RESULT_META.totalPages);
        setStockActions(stockActions.data.RESULT_DATA);
        setStockSellActions(stockSellActions.data.RESULT_DATA);
      }
      catch(error) {
        console.log(error.message);
        toast.error(error.message);
      }
      finally {
        setLoadData(false);
      }
    }

    fetchData();
  }, [refresh, productParamsQuery]);

  useEffect(() => {
    setValue('actionType', actionType);
  }, [actionType, setValue]);

  const handleRefreshData = () => setRefresh(prevState => prevState + 1);

  const onSubmitManage = async (data) => {
    const requestData = {
      productId: selectedProduct.id,
      actionType: actionType,
      userId: authUser.id,
      quantity: data.quantity,
      description: data.description
    }

    try {
      await StockService.createStockAction(requestData)
        .then(res => {
          toast.success(`${actionType} in stock is successfully!`);
          handleRefreshData();
        })
        .catch(error => {
          throw new Error(`${actionType} in stock error due to: ${error}`)
        });
    }
    catch(error) {
      console.log(error);
      toast.error(error);
    }
    finally {
      setOpenManageStockDialog(false);
      setTimeout(() => {
        setSelectedProduct(null);
        setActionType(null);
      }, 600);
      reset();
    }
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
      case 'inStock':
        tempParamsQuery.inStock = newValue;
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
        <h1>In Stock</h1>
        <p>Quantity have in stock of every product</p>
      </header>
          
      <div className="row mt-4">
        <div className='col-sm-6'>
          <div className="card">
            <div className="card-body">
              {
                products.length > 0
                ?
                <>
                <div className='d-flex justify-content-end align-items-center mb-3'>
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
                      <th>Last Updated</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      products.map((product, index) => (
                        <tr key={`product_stock_row_${index + 1}`}>
                          <td style={{width: 300}}>
                            {product.name}<br /><small className='opacity-50'>SKU:{product.sku}</small>
                          </td>
                          <td>{product.inStock.inStock}</td>
                          <td>{formatTimestamp(product.inStock.updatedAt)}</td>
                          <td>
                            <div className='d-flex'>
                              <button
                                type="button"
                                className='btn btn-primary me-2'
                                onClick={() => {
                                  setSelectedProduct({
                                    id: product.id,
                                    name: product.name,
                                    sku: product.sku
                                  });
                                  setActionType('ADD');
                                  setOpenManageStockDialog(true);
                                }}
                              ><FontAwesomeIcon icon={faAdd} /></button>
                              <button 
                                type="button"
                                className='btn btn-danger'
                                onClick={() => {
                                  setSelectedProduct({
                                    id: product.id,
                                    name: product.name,
                                    sku: product.sku
                                  });
                                  setActionType('REMOVE');
                                  setOpenManageStockDialog(true);
                                }}
                              ><FontAwesomeIcon icon={faMinus} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <MyPagination
                  currentPage={currentPage}
                  totalPage={totalPage}
                  handleSelectPage={handleSelectPage}
                />
                </>
                :
                <p className='my-5 text-center'>ยังไม่มีข้อมูล</p>
              }
              
            </div>
          </div>
        </div>

        <div className='col-sm-6'>
          <div className='card mb-3'>
            <div className='card-body'>
              <StockActionHistory data={stockActions} />
            </div>
          </div>

          <div className='card'>
            <div className='card-body'>
              <StockSellActionHistory data={stockSellActions} />
            </div>
          </div>
        </div>
        
      </div>

      <Dialog open={openManageStockDialog}>

        <DialogTitle>
          {actionType} in stock for "{selectedProduct?.name} / SKU: {selectedProduct?.sku}"
        </DialogTitle>
        
        <form onSubmit={handleSubmit(onSubmitManage)}>
          <DialogContent>
            <input
              type="้hidden"
              {...register('actionType')}
              style={{display: 'none'}}
            />

            <div className="form-group mb-3">
              <label className='form-label'>{actionType} Quantity</label>
              <input
                type="number"
                min={0}
                {...register('quantity')}
                className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
              />
              {errors.quantity && <small className="invalid-feedback">{errors.quantity.message}</small>}
            </div>

            <div className="form-group mb-3">
              <label className='form-label'>Description / Reason</label>
              <textarea
                rows={5}
                {...register('description')}
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              ></textarea>
              {errors.description && <small className="invalid-feedback">{errors.description.message}</small>}
            </div>
          </DialogContent>
          <DialogActions className='d-flex justify-content-center'>
            <button 
              type="submit"
              className='btn btn-success px-4 me-2'
            ><FontAwesomeIcon icon={faSave} className='me-2' />Save</button>
            <button 
              type="button"
              className='btn btn-danger px-4'
              onClick={() => {
                setOpenManageStockDialog(false);
                setTimeout(() => {
                  setSelectedProduct(null);
                  setActionType(null);
                }, 600);
                reset();
              }}
            ><FontAwesomeIcon icon={faClose} className='me-2' />Cancel</button>
          </DialogActions>
        </form>

      </Dialog>
      
    </div>
  )
}