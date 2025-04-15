'use client';

import React, { useState, useEffect } from 'react';
import styles from './MainHeader.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useSession } from 'next-auth/react';
import useStore from '@/store';
import { customerService } from '@/services';
import { toast } from 'react-toastify';

export default function WishlistAmount() {

  const { status, data: session } = useSession();
  const refreshWishlist = useStore((state) => state.refreshWishlist);
  const setRefreshWishlist = useStore((state) => state.incrementRefreshWishlist);
  const [loadData, setLoadData] = useState(false);
  const [wishlistAmount, setWishlistAmount] = useState(0);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoadData(true);
      try {
        if(status !== 'loading' && session?.user.id) {
          const customer = await customerService.getOneCustomer(parseInt(session.user.id));
          setWishlistAmount(customer.RESULT_DATA.wishlists.length);
        }
      }
      catch(error) {
        console.error(`Get customer is failed due to reason: ${error}`);
        toast.error(`Get customer is failed due to reason: ${error}`);
      }
      finally { setLoadData(false); }
    }
    
    fetchCustomer();

  }, [status, refreshWishlist]);

  if(status !== 'loading') {
    if(!session?.user) {
      return <></>
    }
    else {
      return (
        <Link href={`/my-account/wishlists`} className={`${styles.wishListBtn} btn btn-link p-0 text-dark`}>
          <FontAwesomeIcon icon={faHeartRegular} />
          <span className={`${styles.digitSign}`}>{wishlistAmount}</span>
        </Link>
      )
    }
  }

  return null;
}