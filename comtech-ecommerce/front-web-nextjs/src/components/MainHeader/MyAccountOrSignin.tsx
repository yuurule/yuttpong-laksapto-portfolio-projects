'use client';

import { signOut } from 'next-auth/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './MainHeader.module.scss';
import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

export default function MyAccountOrSignin() {

  const { status, data: session } = useSession();

  if(status !== 'loading') {
    if(!session?.user) { // not login yet.
      return (
        <div className={`${styles.infoWithIcon}`}>
          <Link href="/auth/signin" className='btn btn-primary px-4 btn-sm text-white'>Sign in</Link>
        </div>
      )
    }
    else { // already login
      return (
        <div className={`${styles.infoWithIcon}`}>
          <Link href="/auth/signin">
            <FontAwesomeIcon icon={faUser} />
            <div>
              <strong className={`${styles.title}`}>My Account</strong>
              <span>yuurule</span>
            </div>
          </Link>
          <button onClick={() => {
            signOut({
              callbackUrl: '/'
            })
          }}>sign out</button>
        </div>
      )
    }
  }

  return null;
}