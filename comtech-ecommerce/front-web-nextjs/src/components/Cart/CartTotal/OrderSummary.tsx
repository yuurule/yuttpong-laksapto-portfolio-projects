"use client";

import styles from '../Cart.module.scss';

export default function OrderSummary() {



  return (
    <div className={`${styles.cartTotal}`}>
      <div className={`${styles.content}`}>
        <h4 className={`${styles.title}`}>your order</h4>
        <table className='table'>
          <tbody>
            <tr>
              <td>MSI Sephyrous Pro 17.3" With 4K Gaming Notebook SX078U Limited Edition x1</td>
              <td>$1,299.00</td>
            </tr>
            <tr>
              <td>MSI Sephyrous Pro 17.3" With 4K Gaming Notebook SX078U Limited Edition x1</td>
              <td>$1,299.00</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <table className='table'>
          <tbody>
            <tr>
              <td>Subtotal</td>
              <td>$1,299.00</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>Free</td>
            </tr>
            <tr>
              <td>Vat(0.7%)</td>
              <td>$1.29</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <table className='table'>
          <tbody>
            <tr>
              <td><strong className='h5'>Total</strong></td>
              <td><strong className='h5'>$1,309.00</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="w-100 btn design-btn gradient-btn py-3">
        PLACE ORDER
      </button>
    </div>
  )
}