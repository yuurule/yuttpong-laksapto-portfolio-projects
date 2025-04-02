import { useMemo } from 'react';
import styles from './MainMenu.module.scss';
import { useLocation  } from 'react-router';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartPie, faChartLine, faBoxes, faShop, faTags, faUsers, 
  faShoppingBag, faList, faGift, faChevronLeft, faChevronRight 
} from '@fortawesome/free-solid-svg-icons';

export default function MainMenu({ menuCollapse, handleCollapseMenu }) {

  const { pathname } = useLocation();
  const pageParent = pathname.split('/')[1];

  const linkMemo = useMemo(() => [
    { url: '/dashboard', title: 'Dashboard', icon: faChartLine, checkActive: 'dashboard' },
    { url: '/product', title: 'Products', icon: faBoxes, checkActive: 'product' },
    { url: '/stock', title: 'In Stock', icon: faShop, checkActive: 'stock' },
    { url: '/order', title: 'Orders', icon: faShoppingBag, checkActive: 'order' },
    { url: '/campaign', title: 'Campaigns', icon: faGift, checkActive: 'campaign' },
    { url: '/category', title: 'Categories', icon: faList, checkActive: 'category' },
    { url: '/tag', title: 'Tags', icon: faTags, checkActive: 'tag' },
    { url: '/customer', title: 'Customers', icon: faUsers, checkActive: 'customer' },
  ], []);

  return (
    <div className={`${styles.mainMenu} ${menuCollapse ? styles.collapse : ''}`}>
      <ul className='list-unstyled'>
        <li className={`${styles.menuBtn}`}>
          <button 
            className='btn btn-link'
            onClick={() => handleCollapseMenu()}>
            {
              menuCollapse 
              ? <FontAwesomeIcon icon={faChevronRight} />
              : <FontAwesomeIcon icon={faChevronLeft} />
            }
            <span className={`${styles.menuText}`}>Menu</span>
          </button>
        </li>
        {
          linkMemo.map((link, index) => {
            return (
              <li key={`link_item_${index + 1}`}>
                <Link 
                  to={link.url}
                  title={menuCollapse ? link.title : ''}
                  alt={link.title}
                  className={`${pageParent === link.checkActive ? styles.active : ''}`}>
                  <FontAwesomeIcon icon={link.icon} />
                  <span className={`${styles.menuText}`}>{link.title}</span>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}