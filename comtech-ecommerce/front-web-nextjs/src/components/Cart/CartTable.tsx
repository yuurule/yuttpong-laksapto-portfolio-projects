"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from '@fortawesome/free-solid-svg-icons';
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

  useEffect(() => {
    const fecthCartItems = async () => {
      setLoadData(true);
      try {
        if(status !== 'loading' && session?.user.id) {
          const cartItems = await cartService.getCartByCustomer(session.user.id);
          console.log(cartItems.RESULT_DATA)
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
      const itemCampaign = cart.product.campaignProducts;
      const usePrice = calculateUsePrice(productPrice, itemCampaign);
      const itemSubTotal = calculateSubtotal(productPrice, itemCampaign, cart.quantity);

      const tempItem: any = {
        id: cart.product.id,
        name: cart.product.name,
        usePrice: usePrice,
        realPrice: productPrice,
        quantity: cart.quantity,
        itemSubTotal: itemSubTotal
      }

      if(itemCampaign.length > 0 && (itemCampaign[0].campaign.startAt !== null && itemCampaign[0].campaign.endAt !== null)) {
        tempItem.campaignId = itemCampaign[0].campaign.id;
        tempItem.discount = parseInt(itemCampaign[0].campaign.discount);
      }

      tempResult.cartItems.push(tempItem);

      tempResult.subTotal += itemSubTotal;
    });

    if(cartData.length > 0) {
      tempResult.shippingFee = tempResult.subTotal >= 5000 ? 0 : 100;
    }
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
          incrementRefreshCart();
          setRefresh(prevState => prevState + 1);
        });
    }
    catch(error) {
      toast.error(`Delete item in cart is failed due to reason: ${error}`);
      console.log(`Delete item in cart is failed due to reason: ${error}`)
    }
    finally { setLoadData(false); }
  }

  return (
    <>
    <div className={`col-lg-${cartItemList.length > 0 ? '9' : '12'} mb-5`}>
      {
        cartItemList.length > 0
        ?
        <>
        <div className='table-responsive'>
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
                        {
                          item.product.images.length > 0
                          ?
                          <img src={`${process.env.NEXT_PUBLIC_API_URL}/${item.product.images[0].path}`} className={`me-3 ${styles.productImage}`} />
                          :
                          <img src="https://placehold.co/80x50" className='me-3' />
                        }
                        <p className="mb-0">{item.product.name}</p>
                      </div>
                    </td>
                    <td>
                      <p className='mb-0'>฿{ moneyFormat( moneyValue.cartItems[index].usePrice, 2, 2) }</p>
                      {
                        item.product.campaignProducts.length > 0 && (item.product.campaignProducts[0].campaign.startAt !== null && item.product.campaignProducts[0].campaign.endAt !== null) &&
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
        </div>
        <div className="d-flex justify-content-end">
          <Link href="/products?brands=all&categories=all" className="btn design-btn px-4">
            Continue Shopping
          </Link>
        </div>
        </>
        :
        <div className='text-center'>
          <p className='opacity-50 my-5'>Your cart is empty</p>
          <Link href="/products?brands=all&categories=all" className="btn design-btn px-4">
            Continue Shopping
          </Link>
        </div>
      }
      
      
    </div>

    {
      cartItemList.length > 0 &&
      <div className="col-lg-3">
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
          <Link href="/cart/checkout" className="w-100 btn design-btn gradient-btn py-3">Go to Checkout</Link>
        </div>
      </div>
    }
    </>
  )
}