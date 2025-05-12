'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSignOutAlt, faUser} from '@fortawesome/free-solid-svg-icons';
import styles from './MainHeader.module.scss';
import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import SignInDialog from '@/components/SignIn/SignInDialog';

export default function MyAccountOrSignin() {

  const { status, data: session } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const [show, setShow] = useState(false);
  
  const handleToggleSignIn = () => setShowSignIn(prevState => !prevState)
  const handleClose = () => setShow(false)

  return (
    <>
    <div className={`infoWithIcon`}>
      {
        status !== 'loading' 
        ?
          !session?.user
          ?
          <button 
            type="button"
            className='btn design-btn px-4'
            onClick={handleToggleSignIn}
          >Sign in</button>
          :
          <>
          <Dropdown
            show={show} 
            onToggle={(isOpen) => setShow(isOpen)}
          >
            <Dropdown.Toggle 
              id="dropdown-my-account"
              className={`px-0 position-relative d-flex align-items-center`}
              style={{backgroundColor: '#FFF', border: 'none', color: '#2a2a2a'}}
            >
              <FontAwesomeIcon icon={faUser} style={{marginRight: '5px'}} />
              {/* <div>
                <strong className={`${styles.title}`}>My Account</strong>
                <span>{session?.user.id}</span>
              </div> */}
            </Dropdown.Toggle>

            <Dropdown.Menu className='my-dropdown px-2 pt-2' style={{width: '180px'}}>
              <Link onClick={handleClose} href="/my-account" className='dropdown-item mb-1'>My account</Link>
              <Link onClick={handleClose} href="/my-account/wishlists" className='dropdown-item mb-1'>Wishlist</Link>
              <Link onClick={handleClose} href="/my-account/orders" className='dropdown-item mb-1'>Orders</Link>
              <Link onClick={handleClose} href="/my-account/reviews" className='dropdown-item'>Reviews</Link>
              <hr />
              <button 
                type="button"
                className='dropdown-item mb-3'
                style={{color: 'red'}}
                onClick={() => {
                  signOut({
                    callbackUrl: '/'
                  })
              }}><FontAwesomeIcon icon={faSignOutAlt} style={{fontSize: '15px', color: 'red'}} />Sign out</button>
            </Dropdown.Menu>
          </Dropdown>
          </>
        : null
      }
    </div>

    <SignInDialog 
      show={showSignIn}
      handleClose={handleToggleSignIn}
    />
    </>
  )
}