import Link from 'next/link';
import styles from './ProductCategory.module.scss';

export default function ProductCategory() {



  return (
    <div className={`${styles.productCategory}`}>
      <Link href="/">MSI</Link>
      <span>|</span>
      <Link href="/">Gaming</Link>
    </div>
  )
}