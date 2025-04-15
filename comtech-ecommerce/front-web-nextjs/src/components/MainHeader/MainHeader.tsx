"use client";

import React, { useState, useEffect } from 'react';
import styles from './MainHeader.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoltLightning, faHeadphones, faLanguage } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import SearchProduct from './SearchProduct';
import MyAccountOrSignin from './MyAccountOrSignin';
import MyCart from './MyCart/MyCart';
import BrandsDropdown from './BrandsDropdown';
import WishlistAmount from './WishlistAmount';
import { productService } from '@/services';

export default function MainHeader() {

  const [loadData, setLoadData] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');

    const fetchCategory = async () => {
      setLoadData(true);
      try {
        const categories = await productService.getCategories();
        setCategoryList(categories.RESULT_DATA);
      } 
      catch(error) {
        console.error(`Get category is failed due to reason: ${error}`);
      }
      finally { setLoadData(false); }
    }

    fetchCategory();
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
                <Dropdown.Item>English</Dropdown.Item>
                <Dropdown.Item>Thai</Dropdown.Item>
                <Dropdown.Item>Japan</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <p className='mb-0'>Free Shipping Every Order Over $100</p>
          </div>
          <div className={`${styles.mainUtilMenu}`}>
            <ul className='list-inline mb-0'>
              <li className='list-inline-item'>
                <Link href="/products?brands=all&onSale=true" className={styles.textYellow}>
                  <FontAwesomeIcon icon={faBoltLightning} className='me-2' />Flash Sale
                </Link>
              </li>
              <li className='list-inline-item'><Link href="">About</Link></li>
              <li className='list-inline-item'><Link href="">Contact</Link></li>
              <li className='list-inline-item'><Link href="">Blog</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={`${styles.mainHeaderContent}`}>
        <div className={`container ${styles.container}`}>
          <div>
            <Link href="/" className={`${styles.logo}`}>COMTECH</Link>
          </div>
          <SearchProduct />
          <div className={`${styles.otherMenu}`}>
            <div className={`${styles.infoWithIcon}`}>
              <FontAwesomeIcon icon={faHeadphones} />
              <div>
                <strong className={`${styles.title}`}>Need Help?</strong>
                <span>+06 95 798 3628</span>
              </div>
            </div>
            <MyCart />
            <MyAccountOrSignin />
          </div>
        </div>
      </div>

      <div className={`${styles.mainMenuRow}`}>
        <div className={`container ${styles.container}`}>
          <div className='d-flex'>
            <BrandsDropdown />
            <nav className={`${styles.mainMenu}`}>
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <Link href="/">home</Link>
                </li>
                {
                  !loadData && categoryList.map((i: any) => {
                    return (
                      <li key={`category_${i.id}`} className="list-inline-item">
                        <Link href={`/products?brands=all&categories=${i.id}`}>{i.name}</Link>
                      </li>
                    )
                  })
                }
                <li className="list-inline-item">
                  <Link href="/products?brands=all&categories=all&onSale=true">sales off</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className={`${styles.wishList}`}>
            <WishlistAmount />
            <Link href="/products?brands=all&todayDeal=true" className={`${styles.todayDeals}`}><strong>Today's Deal!</strong></Link>
          </div>
        </div>
      </div>
    </div>
  )
}