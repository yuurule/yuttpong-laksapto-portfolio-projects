import styles from './Pagination.module.scss';
import Link from 'next/link';

export default function Pagination() {



  return (
    <div className='d-flex justify-content-between align-items-center'>
      <strong>Page 1/10</strong>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item"><Link href="/" className="page-link">Previous</Link></li>
          <li className="page-item"><Link href="/" className="page-link">1</Link></li>
          <li className="page-item"><Link href="/" className="page-link">2</Link></li>
          <li className="page-item"><Link href="/" className="page-link">3</Link></li>
          <li className="page-item"><Link href="/" className="page-link">Next</Link></li>
        </ul>
      </nav>
    </div>
  )
}