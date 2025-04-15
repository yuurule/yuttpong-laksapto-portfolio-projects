import styles from './ReviewItem.module.scss';
import StarRating from "@/components/ProductBox/StarRating/StarRating";

export default function ReviewItem({
  review
} : {
  review: any
}) {

  return (
    <div className={`${styles.reviewItem}`}>
      <figure>
        <img src="/images/dummy-product.jpg" />
      </figure>
      <div className={`${styles.content}`}>
        <p>"{review.message}"</p>
        <footer className='d-flex align-items-center'>
          <strong>{review.createdBy.displayName}</strong>
          <small>{review.createdAt}</small>
          <StarRating rating={review?.rating} />
        </footer>
      </div>
    </div>
  )
}
