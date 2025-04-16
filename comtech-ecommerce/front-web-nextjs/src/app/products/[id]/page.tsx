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
import { moneyFormat } from "@/utils/rendering";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  try {
    const { id } = await params;
    const product = await productService.getOneProduct(id);
    const resultData = product.RESULT_DATA;
    //console.log(product.RESULT_DATA)

    const calculateTotalRating = () => {
      const reviews = resultData.reviews;
      let resultRating = 0;
      if(reviews.length > 0) {
        reviews.map((i: any) => resultRating += i.rating);
        return resultRating / reviews.length;
      }
      else {
        return resultRating;
      }
    }

    const calculateProductPrice = () => {
      let realPrice = parseFloat(resultData.price);
      let sellPrice = 0;
      let discount = 0;

      if(resultData.campaignProducts.length > 0) {
        discount = resultData.campaignProducts[0].campaign.discount;
        sellPrice = realPrice - ((realPrice * discount) / 100);
      }
      else {
        sellPrice = realPrice;
      }

      return { realPrice, sellPrice, discount };
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
                  <h2 className={`${styles.productName}`}>{resultData?.name}</h2>
                  <div className="d-flex align-items-center mb-2">
                    <StarRating rating={calculateTotalRating()} />
                    <small className="d-inline-block ms-3">({resultData.reviews.length} review{resultData.reviews.length > 1 ? 's' : null})</small>
                    <div>
                      {
                        resultData.inStock.inStock > 0
                        ? <span className={`${styles.inStock}`}>{resultData.inStock.inStock} in stock</span>
                        : <span className={`${styles.inStock} ${styles.out}`}>out of stock</span>
                      }
                    </div>
                  </div>
                </header>
                <div className={`${styles.price}`}>
                  {
                    calculateProductPrice().discount === 0
                    ?
                    <p>฿{moneyFormat(calculateProductPrice().sellPrice, 2, 2)}</p>
                    :
                    <>
                    <p>฿{moneyFormat(calculateProductPrice().sellPrice, 2, 2)}</p>
                    <small><s>฿{moneyFormat(calculateProductPrice().realPrice, 2, 2)}</s></small>
                    <small className="ms-2">(-{calculateProductPrice().discount}%)</small>
                    </>
                  }
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

                {
                  resultData.inStock.inStock > 0
                  ?
                  <AddToCart
                    productId={resultData.id}
                    price={calculateProductPrice().sellPrice}
                    currentInStock={resultData.inStock.inStock}
                  />
                  :
                  <span className="alert alert-danger d-inline-block">Sorry, this product is out of stock</span>
                }
                
                
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
                productId={parseInt(id)}
                detail={resultData?.description}
                reviews={resultData?.reviews}
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
    console.log('Failed to fetch product:', error);
    return (
      <main className={`${styles.productDetail}`}>
        <Breadcrumbs />
        <div className='container mt-5'>
          <p>เกิดข้อผิดพลาด ไม่สามารถดึงข้อมูลได้</p>
        </div>
      </main>
    );
  }
}