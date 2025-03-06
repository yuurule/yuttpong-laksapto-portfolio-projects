import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function PaginationArrow() {


  return (
    <div className='w-100 d-flex justify-content-between align-items-center mt-3'>
      <button className='btn btn-link p-0'>
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <strong>1 of 10</strong>
      <button className='btn btn-link p-0'>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  )
}