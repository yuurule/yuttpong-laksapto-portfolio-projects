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

export default function ProductDetailPage() {


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
                <ProductCategory />
                <h2 className={`${styles.productName}`}>MSI Sephyrous Pro 17.3" With 4K Gaming Notebook SX078U Limited Edition</h2>
                <div className="d-flex">
                  <StarRating rating={4} />
                  <small className="d-inline-block ms-3">(4.4) 15 Reviews</small>
                  <div>
                    <span className={`${styles.inStock}`}>in stock</span>
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
                    <strong className={`${styles.title}`}>Specification</strong>
                    <ul>
                      <li>Ram: 16GB</li>
                      <li>Harddrive: 512GB SSD</li>
                      <li>Screen: 17.3 inches</li>
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
              <div className={`${styles.addToCart}`}>
                <div>
                  <div className={`input-group ${styles.inputGroup}`}>
                    <button className="btn btn-outline-secondary" type="button" id="button-addon1">-</button>
                    <input type="text" className="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2">+</button>
                  </div>
                </div>
                <div>
                  <button className="btn design-btn gradient-btn px-4" title="Add to my cart">
                    <FontAwesomeIcon icon={faShoppingCart} className="me-2" />Add to cart
                  </button>
                  <button className="btn design-btn gradient-outline-btn ms-2" title="Add to my wishlist">
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                </div>
              </div>
              <div className={`${styles.estimated}`}>
                <ul>
                  <li>Estimated delivery time 14-30 days</li>
                  <li>18 months warranty at Genuine Warranty Center</li>
                </ul>
              </div>
              <ProductTags />
            </div>
          </div>
          <div className="col-sm-12">
            <DetailsAndReviews />
          </div>
          <div className="col-sm-12">
            <RelatedProduct />
          </div>
        </div>
      </div>
    </main>
  )
}