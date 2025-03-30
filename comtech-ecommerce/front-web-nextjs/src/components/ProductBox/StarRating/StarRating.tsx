import styles from './StarRating.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular, faStarHalfStroke } from '@fortawesome/free-regular-svg-icons';

export default function StarRating({ rating = 0 } :{ rating : number }) {


  return (
    <div className={`${styles.rating}`}>
      <FontAwesomeIcon icon={faStar} className='me-1' />
      <small>{rating}</small>
    </div>
  )
}