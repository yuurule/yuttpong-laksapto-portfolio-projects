import styles from './RelatedProduct.module.scss';
import ProductBox from '@/components/ProductBox/ProductBox';
import { productService } from '@/services';

export default async function RelatedProduct({
  productId,
  brand,
  categories = []
} : {
  productId: number,
  brand: number,
  categories: number[],
}) {

  try {
    const products = await productService.getProducts({
      page: 1,
      pageSize: 4,
      brands: [brand],
      categories: categories
    });
    const resultData = products.RESULT_DATA.filter((i:any) => i.id !== productId);

    return (
      <section id="related-products" className={`${styles.relatedProduct}`}>
        
        <div className='mb-5'>
          <div className={`gradient-box ${styles.rowHeader}`}>
            <p>Related<br />Products</p>
          </div>
          <div className='row'>
            {
              resultData.map((product: any, index: number) => {
                return (
                  <div key={`related_product_box_${product.id}`} className='col-sm-3'>
                    <ProductBox 
                      data={product}
                    />
                  </div>
                )
              })
            }
          </div>
        </div>
  
      </section>
    )

  } catch(error) {
    console.error('Failed to fetch product:', error);
    return <div>ไม่สามารถดึงข้อมูลสินค้าได้</div>;
  }

  
}