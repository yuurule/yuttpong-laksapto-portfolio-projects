import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as BrandService from '../../services/brandService';
import * as CategoryService from '../../services/categoryService';
import * as ProductService from '../../services/productService';
import * as CampaignService from '../../services/campaignService';

export default function AddProductInCampaign({
  selectedCampaign,
  openDialog,
  handleCloseDialog,
  handleRefreshData
}) {

  const authUser = useSelector(state => state.auth.user);

  const [loadData, setLoadData] = useState(false);
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectBrands, setSelectBrands] = useState([]);
  const [selectCategories, setSelectCategories] = useState([]);
  const [loadProduct, setLoadProduct] = useState(false);
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
  const [selectedProducts, setSelctedProducts] = useState([]);
  const [onSubmit, setOnSubmit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadData(true);
      try {
        const brands = await BrandService.getBrands();
        const categories = await CategoryService.getCategories();
        const products = await ProductService.getAllProduct(productParamsQuery);

        // const tempParamsQuery = {...productParamsQuery};
        // tempParamsQuery.brands = brands.data.RESULT_DATA.map(i => (i.id));
        // tempParamsQuery.categories = categories.data.RESULT_DATA.map(i => (i.id));
        // const products = await ProductService.getAllProduct(tempParamsQuery);

        setBrandList(brands.data.RESULT_DATA);
        setSelectBrands(brands.data.RESULT_DATA.map(i => ({ id: i.id, isChecked: false })));
        setCategoryList(categories.data.RESULT_DATA);
        setSelectCategories(categories.data.RESULT_DATA.map(i => ({ id: i.id, isChecked: false })));
        setProductList(products.data.RESULT_DATA.filter(i => i.campaignProducts.length === 0));
        //setProductParamsQuery(tempParamsQuery);
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
  }, []);

  const handleSelectFilter = async (dataType, newSelectData) => {
    setLoadProduct(true);
    try {
      const tempParamsQuery = {...productParamsQuery};
      if(dataType === 'brand') {
        const getSelectBrands = newSelectData.filter(i => i.isChecked);
        tempParamsQuery.brands = getSelectBrands.map(i => (i.id));
      }
      else if(dataType === 'category') {
        const getSelectCategories = newSelectData.filter(i => i.isChecked);
        tempParamsQuery.categories = getSelectCategories.map(i => (i.id));
      }

      const filterProduct = await await ProductService.getAllProduct(tempParamsQuery);
      setProductList(filterProduct.data.RESULT_DATA.filter(i => i.campaignProducts.length === 0));
      setProductParamsQuery(tempParamsQuery);
    }
    catch(error) {
      console.log(error.message);
      toast.error(error.message);
    }
    finally {
      setLoadProduct(false);
    }
  }

  const handleConfirmAdd = async () => {
    setOnSubmit(true);
    try {
      await CampaignService.addProductsToCampaign(selectedCampaign?.id, selectedProducts, authUser.id)
        .then(res => {
          handleRefreshData(selectedCampaign?.id, selectedCampaign?.name);
          toast.success(`Add products to campaign is successfully.`);
          handleCloseDialog();
        })
        .catch(error => {
          throw new Error(`Add products to campaign is failed due to: ${error}`);
        });
    }
    catch(error) {
      console.log(error.message);
      toast.error(error.message);
    }
    finally {
      setOnSubmit(false);
    }
  }

  if(loadData) return <>กำลังโหลด...</>

  return (
    <Dialog open={openDialog}>
    
      <DialogTitle className='pb-0'>
        <p className='h4 mb-0'>Select Products</p>
        <small className='opacity-50' style={{fontSize: '12px'}}>First, select filter items what you need. this will show only items that not set in campaign.</small>
        <hr />
      </DialogTitle>
      
      {/* <form onSubmit={handleSubmit(onSubmit)} style={{width: 550}}> */}
        <DialogContent style={{width: 600}}>
          
          <div className='row'>

            <div className='col-3'>
              <strong>Product Brand</strong>
              {
                brandList.map((brand, index) => {
                  return (
                    <Form.Check
                      key={`brand_form_checkbox_${brand.id}`}
                      type="checkbox"
                      label={`${brand.name}`}
                      checked={(selectBrands.find(i => i.id === brand.id).isChecked)}
                      onChange={(e) => {
                        const tempSelectBrands = [...selectBrands];
                        tempSelectBrands.find(i => i.id === brand.id).isChecked = e.target.checked;
                        setSelectBrands(tempSelectBrands);
                        handleSelectFilter('brand', tempSelectBrands);
                      }}
                    />
                  )
                })
              }
              
              <strong className='mt-3 d-block'>Category</strong>
              {
                categoryList.map((category, index) => {
                  return (
                    <Form.Check
                      key={`category_form_checkbox_${category.id}`}
                      type="checkbox"
                      label={`${category.name}`}
                      checked={(selectCategories.find(i => i.id === category.id).isChecked)}
                      onChange={(e) => {
                        const tempSelectCategories = [...selectCategories];
                        tempSelectCategories.find(i => i.id === category.id).isChecked = e.target.checked;
                        setSelectCategories(tempSelectCategories);
                        handleSelectFilter('category', tempSelectCategories);
                      }}
                    />
                  )
                })
              }
            </div>

            <div className='col-9'>
              
                <div style={{maxHeight: 600, overflowY: 'auto'}}>
                  <p className='mb-0 opacity-50'>Result {productList.length} items</p>
                  {
                    !loadProduct
                    ? productList.map((product, index) => (
                      <div key={`product_list_${index}`} className='card w-100 mb-2'>
                        <div className='card-body d-flex justify-content-between'>
                          <div className='d-flex'>
                            <Form.Check
                              type="checkbox"
                              label=""
                              checked={(selectedProducts.filter(i => i === product.id).length > 0)}
                              onChange={(e) => {
                                const tempSelectedProducts = [...selectedProducts];
                                if(e.target.checked === true) {
                                  tempSelectedProducts.push(product.id);
                                  setSelctedProducts(tempSelectedProducts);
                                }
                                else {
                                  const removeResult = tempSelectedProducts.filter(i => i !== product.id);
                                  setSelctedProducts(removeResult);
                                }
                              }}
                            />
                            <div>
                              <p className='mb-0'>{product.name}</p>
                              <small className='opacity-50'>sku: {product.sku}</small>
                            </div>
                          </div>
                          <p className='mb-0'>฿{parseFloat(product.price).toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        </div>
                      </div>
                    ))
                    : <p>Loading...</p>
                  }
                </div>
              
            </div>

          </div>

        </DialogContent>
        <DialogActions className='d-flex justify-content-center'>
          <button 
            type="button"
            className='btn btn-success px-4 me-2'
            onClick={handleConfirmAdd}
          >
            <FontAwesomeIcon icon={faSave} className='me-2' />
            {/* {isSubmitting ? 'Processing...' : 'Add'} */}
            Confirm Add
          </button>
          <button 
            type="button"
            className='btn btn-danger px-4'
            onClick={() => {
              handleCloseDialog();
            }}
          ><FontAwesomeIcon icon={faClose} className='me-2' />Cancel</button>
        </DialogActions>
      {/* </form> */}

    </Dialog>
  )
}