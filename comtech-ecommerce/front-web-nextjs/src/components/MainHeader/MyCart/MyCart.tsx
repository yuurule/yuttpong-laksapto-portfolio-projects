"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import styles from '../MainHeader.module.scss';
import stylesCart from './MyCart.module.scss';
import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import SignInDialog from '@/components/SignIn/SignInDialog';
import { cartService } from '@/services';
import { moneyFormat } from '@/utils/rendering';

export default function MyCart() {

  const { status, data: session } = useSession();
  const [loadData, setLoadData] = useState(false);
  const [error, setLoadError] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [cartItems, setCartItem] = useState([]);

  useEffect(() => {
    const fetchCartData = async () => {
      setLoadError(null);
      setLoadData(true);
      try {
        if(status !== 'loading' && session?.user.id) {
          const cartItemsData = await cartService.getCartByCustomer(session.user.id);
          setCartItem(cartItemsData.RESULT_DATA);
        }
      }
      catch(error) {
        console.error(`Fetch cart data is failed due to reason: ${error}`);
        setLoadError('Something wrong with load data');
      }
      finally { setLoadData(false); }
    } 

    fetchCartData();
  }, [status]);

  const handleToggleSignIn = () => setShowSignIn(prevState => !prevState);

  const renderCartMenu = () => {
    return (
      <>
      <span className={`${styles.digitSign}`}>{cartItems.length}</span>
      <FontAwesomeIcon icon={faShoppingCart} />
      <div>
        <strong className={`${styles.title}`}>My Cart</strong>
        <strong style={{fontSize: '0.9rem'}}>฿{ moneyFormat(calculateTotalCart(cartItems), 2, 2) }</strong>
      </div>
      </>
    )
  }

  const calculateTotalCart = (items: any) => {
    let resultTotal = 0;
    items.map((i: any) => {
      let realPrice = parseFloat(i.product.price);
      let sellPrice = 0;
      if(i.product.campaignProducts.length > 0) {
        const discount = i.product.campaignProducts[0].campaign.discount;
        sellPrice = realPrice - ((realPrice * discount) / 100);
      }
      else {
        sellPrice = realPrice;
      }

      resultTotal += sellPrice;
    });

    return resultTotal;
  }

  const calculateItemPrice = (itemData: any) => {
    let realPrice = parseFloat(itemData.product.price);
    let sellPrice = 0;
    if(itemData.product.campaignProducts.length > 0) {
      const discount = itemData.product.campaignProducts[0].campaign.discount;
      sellPrice = realPrice - ((realPrice * discount) / 100);
      return <>฿{moneyFormat(sellPrice, 2, 2)} <small className='opacity-50'><s>{moneyFormat(realPrice, 2, 2)}</s></small></>;
    }
    else {
      return <>฿{moneyFormat(realPrice, 2, 2)}</>;
    }
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
              id="dropdown-my-cart"
            >
              { renderCartMenu() }
            </Dropdown.Toggle>
            <Dropdown.Menu className='my-dropdown'>
              {
                error === null
                ?
                  cartItems.length > 0
                  ?
                    <>
                    {
                      cartItems.map((i: any) => (
                        <div key={`cart_item_${i.id}`} className={stylesCart.cartItem}>
                          <figure>
                            <img className={stylesCart.image} src="/images/dummy-product.jpg" />
                          </figure>
                          <div>
                            <p className={stylesCart.name}>{i.product.name} <strong>x{i.quantity}</strong></p>
                            <p className={stylesCart.price}>{ calculateItemPrice(i) }</p>
                          </div>
                        </div>
                      ))
                    }
                    <Link href="/cart" className={`btn design-btn w-100 text-center d-block ${stylesCart.goToCart}`}>
                      <FontAwesomeIcon icon={faShoppingCart} className='me-2' />Go to cart
                    </Link>
                    </>
                  :
                  <p className='opacity-50 text-center my-3'>Your cart is empty</p>
                :
                <p className='opacity-50 text-center my-5'>{error}</p>
              }
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