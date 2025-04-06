import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import styles from './MainHeader.module.scss';
import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';

export default function MyCart() {


  return (
    <div className={`${styles.infoWithIcon}`}>
      <Link href="/cart" className='position-relative'>
        <span className={`${styles.digitSign}`}>0</span>
        <FontAwesomeIcon icon={faShoppingCart} />
        <div>
          <strong className={`${styles.title}`}>My Cart</strong>
          <strong className='h6'>฿0.00</strong>
        </div>
        </Link>
    </div>
  )
}