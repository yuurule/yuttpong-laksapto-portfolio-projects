import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import ProductImageThumbnail from "@/components/ProductDetail/ProductImageThumbnail/ProductImageThumbnail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import DetailsAndReviews from "@/components/ProductDetail/DetailsAndReviews/DetailsAndReviews";
import RelatedProduct from "@/components/ProductDetail/RelatedProduct/RelatedProduct";
import ProductCategory from "@/components/ProductCategory/ProductCategory";
import ProductTags from "@/components/ProductTags/ProductTags";
import styles from './ProductDetail.module.scss'
import StarRating from "@/components/ProductBox/StarRating/StarRating";
import { productService } from '@/services';
import AddToCart from "@/components/ProductDetail/AddToCart/AddToCart";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  try {
    const { id } = await params;
    const product = await productService.getOneProduct(id);
    const resultData = product.RESULT_DATA;

    console.log(resultData)

    const calculateProductPrice = () => {
      let result = 0;
      //if(resultData.)
    }

    return (
      <main className={`${styles.productDetail}`}>
        <Breadcrumbs />
        <div className='container mt-5'>
          <div className="row">
            {/* <header className="col-12">
              <PageHeader pageTitle="Product Detail" />
            </header> */}
            <div className="col-sm-6">
              <ProductImageThumbnail />
            </div>
            <div className="col-sm-6">
              <div className={`${styles.content}`}>
                <header>
                  {/* <ProductCategory /> */}
                  <h2 className={`${styles.productName}`}>{resultData?.name}</h2>
                  <div className="d-flex">
                    <StarRating rating={4} />
                    <small className="d-inline-block ms-3">(4.4) 15 Reviews</small>
                    <div>
                      {
                        resultData?.inStock.inStock > 0
                        ? <span className={`${styles.inStock}`}>in stock</span>
                        : <span className={`${styles.inStock}`}>out of stock</span>
                      }
                    </div>
                  </div>
                </header>
                <div className={`${styles.price}`}>
                  <p>$1,528.99</p>
                  <small><s>$1,729.99</s></small>
                  <small className="ms-2">(-7%)</small>
                </div>
                <div className={`${styles.specs}`}>
                  <div className="row">
                    <div className="col-sm-6">
                      <strong className={`${styles.title}`}>Main Specification</strong>
                      <ul>
                        <li><strong>CPU</strong>: {resultData?.specs?.processor}</li>
                        <li><strong>Graphic</strong>: {resultData?.specs?.graphic}</li>
                        <li><strong>Ram</strong>: {resultData?.specs?.memory}</li>
                        <li><strong>Harddrive</strong>: {resultData?.specs?.storage}</li>
                        <li><strong>Screen size</strong>: {resultData?.specs?.screen_size}</li>
                      </ul>
                    </div>
                    <div className="col-sm-6">
                      <strong className={`${styles.title}`}>What in box</strong>
                      <ul>
                        <li>Charge cable and block</li>
                        <li>Micro fiber fabric</li>
                        <li>Power adapter</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <AddToCart
                  productId={resultData.id}
                  price={resultData.price} 
                />
                
                <div className={`${styles.estimated}`}>
                  <ul>
                    <li>Estimated delivery time 14-30 days</li>
                    <li>18 months warranty at Genuine Warranty Center</li>
                    <li>Price is already include vat 7%</li>
                  </ul>
                </div>
                <ProductTags tags={resultData?.tags} />
              </div>
            </div>
            <div className="col-sm-12">
              <DetailsAndReviews 
                detail={resultData?.description}
                reviews={resultData?.reviews.filter((i: any) => i.approved === true)}
              />
            </div>
            <div className="col-sm-12">
              <RelatedProduct 
                productId={resultData.id}
                brand={resultData.brandId}
                categories={resultData.categories.map((i: any) => (i.category.id))}
              />

              <div className={`demo-box d-flex align-items-center ${styles.campaignBox}`} style={{height: 250, paddingLeft: '5%'}}>
                <div>
                  <span className='badge text-bg-danger mb-2'>Gamaing Notebook</span>
                  <strong className='h3 d-block'>Top Gaming Notebook</strong>
                  <p>Super Hi-end We Offer</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    )
  } catch(error) {
    console.error('Failed to fetch product:', error);
    return <div>ไม่สามารถดึงข้อมูลสินค้าได้</div>;
  }
}