import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import styles from './ReviewItem.module.scss';
import StarRating from "@/components/ProductBox/StarRating/StarRating";

export default function ReviewItem() {



  return (
    <div className={`${styles.reviewItem}`}>
      <figure>
        <img src="/images/dummy-product.jpg" />
      </figure>
      <div className={`${styles.content}`}>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis quia pariatur, dignissimos incidunt maiores magni ut ipsam consequatur impedit porro unde nesciunt distinctio vel iure fugiat harum quasi, vero architecto.</p>
        <footer>
          <strong>John Doh</strong>
          <small>Mar 24 2025</small>
          <StarRating rating={3.5} />
        </footer>
      </div>
    </div>
  )
}
