"use client";

import React, { useState, useEffect } from 'react';
import styles from '../Cart/Cart.module.scss';
import { MoneyValueCartTableProps } from '@/types/PropsType';
import { moneyFormat } from '@/utils/rendering';
import { calculateUsePrice, calculateSubtotal } from '@/utils/utils';

export default function OrderSummary({
  orderItems
}: {
  orderItems: any[]
}) {

  const [moneyValue, setMoneyValue] = useState<MoneyValueCartTableProps>({
    cartItems: [],
    subTotal: 0,
    shippingFee: 0,
    vatTotal: 0,
    total: 0,
  });

  useEffect(() => {
    calculateMoneyValue(orderItems);
  }, [orderItems]);

  const calculateMoneyValue = (orderItemsData: any[]) => {
    const tempResult : MoneyValueCartTableProps = {
      cartItems: [],
      subTotal: 0,
      shippingFee: 0,
      vatTotal: 0,
      total: 0,
    };

    orderItemsData.map((item: any) => {
      const productPrice = parseFloat(item.product.price);
      const productCampiagn = item.campaign ? [{ campaign: item.campaign }] : [];
      const usePrice = calculateUsePrice(productPrice, productCampiagn);
      const itemSubTotal = calculateSubtotal(productPrice, productCampiagn, item.quantity);

      tempResult.cartItems.push({
        id: item.product.id,
        name: item.product.name,
        usePrice: usePrice,
        realPrice: productPrice,
        quantity: item.quantity,
        discount: item.discount,
        itemSubTotal: itemSubTotal
      });

      tempResult.subTotal += itemSubTotal;
    });

    if(orderItemsData.length > 0) {
      tempResult.shippingFee = tempResult.subTotal >= 5000 ? 0 : 500;
    }
    tempResult.total = tempResult.subTotal + tempResult.shippingFee;
    tempResult.vatTotal = (tempResult.subTotal * 7) / 100;
    tempResult.subTotal = tempResult.subTotal - ((tempResult.subTotal * 7) / 100);

    setMoneyValue(tempResult);
  }

  return (
    <div className={`${styles.cartTotal}`}>
      <div className={`${styles.content}`}>
        <h4 className={`${styles.title}`}>summary order</h4>
        <table className='table'>
          <tbody>
            {
              moneyValue.cartItems.map((i: any, index: number) => (
                <tr key={`cart_item_${index + 1}`}>
                  <td>{i.name} x{i.quantity}</td>
                  <td>
                    ฿{moneyFormat(i.usePrice, 2, 2)}
                    {
                      i.discount &&
                      <>
                      <br />
                      <small className='opacity-50'>-{i.discount}%</small>
                      </>
                    }
                  </td>
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