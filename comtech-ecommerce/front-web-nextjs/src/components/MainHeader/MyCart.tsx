"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import styles from './MainHeader.module.scss';
import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import SignInDialog from '@/components/SignIn/SignInDialog';

export default function MyCart() {

  const { status, data: session } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);

  const handleToggleSignIn = () => setShowSignIn(prevState => !prevState);

  const renderCartMenu = () => {
    return (
      <>
      <span className={`${styles.digitSign}`}>0</span>
      <FontAwesomeIcon icon={faShoppingCart} />
      <div>
        <strong className={`${styles.title}`}>My Cart</strong>
        <strong className='h6'>฿0.00</strong>
      </div>
      </>
    )
  }

  return (
    <>
    <div className={`${styles.infoWithIcon} dropdown-no-icon`}>
      {
        status !== 'loading' &&
          !session?.user
          ?
          <button
            className='btn btn-link p-0 position-relative d-flex align-items-center'
            style={{textDecoration: 'none', color: '#2a2a2a'}}
            onClick={handleToggleSignIn}
          >
            { renderCartMenu() }
          </button>
          :
          <Dropdown>
            <Dropdown.Toggle 
              className={`px-0 position-relative d-flex align-items-center`} 
              style={{backgroundColor: '#FFF', border: 'none', color: '#2a2a2a'}}
              id="dropdown-cart"
            >
              { renderCartMenu() }
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <p className='dropdown-item'>Hello world</p>
              <p className='dropdown-item'>Hello world</p>
              <p className='dropdown-item'>Hello world</p>
              <Link href="/cart" className='btn design-btn w-100'>View in cart</Link>
            </Dropdown.Menu>
          </Dropdown>
      }
    </div>

    <SignInDialog 
      show={showSignIn}
      handleClose={handleToggleSignIn}
    />
    </>
  )
}