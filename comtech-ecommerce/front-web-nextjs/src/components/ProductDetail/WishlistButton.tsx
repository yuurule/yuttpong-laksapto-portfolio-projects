"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faHeart as heartRegular } from '@fortawesome/free-regular-svg-icons';
import useStore from '@/store';
import { toast } from 'react-toastify';
import { customerService } from '@/services';
import { wishlistService } from '@/services/wishlistService';

export default function WishlistButton({
  handleToggleSignIn,
  productId,
}: {
  handleToggleSignIn: () => void;
  productId: number;
}) {

  const { status, data: session } = useSession();
  const refreshWishlistStore = useStore((state) => state.refreshWishlist);
  const incrementRefreshWishlist = useStore((state) => state.incrementRefreshWishlist);
  const [loadData, setLoadData] = useState(false);
  const [wishlistStatus, setWishlistStatus] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [onSubmit, setOnSubmit] = useState(false);

  useEffect(() => {

    const fetchCustomer = async () => {
      setLoadData(true);
      try {
        if(status !== 'loading') {
          if(session?.user.id) {
            const customer = await customerService.getOneCustomer(parseInt(session.user.id));
            const checkWishlist = customer.RESULT_DATA.wishlists.find((i: any) => i.customerId === session.user.id && i.productId === productId);

            if(checkWishlist) {
              setWishlistStatus(true);
              setWishlistId(checkWishlist.id);
            }
            else {
              setWishlistStatus(false);
            }
          }
        }
      }
      catch(error) {
        console.error(`Get customer is failed due to reason: ${error}`);
        toast.error(`Get customer is failed due to reason: ${error}`);
      }
      finally { setLoadData(false); }
    }

    fetchCustomer();

  }, [status, refreshWishlistStore]);

  const handleToggleWishlist = async () => {
    if(status !== 'loading') {
      if(!session?.user) {
        handleToggleSignIn();
      }
      else {
        if(!wishlistStatus) {
          try {
            if(session?.user.id) {
              setOnSubmit(true);
              await wishlistService.addWishlist(productId, parseInt(session.user.id))
                .then(result => {
                  console.log(`Add product to wishlist is success`);
                  toast.success(`You add this product to wishlist`);
                  incrementRefreshWishlist();
                });
            }
            else {
              throw new Error(`Unauthorized, user id is required`)
            }
          }
          catch(error) {
            console.error(error);
            toast.error(`${error}`);
          }
          finally { setOnSubmit(false) }
        }
        else {
          try {
            if(session?.user.id && wishlistId) {
              setOnSubmit(true);
              await wishlistService.removeWishlist(wishlistId)
                .then(result => {
                  console.log(`Remove product from wishlist is success`);
                  toast.success(`You remove this product from your wishlist`);
                  incrementRefreshWishlist();
                });
            }
            else {
              throw new Error(`Unauthorized, user id is required`)
            }
          }
          catch(error) {
            console.error(error);
            toast.error(`${error}`);
          }
          finally { setOnSubmit(false) }
        }
      }
    }
  }

  return (
    <button 
      type="button"
      title={""}
      disabled={onSubmit}
      className="btn design-btn gradient-outline-btn ms-2"
      onClick={handleToggleWishlist}
    >
      {
        onSubmit
        ?
        <FontAwesomeIcon icon={faSpinner} />
        :
        <>
        {
          wishlistStatus
          ?
          <FontAwesomeIcon icon={faHeart} />
          :
          <FontAwesomeIcon icon={heartRegular} />
        }
        </>
      }
    </button>
  )
}