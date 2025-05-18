import { unstable_noStore as noStore } from 'next/cache';
import ProductBox from '@/components/ProductBox/ProductBox';
import { productService } from '@/services';

export default async function NewArrival() {
  noStore();
  
  try {
    const brands = await productService.getBrands();
    const products = await productService.getProducts({
      page: 1,
      pageSize: 8,
      brands: brands.RESULT_DATA.map((i:any) => (i.id))
    });

    return (
      <div className='row'>
      {
        products.RESULT_DATA.map((product: any, index: number) => {
          return (
            <div key={`new_arrival_product_${product.id}`} className='col-sm-6 mb-3'>
              <ProductBox 
                data={product}
                previewStyle="horizontal" 
              />
            </div>
          )
        })
      }
      </div>
    )
  } catch(error) {
    console.error('Failed to fetch product:', error);
    return <div>ไม่สามารถดึงข้อมูลสินค้าได้</div>;
  }
}