"use client";

import { useState, useEffect } from 'react';
import styles from './MainHeader.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import { productService } from '@/services';

export default function BrandsDropdown() {

  const [show, setShow] = useState(false);
  const [brandList, setBrandList] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brands = await productService.getBrands();
        setBrandList(brands.RESULT_DATA.map((i: any) => ({ id: i.id, name: i.name })));
      }
      catch(error) {
        console.log(error);
      }
    }

    fetchBrands();
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
    {
      brandList.length > 0
      ?
      <Dropdown 
        show={show} 
        onToggle={(isOpen) => setShow(isOpen)} 
        className={`${styles.dropdownBrands}`}
      >
        <Dropdown.Toggle 
          className={`btn-link p-0 ${styles.btn}`} 
          style={{backgroundColor: '#FFF'}}
          id="dropdown-brands"
        >
          <FontAwesomeIcon icon={faBars} className='me-3' />Shop Brands
        </Dropdown.Toggle>

        <Dropdown.Menu className={`${styles.menu}`}>
          {
            brandList.map((brand: any) => (
              <div onClick={handleClose} key={`brand_item_${brand.id}`}>
                <Link 
                  href={`/products?brands=${brand.id}`}
                  className='dropdown-item'
                  onClick={() => {}}
                >
                  {brand.name}
                </Link>
              </div>
            ))
          }
        </Dropdown.Menu>
      </Dropdown>
      : null
    }
    </>
  )
}