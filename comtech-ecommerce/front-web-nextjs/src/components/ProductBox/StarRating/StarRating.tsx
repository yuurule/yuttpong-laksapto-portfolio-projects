import styles from './StarRating.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular, faStarHalfStroke } from '@fortawesome/free-regular-svg-icons';

export default function StarRating({ rating : number = 0 }) {


  return (
    <div className={`${styles.rating}`}>
      {
        [...Array(5)].map((i, index) => (
          <FontAwesomeIcon key={`product_rating_star_${index + 1}`} icon={faStar} />
        ))
      }
      
    </div>
  )
}