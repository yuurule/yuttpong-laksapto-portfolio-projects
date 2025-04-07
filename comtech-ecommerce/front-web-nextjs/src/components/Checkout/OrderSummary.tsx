"use client";

import React, { useState, useEffect } from 'react';
import styles from '../Cart/Cart.module.scss';
import { MoneyValueCartTableProps } from '@/types/PropsType';
import { cartService } from "@/services";
import { useSession } from 'next-auth/react';
import { moneyFormat } from '@/utils/rendering';
import { calculateUsePrice, calculateSubtotal } from '@/utils/utils';

export default function OrderSummary() {

  const { status, data: session } = useSession();
  const [loadData, setLoadData] = useState(false);
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
          //console.log(cartItems.RESULT_DATA)
          calculateMoneyValue(cartItems.RESULT_DATA);
        }
      }
      catch(error) {
        console.error(`Fecth cart items is failed due to reason: ${error}`);
      }
      finally { setLoadData(false); }
    }

    fecthCartItems();
    
  }, [status]);

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

  return (
    <div className={`${styles.cartTotal}`}>
      <div className={`${styles.content}`}>
        <h4 className={`${styles.title}`}>your order</h4>
        <table className='table'>
          <tbody>
            {
              moneyValue.cartItems.map((i: any, index: number) => (
                <tr key={`cart_item_${index + 1}`}>
                  <td>{i.name} x{i.quantity}</td>
                  <td>฿{moneyFormat(i.usePrice, 2, 2)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <hr />
        <table className='table'>
          <tbody>
            <tr>
              <td>Subtotal</td>
              <td>฿{moneyFormat(moneyValue.subTotal, 2, 2)}</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>฿{moneyFormat(moneyValue.shippingFee, 2, 2)}</td>
            </tr>
            <tr>
              <td>Vat(7%)</td>
              <td>฿{moneyFormat(moneyValue.vatTotal, 2, 2)}</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <table className='table'>
          <tbody>
            <tr>
              <td><strong className='h5'>Total</strong></td>
              <td><strong className='h5'>฿{moneyFormat(moneyValue.total, 2, 2)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}