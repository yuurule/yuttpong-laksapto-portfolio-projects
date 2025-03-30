import styles from './DealOfTheDay.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ProductCategory from '@/components/ProductCategory/ProductCategory';
import StarRating from '@/components/ProductBox/StarRating/StarRating';
import { productService } from '@/services';

export default async function DealOfTheDay() {
  try {
    const brands = await productService.getBrands();
    const products = await productService.getProducts({
      page: 1,
      pageSize: 1,
      brands: brands.RESULT_DATA.map((i:any) => (i.id))
    });

    return (
      <div className={`${styles.dealOfTheDay}`}>
        <figure className='text-center'>
          <img src="/images/dummy-product.jpg" className='img-fluid' />
        </figure>
        <div className={`${styles.content}`}>
          <div className='d-flex'>
            <span>-5%</span>
            <span>HOT</span>
          </div>
          <ProductCategory categories={products.RESULT_DATA[0].categories} />
          <header className={`${styles.title}`}>
            <strong className={`${styles.productName}`}>{products.RESULT_DATA[0].name}</strong>
          </header>
          {/* <StarRating rating={4} /> */}
          <div className={`${styles.price} mb-2`}>
            <p>$1,527.99</p><small><s>$1,600</s></small>
          </div>
          <div className={`${styles.soldAmount}`}>
            <small>Sold : 39/89</small>
            <div className="progress mt-1">
              <div className="progress-bar" style={{width: '25%'}}></div>
            </div>
          </div>
          <div className={`${styles.timeCountDown}`}>
            <div className={`${styles.timeBox}`}><strong className={`${styles.timeDigit}`}>5</strong><span>Days</span></div>
            <div className={`${styles.timeBox}`}><strong className={`${styles.timeDigit}`}>02</strong><span>Hours</span></div>
            <div className={`${styles.timeBox}`}><strong className={`${styles.timeDigit}`}>33</strong><span>Mins</span></div>
            <div className={`${styles.timeBox}`}><strong className={`${styles.timeDigit}`}>59</strong><span>Secs</span></div>
          </div>
        </div>
      </div>
    )
  } catch(error) {
    console.error('Failed to fetch product:', error);
    return <div>ไม่สามารถดึงข้อมูลสินค้าได้</div>;
  }
}