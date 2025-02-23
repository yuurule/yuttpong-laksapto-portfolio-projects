import styles from './DealOfTheDay.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ProductCategory from '@/components/ProductCategory/ProductCategory';

export default function DealOfTheDay() {


  return (
    <div className={`${styles.dealOfTheDay}`}>
      <img src="/images/dummy-product.png" />
      <div className='d-flex'>
        <span>-5%</span>
        <span>HOT</span>
      </div>
      <ProductCategory />
      <header>
        <strong className='h5 d-block'>MSI Sephyrous Pro 17.3" With 4K Gaming Notebook Ram 64GB | SSD GB Limited Edition</strong>
      </header>
      <div className={`d-flex ${styles.rating}`}>
        <FontAwesomeIcon icon={faStar} className='me-2' />
        <FontAwesomeIcon icon={faStar} className='me-2' />
        <FontAwesomeIcon icon={faStar} className='me-2' />
        <FontAwesomeIcon icon={faStar} className='me-2' />
        <FontAwesomeIcon icon={faStar} className='me-2' />
      </div>
      <div className={`d-flex ${styles.price}`}>
        <p>$1,527.99</p><small><s>$1,600</s></small>
      </div>
      <div className=''>
        Sold : 39/89
        <div className="progress">
          <div className="progress-bar" style={{width: '25%'}}></div>
        </div>
      </div>
      <div className='d-flex justify-content-center text-center'>
        <div><strong className='h4 d-block mx-2'>5</strong><span>Days</span></div>
        <div><strong className='h4 d-block mx-2'>02</strong><span>Hours</span></div>
        <div><strong className='h4 d-block mx-2'>33</strong><span>Mins</span></div>
        <div><strong className='h4 d-block mx-2'>59</strong><span>Secs</span></div>
      </div>
    </div>
  )
}