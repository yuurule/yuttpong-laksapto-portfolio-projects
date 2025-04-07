"use client";
import styles from './Cart.module.scss';

export default function CartTotal() {

  return (
    <div className={`${styles.cartTotal}`}>
      <div className={`${styles.content}`}>
        <h4 className={`${styles.title}`}>cart totals</h4>
        <table className={`table`}>
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
        <table className={`table mb-3`}>
          <tbody>
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>$1,309.00</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="w-100 btn design-btn gradient-btn py-3">
        Proceed to checkout
      </button>
    </div>
  )
}