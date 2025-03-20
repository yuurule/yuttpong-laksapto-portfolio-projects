import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as BrandService from '../../services/brandService';
import * as CategoryService from '../../services/categoryService';
import * as ProductService from '../../services/productService';

export default function AddProductInCampaign({
  openDialog,
  handleCloseDialog,
}) {

  const [loadData, setLoadData] = useState(false);
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectBrands, setSelectBrands] = useState([]);
  const [selectCategories, setSelectCategories] = useState([]);
  const [selectProducts, setSelectProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadData(true);
      try {
        const brands = await BrandService.getBrands();
        const categories = await CategoryService.getCategories();

        setBrandList(brands.data.RESULT_DATA);
        setSelectBrands(brands.data.RESULT_DATA.map(i => (i.id)));
        setCategoryList(categories.data.RESULT_DATA);
        setSelectCategories(categories.data.RESULT_DATA.map(i => (i.id)));
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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadData(true);
      try {
        const products = await ProductService.getAllProduct();
        setProductList(products.data.RESULT_DATA);
      }
      catch(error) {
        console.log(error.message);
        toast.error(error.message);
      }
      finally {
        setLoadData(false);
      }
    }

    fetchProducts();
  }, [selectBrands, selectCategories])

  if(loadData) return <>กำลังโหลด...</>

  return (
    <Dialog open={openDialog}>
    
      <DialogTitle className='pb-0'>
        <p className='h4 mb-0'>Select Products</p>
        <small className='opacity-50'>Total {productList.length} items</small>
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
                      checked={selectBrands.filter(b => b === brand.id).length > 0}
                      onChange={(e) => {
                        const tempSelectBrands = [...selectBrands];
                        if(e.target.checked) tempSelectBrands.push(brand.id);
                        else tempSelectBrands.filter(i => i !== brand.id);
                        setSelectBrands(tempSelectBrands);
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
                      checked={selectCategories.filter(c => c == category.id).length > 0}
                    />
                  )
                })
              }
            </div>

            <div className='col-9'>
              <div style={{maxHeight: 600, overflowY: 'auto'}}>
                {
                  productList.map((product, index) => (
                    <div key={`product_list_${index}`} className='card w-100 mb-3'>
                      <div className='card-body d-flex justify-content-between'>
                        <div className='d-flex'>
                          <Form.Check
                            type="checkbox"
                            label=""
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
                }
              </div>
            </div>

          </div>

        </DialogContent>
        <DialogActions className='d-flex justify-content-center'>
          <button 
            type="submit"
            className='btn btn-success px-4 me-2'
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