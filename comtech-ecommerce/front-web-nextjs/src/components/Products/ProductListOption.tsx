'use client';

import { useState, useEffect } from 'react';
import styles from './ProductListOption.module.scss';
import { productService } from '@/services';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductListOption() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const brands = searchParams.get('brands');
  const categories = searchParams.get('categories');
  const price = searchParams.get('price');
  const orderBy = searchParams.get('orderBy');
  const orderDir = searchParams.get('orderDir');
  const campaigns = searchParams.get('campaigns');
  const onSale = searchParams.get('onSale');
  const search = searchParams.get('search');
  const tags = searchParams.get('tags');

  const [loadData, setLoadData] = useState(false);
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [prices, setPrices] = useState([
    { label: 'ทั้งหมด', value: 1 },
    { label: 'ตํ่ากว่า 15,000 บาท', value: 2 },
    { label: '15,000-30,000 บาท', value: 3 },
    { label: '30,000-50,000 บาท', value: 4 },
    { label: 'มากกว่า 50,000 บาท', value: 5 },
  ]);
  const [selectBrands, setSelectBrands] = useState(brands ? brands.split(',') : []);
  const [selectCategories, setSelectCategories] = useState(categories ? categories.split(',') : []);
  const [selectPrice, setSelectPrice] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoadData(true);
      try {
        const brands = await productService.getBrands();
        const categories = await productService.getCategories();

        setBrandList(brands.RESULT_DATA.map((i: any) => ({
          id: i.id,
          name: i.name,
          productAmount: i.products.length
        })));
        setCategoryList(categories.RESULT_DATA.map((i: any) => ({
          id: i.id,
          name: i.name,
          productAmount: i.products.length
        })));
      }
      catch(error) {
        console.error(`Fecth data failed due to: ${error}`);
      }
      finally { setLoadData(false); }
    }

    fetchData();
  }, []);

  const checkSelectBrand = (brandId: number) => {
    if(brands) {
      const findBrandId = selectBrands.find(i => parseInt(i) === brandId);
      if(findBrandId) {
        return true;
      }
    }
    return false;
  }

  const checkSelectCategory = (categoryId: number) => {
    if(categories) {
      const findCategoryId = selectCategories.find(i => parseInt(i) === categoryId);
      if(findCategoryId) {
        return true;
      }
    }
    return false;
  }

  const handleSelectCheckbox = (values: string[], checkboxType: string) => {
    let resultUrl = `/products?`;
    
    if(checkboxType === 'brands') {
      resultUrl += `brands=${values}&`;
    }
    else {
      if(brands) resultUrl += `brands=${brands}&`;
    }

    if(checkboxType === 'categories') {
      resultUrl += `categories=${values}&`;
    }
    else {
      if(categories) resultUrl += `categories=${categories}&`;
    }
    
    if(checkboxType === 'price') {
      const priceValue = values[0];
      switch(priceValue) {
        case '1': resultUrl += ``; break;
        case '2': resultUrl += `price=0,15000&`; break;
        case '3': resultUrl += `price=15000,30000&`; break;
        case '4': resultUrl += `price=30000,50000&`; break;
        case '5': resultUrl += `price=50000,300000&`; break;
      }
    }
    else {
      if(price) resultUrl += `price=${price}&`;
    }
    
    if(orderBy) resultUrl += `orderBy=${orderBy}&`;
    if(orderDir) resultUrl += `orderDir=${orderDir}&`;
    if(campaigns) resultUrl += `campaigns=${campaigns}&`;
    if(onSale) resultUrl += `campaigns=${campaigns}&`;
    if(search) resultUrl += `onSale=${onSale}&`;
    if(tags) resultUrl += `tags=${tags}&`;

    //console.log(resultUrl);
    router.push(resultUrl);
  }

  return (
    <>
    <div>
      <div className={`${styles.productListOption}`}>
        <h5 className={`${styles.title}`}>Brands</h5>
        {
          brandList.map((brand:any, index:number) => (
            <div key={`product_list_option_brands_${brand.id}`} className={`form-check ${styles.formCheck}`}>
              <input 
                className="form-check-input" 
                type="checkbox" 
                value={brand.id}
                checked={checkSelectBrand(brand.id)}
                onChange={(e: any) => {
                  const tempSelectValues = [...selectBrands];
                  let result: string[];
                  if(e.target.checked) {
                    tempSelectValues.push(e.target.value);
                    result = tempSelectValues;
                  }
                  else {
                    result = tempSelectValues.filter(i => i !== e.target.value);
                  }
                  setSelectBrands(result);
                  handleSelectCheckbox(result, 'brands');
                }}
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                {brand.name}
                <span className={styles.inStockAmount}>({brand.productAmount})</span>
              </label>
            </div>
          ))
        }
      </div>
    </div>
    <div>
      <div className={`${styles.productListOption}`}>
        <h5 className={`${styles.title}`}>Category</h5>
          {
            categoryList.map((category:any, index:number) => (
              <div key={`product_list_option_categories_${category.id}`} className={`form-check ${styles.formCheck}`}>
                <input 
                  className="form-check-input" 
                  type="checkbox"  
                  value={category.id}
                  checked={checkSelectCategory(category.id)}
                  onChange={(e: any) => {
                    const tempSelectValues = [...selectCategories];
                    let result: string[];
                    if(e.target.checked) {
                      tempSelectValues.push(e.target.value);
                      result = tempSelectValues;
                    }
                    else {
                      result = tempSelectValues.filter(i => i !== e.target.value);
                    }
                    setSelectCategories(result);
                    handleSelectCheckbox(result, 'categories');
                  }}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {category.name}
                  <span className={styles.inStockAmount}>({category.productAmount})</span>
                </label>
              </div>
            ))
          }
      </div>
    </div>
    <div>
      <div className={`${styles.productListOption}`}>
        <h5 className={`${styles.title}`}>Price</h5>
        {
          prices.map((price: any, index: number) => (
            <div key={`product_list_option_prices_${index + 1}`} className={`form-check ${styles.formCheck}`}>
              <input 
                className="form-check-input" 
                type="radio" 
                name="priceFilter"
                value={price.value} 
                defaultChecked={selectPrice === price.value}
                onChange={(e: any) => {
                  setSelectPrice(e.target.value);
                  handleSelectCheckbox(e.target.value, 'price');
                }}
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                {price.label}
              </label>
            </div>
          ))
        }
      </div>
    </div>
    </>
    
  )
}