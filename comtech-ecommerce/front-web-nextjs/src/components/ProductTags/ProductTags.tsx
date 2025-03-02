import Link from 'next/link';
import styles from './ProductTags.module.scss';

export default function ProductTags() {


  return (
    <div className={`${styles.productTags}`}>
      <strong className="me-2">Tags: </strong>
      <ul className="list-inline">
        <li className="list-inline-item"><Link href="/">Notebook</Link></li>
        <li className="list-inline-item"><Link href="/">Gaming</Link></li>
        <li className="list-inline-item"><Link href="/">MSI</Link></li>
        <li className="list-inline-item"><Link href="/">Large screen</Link></li>
      </ul>
    </div>
  )
}