import { useMemo } from 'react';
import { useLocation  } from 'react-router';
import styles from './TopBarMenu.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { logout } from '../../redux/actions/authAction';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faEnvelope, faChartPie, faChartLine, faBoxes, faShop, faTags, faUsers, 
  faShoppingBag, faList, faGift, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function TopBarMenu() {

  const { refreshToken } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pageParent = pathname.split('/')[1];

  const linkMemo = useMemo(() => [
    { url: '/dashboard', title: 'Dashboard', icon: faChartLine, checkActive: 'dashboard' },
    { url: '/product', title: 'Products', icon: faBoxes, checkActive: 'product' },
    { url: '/stock', title: 'Stock', icon: faShop, checkActive: 'stock' },
    { url: '/order', title: 'Orders', icon: faShoppingBag, checkActive: 'order' },
    { url: '/campaign', title: 'Campaigns', icon: faGift, checkActive: 'campaign' },
    { url: '/category', title: 'Categories', icon: faList, checkActive: 'category' },
    { url: '/tag', title: 'Tags', icon: faTags, checkActive: 'tag' },
    { url: '/customer', title: 'Customers', icon: faUsers, checkActive: 'customer' },
  ], []);

  const handleLogout = async () => {
    try {
      await dispatch(logout(refreshToken));
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <>
    <div className={`${styles.topBarMenu}`}>
      <div className={`${styles.menuPhone}`}>
        <div className="dropdown">
          <button 
            className={`btn ${styles.menuBtn}`} 
            type="button" 
            data-bs-toggle="dropdown"
          >
            <span style={{color: '#000'}}><FontAwesomeIcon icon={faBars} /> Menu</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-lg-end">
            {
              linkMemo.map((link, index) => (
                <li key={`menuPhone_${index + 1}`}>
                  <Link 
                    to={link.url}
                    alt={link.title}
                    className={`${styles.menuPhoneItem} ${pageParent === link.checkActive ? styles.active : ''}`}>
                    <FontAwesomeIcon icon={link.icon} />
                    <span className={`${styles.menuText}`}>{link.title}</span>
                  </Link>
                </li>
              ))
            }
            
          </ul>
        </div>
      </div>
      <div className='d-flex'>
        <button 
          type="button"
          className={`btn hidden-phone ${styles.iconBtn} me-4`}
        >
          <div className={`${styles.digitAlert}`}>20</div>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <button 
          type="button"
          className={`btn hidden-phone ${styles.iconBtn} me-4`}
        >
          <div className={`${styles.digitAlert}`}>20</div>
          <FontAwesomeIcon icon={faBell} />
        </button>
        <div className="dropdown">
          <button 
            className={`${styles.userDropdown} btn`} 
            type="button" 
            data-bs-toggle="dropdown"
          >
            <div className='d-flex'>
              <img src={'/images/dummy-webadmin.jpg'} className={`${styles.userImg}`} />
              <div className={`${styles.userInfo}`}>
                <p className='mb-0'>Luciana Swiss</p>
                <small>webadmin@mail.com</small>
              </div>
            </div>
          </button>
          <ul className="dropdown-menu dropdown-menu-lg-end">
            <li>
              <button 
                className='dropdown-item'
                onClick={handleLogout}
              >Log out</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className='show-phone ms-3'>
      <div className='d-flex'>
        <button 
          type="button"
          className={`btn ${styles.iconBtn} me-4`}
        >
          <div className={`${styles.digitAlert}`}>20</div>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <button 
          type="button"
          className={`btn ${styles.iconBtn} me-4`}
        >
          <div className={`${styles.digitAlert}`}>20</div>
          <FontAwesomeIcon icon={faBell} />
        </button>
      </div>
    </div>
    </>
  )
}