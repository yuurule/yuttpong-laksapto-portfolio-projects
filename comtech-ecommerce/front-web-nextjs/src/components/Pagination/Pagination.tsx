import styles from './Pagination.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faBackward, faCaretRight, faForward } from '@fortawesome/free-solid-svg-icons';

export default function Pagination() {



  return (
    <div className={`${styles.pagination}`}>
      <strong>Page 1/10</strong>
      <nav aria-label="Page navigation example">
        <ul className={`pagination ${styles.customPagination}`}>
          <li className={`page-item ${styles.pageItem}`}>
            <Link href="/" className={`page-link ${styles.pageLink}`}>
              <FontAwesomeIcon icon={faBackward} />
            </Link>
          </li>
          <li className={`page-item ${styles.pageItem}`}>
            <Link href="/" className={`page-link ${styles.pageLink}`}>
              <FontAwesomeIcon icon={faCaretLeft} />
            </Link>
          </li>
          <li className={`page-item active ${styles.pageItem} ${styles.active}`}><Link href="/" className={`page-link ${styles.pageLink}`}>1</Link></li>
          <li className={`page-item ${styles.pageItem}`}><Link href="/" className={`page-link ${styles.pageLink}`}>2</Link></li>
          <li className={`page-item ${styles.pageItem}`}><Link href="/" className={`page-link ${styles.pageLink}`}>3</Link></li>
          <li className={`page-item ${styles.pageItem}`}><Link href="/" className={`page-link ${styles.pageLink}`}>...</Link></li>
          <li className={`page-item ${styles.pageItem}`}>
            <Link href="/" className={`page-link ${styles.pageLink}`}>
              <FontAwesomeIcon icon={faCaretRight} />
            </Link>
          </li>
          <li className={`page-item ${styles.pageItem}`}>
            <Link href="/" className={`page-link ${styles.pageLink}`}>
              <FontAwesomeIcon icon={faForward} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}