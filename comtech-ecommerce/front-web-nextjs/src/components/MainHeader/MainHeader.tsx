import styles from './MainHeader.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoltLightning, faSearch, faHeadphones, faUser, faShoppingCart, faBars, faHeart } from '@fortawesome/free-solid-svg-icons';

export default function MainHeader() {


  return (
    <div className={`${styles.mainHeader}`}>
      <div className={`${styles.utilsMenu} ${styles.contentPaddingX}`}>
        <div className='d-flex'>
          <a href="#">English</a>
          <p className='mb-0'>Free shipping every order over $100</p>
        </div>
        <div>
          <ul className='list-inline mb-0'>
            <li className='list-inline-item'>
              <Link href="/flash-sales">
                <FontAwesomeIcon icon={faBoltLightning} className='me-2' />Flash Sale
              </Link>
            </li>
            <li className='list-inline-item'><Link href="/track-order">Tracking Order</Link></li>
            <li className='list-inline-item'><Link href="/track-order">About</Link></li>
            <li className='list-inline-item'><Link href="/track-order">Contact</Link></li>
            <li className='list-inline-item'><Link href="/track-order">Blog</Link></li>
          </ul>
        </div>
      </div>
      <div className={`${styles.mainHeaderContent} ${styles.contentPaddingX}`}>
        <div>
          <strong>COMTECH</strong>
        </div>
        <div>
          <div className={`${styles.searchBox}`}>
            <select className={`form-select`} aria-label="Default select example">
              <option value="0">All Category</option>
              <option value="1">Notebook</option>
              <option value="2">Desktop</option>
              <option value="3">Mobile phone</option>
            </select>
            <div className={`input-group`}>
              <input type="text" className="form-control" placeholder="Search product" aria-label="Search product" aria-describedby="main-header-search-button" />
              <button className="btn btn-outline-secondary" type="button" id="main-header-search-button"><FontAwesomeIcon icon={faSearch} /></button>
            </div>
          </div>
        </div>
        <div>
          <div className={`${styles.infoWithIcon}`}>
            <FontAwesomeIcon icon={faHeadphones} />
            <div>
              <strong>Need Help?</strong>
              <span>+06 95 798 3628</span>
            </div>
          </div>
          <div className={`${styles.infoWithIcon}`}>
            <Link href="/">
              <FontAwesomeIcon icon={faUser} />
              <div>
                <strong>My Account</strong>
                <span>yuurule</span>
              </div>
            </Link>
          </div>
          <div className={`${styles.infoWithIcon}`}>
            <Link href="/">
              <span className={`${styles.digitSign}`}>0</span>
              <FontAwesomeIcon icon={faShoppingCart} />
              <div>
                <strong>My Cart</strong>
                <span>$11,095</span>
              </div>
              </Link>
          </div>
        </div>
      </div>
      <div className={`${styles.mainMenuRow} ${styles.contentPaddingX}`}>
        <div>
          <div className="dropdown">
            <button type="button" className="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <FontAwesomeIcon icon={faBars} className='me-3' />Shop Brands
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#">ASUS</a></li>
              <li><a className="dropdown-item" href="#">Lenovo</a></li>
              <li><a className="dropdown-item" href="#">Dell</a></li>
              <li><a className="dropdown-item" href="#">MSI</a></li>
            </ul>
          </div>
          <nav className={`${styles.mainMenu}`}>
            <ul className="list-inline">
              <li className="list-inline-item"><Link href="/">home</Link></li>
              <li className="list-inline-item"><Link href="/">working</Link></li>
              <li className="list-inline-item"><Link href="/">gaming</Link></li>
              <li className="list-inline-item"><Link href="/">light & slim</Link></li>
              <li className="list-inline-item"><Link href="/">top sell</Link></li>
              <li className="list-inline-item"><Link href="/">sales off</Link></li>
            </ul>
          </nav>
        </div>
        <div>
          <Link href="/" className={`btn-with-digit-sign btn btn-link p-0`}>
            <FontAwesomeIcon icon={faHeart} />
            <span className='digit-sign'>0</span>
          </Link>
          <Link href="/">Today's Deal!</Link>
        </div>
      </div>
    </div>
  )
}