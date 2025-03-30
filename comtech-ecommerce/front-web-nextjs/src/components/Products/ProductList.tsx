import ProductBox from '@/components/ProductBox/ProductBox';
import Pagination from "@/components/Pagination/Pagination";
import { productService } from '@/services';

export default async function ProductList() {
  try {
    const brands = await productService.getBrands();
    const products = await productService.getProducts({
      page: 1,
      pageSize: 12,
      brands: brands.RESULT_DATA.map((i:any) => (i.id))
    });

    return (
      <>
      {
        products.RESULT_DATA.map((product: any, index: number) => (
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
    )
  } catch(error) {
    console.error('Failed to fetch product:', error);
    return <div>ไม่สามารถดึงข้อมูลสินค้าได้</div>;
  }
}