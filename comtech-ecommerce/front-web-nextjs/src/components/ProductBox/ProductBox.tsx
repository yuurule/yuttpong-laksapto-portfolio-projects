import styles from './ProductBox.module.scss';
import Link from 'next/link';
import ProductCategory from '../ProductCategory/ProductCategory';
import StarRating from './StarRating/StarRating';

export default function ProductBox({ previewStyle = "vertical" } : { previewStyle?: string }) {


  return (
    <div className={`${styles.productBox} ${previewStyle === "horizontal" ? styles.horizontal : ''}`}>
      <Link href="/products/1">
        <img src="/images/dummy-product.jpg" className='img-fluid' />
      </Link>
      <div className={`${styles.content}`}>
        <ProductCategory />
        <header className={`${styles.title}`}>
          <strong className={`${styles.productName}`}>
            <Link href="/products/1">MSI Sephyrous Pro 17.3" Gaming Notebook</Link>
          </strong>
          <StarRating rating={3.5} />
          <footer className={`${styles.price}`}>
            <p>$1,527.99</p><small><s>$1,600</s></small>
          </footer>
        </header>
      </div>
    </div>
  )
}