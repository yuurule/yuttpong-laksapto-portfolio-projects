import { useState, useEffect, Fragment } from 'react';
import MyPagination from '../MyPagination/MyPagination';
import * as ProductService from '../../services/productService';
import { sumTotalSale } from '../../utils/utils';

export default function TopTotalSellProduct() {

  const serverPath = import.meta.env.VITE_API_URL;
  const [loadData, setLoadData] = useState(false);
  const [productList, setProductList] = useState([]);
  const setPageSize = 1;
  const [paramsQuery, setParamsQuery] = useState({
    page: 1,
    pageSize: setPageSize,
    orderBy: 'createdAt',
    orderDir: 'desc',
    search: null,
    inStock: null,
    sale: null,
    totalSale: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    const fecthData = async () => {
      setLoadData(true);
      try {
        const products = await ProductService.getStatisticProduct(paramsQuery);
        //console.log(products.data.RESULT_DATA);
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
  }, [paramsQuery]);

  const handleSelectPage = (pageNumber) => {
    const tempParamsQuery = {...paramsQuery};
    tempParamsQuery.page = pageNumber;
    setParamsQuery(tempParamsQuery);
  }

  return (
    <div className='card topSellProductCard'>
      <div className='card-body'>
        <header>
          <h5>Top Seller Products<span></span></h5>
        </header>
        {
          productList.map(i => {
            return (
              <div key={`top_sell_item_${i.id}`} className='text-center'>
                <figure className='text-center mb-0'>
                  {
                    i.images.length > 0
                    ?
                    <img src={`${serverPath}/${i.images[0].path}`} className='mb-3 img-fluid' />
                    :
                    <img src="https://placehold.co/200x160" className='mb-3 img-fluid' />
                  }
                </figure>
                <p>{i.name}</p>
                <div className='d-flex justify-content-around align-items-end'>
                  <div>
                    <strong className='totalSale'>{sumTotalSale(i.orderItems).totalSale}</strong>
                    <p>Total Sale</p>
                  </div>
                  <div>
                    <strong 
                      className='totalSaleQuantity'>{sumTotalSale(i.orderItems).saleAmount}</strong>
                    <p>Sale Amount</p>
                  </div>
                </div>
              </div>
            )
          })
        }
        <MyPagination
          currentPage={currentPage}
          totalPage={totalPage}
          handleSelectPage={handleSelectPage}
        />
      </div>
    </div>
  )
}