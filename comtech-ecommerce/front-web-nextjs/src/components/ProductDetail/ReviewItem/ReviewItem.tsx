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
        <footer>
          <strong>{review?.createdBy?.customerDetail?.firstName} {review?.createdBy?.customerDetail?.lastName}</strong>
          <small>{review?.createdAt}</small>
          <StarRating rating={review?.rating} />
        </footer>
      </div>
    </div>
  )
}
