"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faRefresh } from '@fortawesome/free-solid-svg-icons';
import styles from './Cart.module.scss';
import { cartService } from "@/services";
import { useSession } from 'next-auth/react';
import { moneyFormat } from '@/utils/rendering';
import Link from "next/link";
import { MoneyValueCartTableProps } from '@/types/PropsType';
import { calculateUsePrice, calculateSubtotal } from '@/utils/utils';
import useStore from '@/store';
import { toast } from 'react-toastify';

export default function CartTable() {

  const { status, data: session } = useSession();
  const incrementRefreshCart = useStore((state) => state.incrementRefreshCart);
  const [loadData, setLoadData] = useState(false);
  const [cartItemList, setCartItemList] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [moneyValue, setMoneyValue] = useState<MoneyValueCartTableProps>({
    cartItems: [],
    subTotal: 0,
    shippingFee: 0,
    vatTotal: 0,
    total: 0,
  });
  const [onSubmit, setOnSubmit] = useState(false);

  useEffect(() => {
    const fecthCartItems = async () => {
      setLoadData(true);
      try {
        if(status !== 'loading' && session?.user.id) {
          const cartItems = await cartService.getCartByCustomer(session.user.id);
          setCartItemList(cartItems.RESULT_DATA);
          calculateMoneyValue(cartItems.RESULT_DATA);
        }
      }
      catch(error) {
        console.error(`Fecth cart items is failed due to reason: ${error}`);
      }
      finally { setLoadData(false); }
    }

    fecthCartItems();
    
  }, [refresh, status]);

  const calculateMoneyValue = (cartData: any[]) => {
    const tempResult : MoneyValueCartTableProps = {
      cartItems: [],
      subTotal: 0,
      shippingFee: 0,
      vatTotal: 0,
      total: 0,
    };

    cartData.map((cart: any) => {
      const productPrice = parseFloat(cart.product.price);
      const usePrice = calculateUsePrice(productPrice, cart.product.campaignProducts);
      const itemSubTotal = calculateSubtotal(productPrice, cart.product.campaignProducts, cart.quantity);

      tempResult.cartItems.push({
        name: cart.product.name,
        usePrice: usePrice,
        realPrice: productPrice,
        quantity: cart.quantity,
        itemSubTotal: itemSubTotal
      });

      tempResult.subTotal += itemSubTotal;
    });

    tempResult.shippingFee = tempResult.subTotal >= 5000 ? 0 : 500;
    tempResult.total = tempResult.subTotal + tempResult.shippingFee;
    tempResult.vatTotal = (tempResult.subTotal * 7) / 100;
    tempResult.subTotal = tempResult.subTotal - ((tempResult.subTotal * 7) / 100);

    setMoneyValue(tempResult);
  }

  const handleEditItem = async (
    actionType: string, 
    cartItemId: number, 
    currentQuantity: number,
    currentInStock?: number,
  ) => {
    setLoadData(true);
    try {
      let newQuantity = 0;
      if(actionType === 'add') {
        if(currentQuantity === currentInStock) {
          throw new Error(`product in stock is not have enough.`);
        }
        else newQuantity = currentQuantity + 1;
      }
      if(actionType === 'remove') {
        if(currentQuantity === 1) {
          throw new Error(`quantity must not zero or negative value.`);
        }
        else newQuantity = currentQuantity - 1;
      }
      await cartService.updateItemInCart(cartItemId, newQuantity, 'update')
        .then(result => {
          incrementRefreshCart();
          setRefresh(prevState => prevState + 1);
        });
    }
    catch(error) {
      toast.error(`Edit item in cart is failed due to reason: ${error}`);
      console.log(`Edit item in cart is failed due to reason: ${error}`);
    }
    finally { setLoadData(false); }
  }

  const handleDeleteItem = async (cartItemId: number) => {
    setLoadData(true);
    try {
      await cartService.deleteCartItems([cartItemId])
        .then(result => {
          setRefresh(prevState => prevState + 1);
        });
    }
    catch(error) {
      toast.error(`Delete item in cart is failed due to reason: ${error}`);
      console.log(`Delete item in cart is failed due to reason: ${error}`)
    }
    finally { setLoadData(false); }
  }

  const handlePlaceOrder = async () => {
    setOnSubmit(true);
    try {
      console.log(cartItemList);
      console.log(moneyValue)
    }
    catch(error) {
      console.log(`Place order is failed due to reason: ${error}`);
      toast.error(`Place order is failed due to reason: ${error}`);
    }
    finally { setOnSubmit(false); }
  }

  return (
    <>
    <div className="col-sm-9 mb-5">
      <table className={`table table-design ${styles.cartTable}`}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            cartItemList.map((item: any, index: number) => (
              <tr key={`cart_item_${index + 1}`}>
                <td>
                  <div className="d-flex align-items-center">
                    <img src="/images/dummy-product.jpg" className="product-image" />
                    <p className="mb-0">{item.product.name}</p>
                  </div>
                </td>
                <td>
                  <p className='mb-0'>฿{ moneyFormat( moneyValue.cartItems[index].usePrice, 2, 2) }</p>
                  {
                    item.product.campaignProducts.length > 0 &&
                    <small className='opacity-50'><s>฿{ moneyFormat( moneyValue.cartItems[index].realPrice, 2, 2) }</s></small>
                  }
                </td>
                <td>
                  <div className={`${styles.addToCart}`}>
                    <div className={`input-group ${styles.inputGroup}`}>
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button" 
                        disabled={loadData || item.quantity === 1}
                        onClick={(e) => {
                          handleEditItem('remove', item.id, item.quantity);
                        }}
                      >-</button>
                      <input 
                        type="text" 
                        className="form-control"
                        value={item.quantity}
                        disabled={true}
                      />
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        disabled={loadData || item.quantity === item.product.inStock.inStock}
                        onClick={(e) => {
                          handleEditItem('add', item.id, item.quantity, item.product.inStock.inStock);
                        }}
                      >+</button>
                    </div>
                  </div>
                </td>
                <td>฿{ moneyFormat( moneyValue.cartItems[index].itemSubTotal, 2, 2) }</td>
                <td style={{width: 80, textAlign: 'center'}}>
                  <button 
                    type="button"
                    className="btn btn-link p-0 text-red"
                    disabled={loadData}
                    onClick={(e) => {
                      handleDeleteItem(item.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <div className="d-flex justify-content-end">
        <Link href="/products?brands=all&categories=all" className="btn design-btn px-4">
          Continue Shopping
        </Link>
      </div>
    </div>
    <div className="col-sm-3">
      <div className={`${styles.cartTotal}`}>
        <div className={`${styles.content}`}>
          <h4 className={`${styles.title}`}>cart totals</h4>
          <table className={`table`}>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td>฿{ moneyFormat(moneyValue.subTotal, 2, 2) }</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>฿{ moneyFormat(moneyValue.shippingFee, 2, 2) }</td>
              </tr>
              <tr>
                <td>Vat(0.7%)</td>
                <td>฿{ moneyFormat(moneyValue.vatTotal, 2, 2) }</td>
              </tr>
            </tbody>
          </table>
          <hr />
          <table className={`table mb-3`}>
            <tbody>
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>฿{ moneyFormat(moneyValue.total, 2, 2) }</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          type="button"
          disabled={onSubmit}
          className="w-100 btn design-btn gradient-btn py-3"
          onClick={handlePlaceOrder}
        >
          {onSubmit ? <FontAwesomeIcon icon={faRefresh} className='text-light' /> : 'Place Order'}
        </button>
      </div>
    </div>
    </>
  )
}