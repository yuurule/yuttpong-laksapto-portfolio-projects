import styles from './Breadcrumbs.module.scss';
import Link from 'next/link';

export default function Breadcrumbs() {



  return (
    <div className={`${styles.breadcrumbs}`}>
      <div className={`container ${styles.container}`}>
        <Link href="/">Home</Link>
        <span className={`${styles.divider}`}>/</span>
        <Link href="/cart">Cart</Link>
        <span className={`${styles.divider}`}>/</span>
        <span>Checkout</span>
      </div>
    </div>
  )
}