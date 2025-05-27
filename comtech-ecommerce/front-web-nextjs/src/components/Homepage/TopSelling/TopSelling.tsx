import { unstable_noStore as noStore } from 'next/cache';
import styles from './TopSelling.module.scss';
import ProductBox from '@/components/ProductBox/ProductBox';
import Link from 'next/link';
import { productService } from '@/services';

export default async function TopSelling() {
  noStore();

  try {
    const brands = await productService.getBrands();
    const topSellProducts = await productService.getProducts({
      page: 1,
      pageSize: 4,
      brands: brands.RESULT_DATA.map((i:any) => (i.id)),
      topSale: 'desc'
    });

    return (
      <section id="top-selling" className={`topSelling ${styles.topSelling}`}>
      
        <div className='d-flex justify-content-end'>
          <Link href="/products?brands=all&categories=all" className='btn design-btn px-4 mb-3'>
            See all top sell notebooks
          </Link>
        </div>

        <div className='d-flex flex-container mb-5'>
          <div className={`gradient-box ${styles.rowHeader}`}>
            <p className='hidden-phone'>Top<br />Selling</p>
            <p className='show-phone mb-0'>Top Selling</p>
          </div>
          <div className={`${styles.productList}`}>
            <div className='row'>
              {
                topSellProducts.RESULT_DATA.map((product: any, index: number) => {
                  return (
                    <div key={`top_sell_product_${product.id}`} className='col-sm-3 product-box-col'>
                      <ProductBox
                        data={product}
                      />
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        
      </section>
    )

  } catch(error) {
    console.log('Failed to fetch product:', error);
    return <div>ไม่สามารถดึงข้อมูลสินค้าได้</div>;
  }
}