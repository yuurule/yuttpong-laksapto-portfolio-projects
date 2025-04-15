'use client';

import { useState, useEffect } from 'react';
import styles from './ProductListOption.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductListSorting() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const brands = searchParams.get('brands');
  const categories = searchParams.get('categories');
  const price = searchParams.get('price');
  const orderBy = searchParams.get('orderBy');
  const orderDir = searchParams.get('orderDir');
  const campaigns = searchParams.get('campaigns');
  const onSale = searchParams.get('onSale');
  const topSale = searchParams.get('topSale');
  const search = searchParams.get('search');
  const tags = searchParams.get('tags');

  const [onSaleValue, setOnSaleValue] = useState(() => {
    if(onSale && onSale === 'true') return true
    return false;
  });
  const [sorting, setSorting] = useState(() => {
    if(topSale) {
      if(topSale === 'desc') return '5';
      else if(topSale === 'asc') return '6';
    }
    else {
      if(orderBy && orderDir) {
        if(orderBy === 'createdAt') {
          if(orderDir === 'desc') return '1';
          else if(orderDir === 'asc') return '2';
        }
        else if(orderBy === 'price') {
          if(orderDir === 'desc') return '3';
          else if(orderDir === 'asc') return '4';
        }
      }
    }
  });

  const handleOnChange = (changeType: string, value: string | boolean) => {
    let resultUrl = `/products?`;

    if(changeType === 'onSale') {
      if(value === true) {
        resultUrl += `onSale=${value}&`;
      }
    }
    else {
      if(onSale) resultUrl += `onSale=${onSale}&`;
    }

    if(changeType === 'orderBy') {
      switch(value) {
        case '1': 
          resultUrl += `orderBy=createdAt&orderDir=desc&`;
          break;
        case '2': 
          resultUrl += `orderBy=createdAt&orderDir=asc&`;
          break;
        case '3': 
          resultUrl += `orderBy=price&orderDir=desc&`;
          break;
        case '4': 
          resultUrl += `orderBy=price&orderDir=asc&`;
          break;
      }
    }
    else {
      if(orderBy) resultUrl += `orderBy=${orderBy}&`;
      if(orderDir) resultUrl += `orderDir=${orderDir}&`;
    }

    if(changeType === 'topSale') {
      switch(value) {
        case '5': 
          resultUrl += `topSale=desc&`;
          break;
        case '6': 
          resultUrl += `topSale=asc&`;
          break;
      }
    }

    if(!onSale) {
      if(campaigns) resultUrl += `campaigns=${campaigns}&`;
    }
    if(brands) resultUrl += `brands=${brands}&`;
    if(categories) resultUrl += `categories=${categories}&`;
    if(price) resultUrl += `price=${price}&`;
    if(search) resultUrl += `search=${search}&`;
    if(tags) resultUrl += `tags=${tags}&`;

    //console.log(resultUrl);
    router.push(resultUrl);
  }

  return (
    <div className={`${styles.productSorting}`}>
      <div className={`form-check me-4 ${styles.formCheck}`}>
        <input 
          className="form-check-input" 
          type="checkbox"
          checked={onSaleValue}
          onChange={(e: any) => {
            setOnSaleValue(e.target.checked);
            handleOnChange('onSale', e.target.checked)
          }}
        />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          Show product on sales only
        </label>
      </div>
      <div className={`${styles.selectOption}`}>
        <span>Sorting:</span> 
        <select 
          className={`form-select`} 
          defaultValue={sorting}
          onChange={(e: any) => {
            setSorting(e.target.value);
            if(e.target.value === '5' || e.target.value === '6') {
              handleOnChange('topSale', e.target.value);
            }
            else {
              handleOnChange('orderBy', e.target.value);
            }
          }}
        >
          <option value="0">ไม่จัดเรียง</option>
          <option value="1">ใหม่สุด</option>
          <option value="2">เก่าสุด</option>
          <option value="3">ราคามาก &gt; น้อย</option>
          <option value="4">ราคาน้อย &lt; มาก</option>
          <option value="5">ขายดีมาก &gt; น้อย</option>
          <option value="6">ขายดีน้อย &lt; มาก</option>
        </select>
      </div>
    </div>
  )
}