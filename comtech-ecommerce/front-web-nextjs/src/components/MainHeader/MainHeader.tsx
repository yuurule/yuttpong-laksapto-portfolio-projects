"use client";
import { useEffect } from 'react';
import styles from './MainHeader.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoltLightning, faSearch, faHeadphones, faUser, faShoppingCart, faBars, faLanguage } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { Dropdown } from 'react-bootstrap';

export default function MainHeader() {

  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <div className={`${styles.mainHeader}`}>

      <div className={`${styles.utilsMenu}`}>
        <div className={`container ${styles.container}`}>
          <div className='d-flex'>
            <Dropdown className={`${styles.dropdownLanguage}`}>
              <Dropdown.Toggle className={`btn-link ${styles.btn}`} id="dropdown-language">
                <FontAwesomeIcon icon={faLanguage} /> English
              </Dropdown.Toggle>

              <Dropdown.Menu className={`${styles.menu}`}>
                <Dropdown.Item href="#/action-1">English</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Thai</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Japan</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <p className='mb-0'>Free Shipping Every Order Over $100</p>
          </div>
          <div className={`${styles.mainUtilMenu}`}>
            <ul className='list-inline mb-0'>
              <li className='list-inline-item'>
                <Link href="/flash-sales" className={styles.textYellow}>
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
      </div>

      <div className={`${styles.mainHeaderContent}`}>
        <div className={`container ${styles.container}`}>
          <div>
            <Link href="/" className={`${styles.logo}`}>COMTECH</Link>
          </div>
          <div className={`${styles.searchBox}`}>
            <div className={`${styles.inputSelect}`}>
              <select className={`form-select ${styles.formSelect}`} aria-label="Default select example">
                <option value="0">All Category</option>
                <option value="1">Notebook</option>
                <option value="2">Desktop</option>
                <option value="3">Mobile phone</option>
              </select>
            </div>
            <div className={`input-group ${styles.inputGroup}`}>
              <input type="text" className="form-control" placeholder="Search product" aria-label="Search product" aria-describedby="main-header-search-button" />
              <button className="btn px-3" type="button" id="main-header-search-button"><FontAwesomeIcon icon={faSearch} /></button>
            </div>
          </div>
          <div className={`${styles.otherMenu}`}>
            <div className={`${styles.infoWithIcon}`}>
              <FontAwesomeIcon icon={faHeadphones} />
              <div>
                <strong className={`${styles.title}`}>Need Help?</strong>
                <span>+06 95 798 3628</span>
              </div>
            </div>
            <div className={`${styles.infoWithIcon}`}>
              <Link href="/my-account">
                <FontAwesomeIcon icon={faUser} />
                <div>
                  <strong className={`${styles.title}`}>My Account</strong>
                  <span>yuurule</span>
                </div>
              </Link>
            </div>
            <div className={`${styles.infoWithIcon}`}>
              <Link href="/cart" className='position-relative'>
                <span className={`${styles.digitSign}`}>0</span>
                <FontAwesomeIcon icon={faShoppingCart} />
                <div>
                  <strong className={`${styles.title}`}>My Cart</strong>
                  <strong className='h6'>$11,095</strong>
                </div>
                </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.mainMenuRow}`}>
        <div className={`container ${styles.container}`}>
          <div className='d-flex'>
            <Dropdown className={`${styles.dropdownBrands}`}>
              <Dropdown.Toggle className={`btn-link p-0 ${styles.btn}`} id="dropdown-brands">
                <FontAwesomeIcon icon={faBars} className='me-3' />Shop Brands
              </Dropdown.Toggle>

              <Dropdown.Menu className={`${styles.menu}`}>
                <Dropdown.Item href="#/action-1">Asus</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Dell</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Msi</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <nav className={`${styles.mainMenu}`}>
              <ul className="list-inline mb-0">
                <li className="list-inline-item"><Link href="/products">home</Link></li>
                <li className="list-inline-item"><Link href="/products">working</Link></li>
                <li className="list-inline-item"><Link href="/products">gaming</Link></li>
                <li className="list-inline-item"><Link href="/products">light & slim</Link></li>
                <li className="list-inline-item"><Link href="/products">top sell</Link></li>
                <li className="list-inline-item"><Link href="/products">sales off</Link></li>
              </ul>
            </nav>
          </div>
          <div className={`${styles.wishList}`}>
            <Link href="/" className={`${styles.wishListBtn} btn btn-link p-0`}>
              <FontAwesomeIcon icon={faHeartRegular} />
              <span className={`${styles.digitSign}`}>0</span>
            </Link>
            <Link href="/" className={`${styles.todayDeals}`}>Today's Deal!</Link>
          </div>
        </div>
      </div>
    </div>
  )
}