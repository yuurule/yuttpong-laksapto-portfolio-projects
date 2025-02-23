import styles from './ProductImageThumbnail.module.scss';

export default function ProductImageThumbnail() {


  return (
    <div className={`${styles.productImageThumbnail}`}>
      <img src="/demo-product.png" />
    </div>
  )
}