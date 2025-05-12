"use client";

import React, { useState } from 'react';
import styles from './AddToCart.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import SignInDialog from '@/components/SignIn/SignInDialog';
import { Form } from 'react-bootstrap';
import { cartService } from '@/services';
import { useSession } from 'next-auth/react';
import useStore from '@/store';
import WishlistButton from '../WishlistButton';

export default function AddToCart({
  productId,
  price,
  currentInStock
}: {
  productId: number,
  price: number,
  currentInStock: number
}) {

  const { status, data: session } = useSession();
  const incrementRefreshCart = useStore((state) => state.incrementRefreshCart);
  const [quantity, setQuantity] = useState(0);
  const [showSignIn, setShowSignIn] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);

  const handleToggleSignIn = () => setShowSignIn(prevState => !prevState);

  const handleAddRemoveQuantity = (actionType: string) => {
    if(actionType === 'add') {
      if(quantity < currentInStock) {
        setQuantity(prevState => prevState + 1);
      }
    }
    else if(actionType === 'remove') {
      if(quantity > 0) {
        setQuantity(prevState => prevState - 1);
      }
    }
  }

  const handleSubmitAddToCart = async () => {
    if(status !== 'loading') {
      if(!session?.user) {
        handleToggleSignIn();
      }
      else {
        if(quantity < 1) {
          alert("Please add quantity before add to cart");
        }
        else {
          if(session.user.id) {
            setOnSubmit(true);
            try {
              // Check this product is already exists in cart or not
              const customerCart = await cartService.getCartByCustomer(session.user.id);
              const findProductInCart = customerCart.RESULT_DATA.find((i: any) => i.productId === productId);
              if(findProductInCart) {
                // update (add more) product quantity
                await cartService.updateItemInCart(findProductInCart.id, quantity, 'add')
                  .then(result => {
                    console.log(`Add more quantity in cart for one product is successfully`);
                    incrementRefreshCart();
                    setQuantity(0);
                  });
              }
              else {
                // add product to cart
                await cartService.addToCart(session.user.id, productId, quantity)
                  .then(result => {
                    console.log(`Add to cart is successfully`);
                    incrementRefreshCart();
                    setQuantity(0);
                  });
              }
            }
            catch(error) {
              console.error(`Add to cart is failed due to reason: ${error}`)
            }
            finally {
              setOnSubmit(false);
            }
          }
        }
      }
    }
  }

  return (
    <>
    {
      quantity > 0 &&
      <p>Total price: ฿{ (price * quantity).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
    }
    <div className={`${styles.addToCart}`}>
      <div>
        <div className={`input-group ${styles.inputGroup}`}>
          <button 
            className="btn btn-outline-secondary" 
            type="button"
            disabled={onSubmit}
            onClick={() => handleAddRemoveQuantity('remove')}
          >-</button>
          <Form.Control 
            type="number"
            value={quantity}
            disabled={true}
          />
          <button 
            className="btn btn-outline-secondary" 
            type="button"
            disabled={onSubmit || quantity === currentInStock}
            onClick={() => handleAddRemoveQuantity('add')}
          >+</button>
        </div>
      </div>
      <div className={`${styles.btnGroup}`}>
        <button 
          type="button"
          className="btn design-btn gradient-btn px-4" 
          title="Add to my cart"
          disabled={onSubmit}
          onClick={handleSubmitAddToCart}
        >
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />Add to cart
        </button>
        
        <WishlistButton
          handleToggleSignIn={handleToggleSignIn}
          productId={productId}
        />

      </div>
    </div>

    <SignInDialog 
      show={showSignIn}
      handleClose={handleToggleSignIn}
    />
    </>
  )
}