"use client";

import React, { useState } from 'react';
import styles from './AddToCart.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as heartRegular } from '@fortawesome/free-regular-svg-icons';
import SignInDialog from '@/components/SignIn/SignInDialog';
import { Form } from 'react-bootstrap';
import { cartService } from '@/services';
import { useSession } from 'next-auth/react';

export default function AddToCart({
  productId,
  price,
}: {
  productId: number,
  price: number
}) {

  const { status, data: session } = useSession();
  const [quantity, setQuantity] = useState(0);
  const [showSignIn, setShowSignIn] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);

  const handleToggleSignIn = () => setShowSignIn(prevState => !prevState);

  const handleAddRemoveQuantity = (actionType: string) => {
    if(actionType === 'add') {
      // check in stock before add later...
      setQuantity(prevState => prevState + 1);
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
                    setQuantity(0);
                  });
              }
              else {
                // add product to cart
                await cartService.addToCart(session.user.id, productId, quantity)
                  .then(result => {
                    console.log(`Add to cart is successfully`);
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
            disabled={onSubmit}
            onClick={() => handleAddRemoveQuantity('add')}
          >+</button>
        </div>
      </div>
      <div>
        <button 
          type="button"
          className="btn design-btn gradient-btn px-4" 
          title="Add to my cart"
          disabled={onSubmit}
          onClick={handleSubmitAddToCart}
        >
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />Add to cart
        </button>
        <button className="btn design-btn gradient-outline-btn ms-2" title="Add to my wishlist">
          <FontAwesomeIcon icon={heartRegular} />
        </button>
      </div>
    </div>

    <SignInDialog 
      show={showSignIn}
      handleClose={handleToggleSignIn}
    />
    </>
  )
}