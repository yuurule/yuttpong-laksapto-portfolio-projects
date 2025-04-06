"use client";

import { useState, useEffect } from 'react';
import ProductBox from '@/components/ProductBox/ProductBox';
import Pagination from "@/components/Pagination/Pagination";
import { productService } from '@/services';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductQueryParams } from '@/types/PropsType';

export default function ProductList() {

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

  const [loadData, setLoadData] = useState(false)
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const fecthProducts = async () => {
      setLoadData(true);
      try {
        let productQueryParams: ProductQueryParams = {
          page: 1,
          pageSize: 16,
        }
        if(brands) productQueryParams.brands = brands.split(',').map(i => (parseInt(i)));
        if(categories) productQueryParams.categories = categories.split(',').map(i => (parseInt(i)));
        if(tags) productQueryParams.tags = tags.split(',').map(i => (parseInt(i)));
        if(campaigns) productQueryParams.campaigns = campaigns.split(',').map(i => (parseInt(i)));
        if(price) productQueryParams.price = price.split(',').map(i => (parseInt(i)));
        if(orderBy) productQueryParams.orderBy = orderBy;
        if(orderDir) productQueryParams.orderDir = orderDir;
        if(search) productQueryParams.search = search;
        if(onSale) productQueryParams.onSale = true;

        const products = await productService.getProducts(productQueryParams);
        setProductList(products.RESULT_DATA);
      }
      catch(error) {
        console.error(`Fecth products is faied due to reason: ${error}`)
      }
      finally { setLoadData(false) }
    }

    fecthProducts();
  }, [searchParams])

  return (
    <>
    {
      brands
      ?
      <>
      {
        productList.map((product: any, index: number) => (
          <div key={`product_list_item_${product?.id}`} className={`col-sm-3 mb-3 col-product`}>
            <ProductBox 
              data={product}
            />
          </div>
        ))
      }
      <div className="col-12">
        <Pagination />
      </div>
      </>
      :
      <p className='text-center my-5 h5 opacity-25'>We need product brand for show products<br />Select at least one brand please</p>
    }
    </>
  )
}