import styles from './MainMenu.module.scss';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faChartLine, faBox, faBoxes, faTags, faUsers, faShoppingBag, faList, faGift } from '@fortawesome/free-solid-svg-icons';

export default function MainMenu() {



  return (
    <div className={`${styles.mainMenu}`}>
      <div className='py-4'>
        <p className='h4 text-center mb-0'>COMTECH</p>
        <p className='h6 text-center mb-0'>WEBADMIN SYSTEM</p>
      </div>
      <hr />
      <ul className='list-unstyled'>
        <li><Link to="/dashboard"><FontAwesomeIcon icon={faChartLine} className='me-2' />Dashboard</Link></li>
        <li><Link to="/report"><FontAwesomeIcon icon={faChartPie} className='me-2' />Report</Link></li>
        <li><Link to="/product"><FontAwesomeIcon icon={faBox} className='me-2' />Product</Link></li>
        <li><Link to="/stock"><FontAwesomeIcon icon={faBoxes} className='me-2' />Stock</Link></li>
        <li><Link to="/order"><FontAwesomeIcon icon={faShoppingBag} className='me-2' />Order</Link></li>
        <li><Link to="/campaign" onClick={(e) => { e.preventDefault(); alert("Comming soon..."); }}><FontAwesomeIcon icon={faGift} className='me-2' />Campaign</Link></li>
        <li><Link to="/category"><FontAwesomeIcon icon={faList} className='me-2' />Category</Link></li>
        <li><Link to="/tag"><FontAwesomeIcon icon={faTags} className='me-2' />Tag</Link></li>
        <li><Link to="/customer"><FontAwesomeIcon icon={faUsers} className='me-2' />Customer</Link></li> 
        {/* <li><Link to="/user"><FontAwesomeIcon icon={faUsers} className='me-2' />Users</Link></li> */}
      </ul>
    </div>
  )
}