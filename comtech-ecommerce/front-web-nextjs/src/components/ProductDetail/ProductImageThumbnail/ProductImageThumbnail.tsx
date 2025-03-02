import styles from './ProductImageThumbnail.module.scss';

export default function ProductImageThumbnail() {


  return (
    <div className={`${styles.productImageThumbnail}`}>
      <img src="/images/dummy-product.jpg" className='img-fluid' />
    </div>
  )
}