'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './MainHeader.module.scss';
import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import SignInDialog from '@/components/SignIn/SignInDialog';

export default function MyAccountOrSignin() {

  const { status, data: session } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  
  const handleToggleSignIn = () => setShowSignIn(prevState => !prevState);

  return (
    <>
    <div className={`${styles.infoWithIcon}`}>
      {
        status !== 'loading' &&
          !session?.user
          ?
          <button 
            type="button"
            className='btn design-btn px-4'
            onClick={handleToggleSignIn}
          >Sign in</button>
          :
          <Link href="/auth/signin">
            <FontAwesomeIcon icon={faUser} />
            <div>
              <strong className={`${styles.title}`}>My Account</strong>
              <span>yuurule</span>
            </div>

            {/* <button onClick={() => {
  //           signOut({
  //             callbackUrl: '/'
  //           })
  //         }}>sign out</button> */}
          </Link>
      }
    </div>

    <SignInDialog 
      show={showSignIn}
      handleClose={handleToggleSignIn}
    />
    </>
  )
}