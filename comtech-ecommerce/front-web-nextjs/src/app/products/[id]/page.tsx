import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import ProductImageThumbnail from "@/components/ProductDetail/ProductImageThumbnail/ProductImageThumbnail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import DetailsAndReviews from "@/components/ProductDetail/DetailsAndReviews/DetailsAndReviews";
import RelatedProduct from "@/components/ProductDetail/TopSelling/RelatedProduct";
import ProductCategory from "@/components/ProductCategory/ProductCategory";

export default function ProductDetailPage() {


  return (
    <main className="">
      <Breadcrumbs />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="Product Detail" />
          </header>
          <div className="col-sm-6">
            <ProductImageThumbnail />
          </div>
          <div className="col-sm-6">
            <header>
              <ProductCategory />
              <h2>MSI Sephyrous Pro 17.3" With 4K Gaming Notebook SX078U Limited Edition</h2>
              <div className="d-flex">
                <div className="d-flex">
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <small>(4.4) 15 Reviews</small>
                <div>in stock</div>
              </div>
            </header>
            <div>
              <p className="h3 d-inline-block">$1,528.99</p>
              <p className="d-inline-block"><s>$1,729.99</s> (-7%)</p>
            </div>
            <div>
              <strong className="h5 d-block">Specification</strong>
              <ul>
                <li>Ram: 16GB</li>
                <li>Harddrive: 512GB SSD</li>
                <li>Screen: 17.3 inches</li>
              </ul>
              <strong className="h6 d-block">What in box</strong>
              <ul>
                <li>Charge cable and block</li>
                <li>Micro fiber fabric</li>
                <li>Power adapter</li>
              </ul>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="input-group">
                  <button className="btn btn-outline-secondary" type="button" id="button-addon1">-</button>
                  <input type="text" className="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                  <button className="btn btn-outline-secondary" type="button" id="button-addon2">+</button>
                </div>
              </div>
              <div>
                <button className="btn btn-primary">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  Add to cart
                </button>
                <button className="btn btn-secondary ms-1">
                  <FontAwesomeIcon icon={faHeart} />
                </button>
              </div>
            </div>
            <div>
              <ul>
                <li>Estimated delivery time 14-30 days</li>
                <li>18 months warranty at Genuine Warranty Center</li>
              </ul>
            </div>
            <div className="d-flex">
              <strong className="me-2">Tags: </strong>
              <ul className="list-inline">
                <li className="list-inline-item"><Link href="/">Notebook</Link></li>
                <li className="list-inline-item"><Link href="/">Gaming</Link></li>
                <li className="list-inline-item"><Link href="/">MSI</Link></li>
                <li className="list-inline-item"><Link href="/">Large screen</Link></li>
              </ul>
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