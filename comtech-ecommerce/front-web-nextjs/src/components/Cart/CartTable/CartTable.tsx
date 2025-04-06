"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from '@fortawesome/free-solid-svg-icons';
import styles from '../Cart.module.scss';
import { productService, cartService } from "@/services";
import { useSession } from 'next-auth/react';

export default function CartTable() {

  const { status, data: session } = useSession();

  const [cartItemList, setCartItemList] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    
  }, [refresh]);

  return (
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
          [...Array(3)].map((item, index) => (
            <tr key={`cart_item_${index + 1}`}>
              <td>
                <div className="d-flex align-items-center">
                  <img src="/images/dummy-product.jpg" className="product-image" />
                  <p className="mb-0">MSI Sephyrous Pro 17.3" With 4K Gaming Notebook SX078U Limited Edition</p>
                </div>
              </td>
              <td>$1,299.00</td>
              <td>
                <div className={`${styles.addToCart}`}>
                  <div className={`input-group ${styles.inputGroup}`}>
                    <button className="btn btn-outline-secondary" type="button" id="button-addon1">-</button>
                    <input type="text" className="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2">+</button>
                  </div>
                </div>
              </td>
              <td>$1,299.00</td>
              <td style={{width: 80, textAlign: 'center'}}>
                <button className="btn btn-link p-0 text-red">
                  <FontAwesomeIcon icon={faClose} />
                </button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}