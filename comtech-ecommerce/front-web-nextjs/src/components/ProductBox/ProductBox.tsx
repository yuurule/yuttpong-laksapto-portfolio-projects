import styles from './ProductBox.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ProductCategory from '../ProductCategory/ProductCategory';

export default function ProductBox({
  previewStyle: string = "Vertical"
}) {


  return (
    <div className={`${styles.productBox}`}>
      <Link href="/">
        <img src="/demo-product.png" />
      </Link>
      <ProductCategory />
      <header className={`${styles.title}`}>
        <h4><Link href="/">MSI Sephyrous Pro 17.3" Gaming Notebook</Link></h4>
        <div className={`${styles.rating}`}>
          <FontAwesomeIcon icon={faStar} className='me-2' />
          <FontAwesomeIcon icon={faStar} className='me-2' />
          <FontAwesomeIcon icon={faStar} className='me-2' />
          <FontAwesomeIcon icon={faStar} className='me-2' />
          <FontAwesomeIcon icon={faStar} className='me-2' />
        </div>
        <footer className={`${styles.price}`}>
          <p>$1,527.99</p><small><s>$1,600</s></small>
        </footer>
      </header>
    </div>
  )
}