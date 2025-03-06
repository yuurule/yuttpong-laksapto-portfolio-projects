import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router';

export default function Breadcrumbs() {


  return (
    <div className='d-flex'>
      <Link to="/" className='me-2'>Home</Link>
      <span className='me-2'><FontAwesomeIcon icon={faChevronRight} /></span>
      <span>Campaign</span>
    </div>
  )
}