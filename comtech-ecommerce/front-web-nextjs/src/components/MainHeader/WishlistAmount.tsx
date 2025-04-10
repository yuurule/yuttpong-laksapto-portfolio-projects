'use client';

import React, { useState, useEffect } from 'react';
import styles from './MainHeader.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useSession } from 'next-auth/react';

export default function WishlistAmount() {

  const { status, data: session } = useSession();

  if(status !== 'loading') {
    if(!session?.user) {
      return <></>
    }
    else {
      return (
        <Link href="/" className={`${styles.wishListBtn} btn btn-link p-0`}>
          <FontAwesomeIcon icon={faHeartRegular} />
          <span className={`${styles.digitSign}`}>0</span>
        </Link>
      )
    }
  }

  return null;
}