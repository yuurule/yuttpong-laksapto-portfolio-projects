"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from '@fortawesome/free-solid-svg-icons';

export default function CartTable() {



  return (
    <table className="table">
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
            <tr key={`cart-item_${index + 1}`}>
              <td>
                <div className="d-flex">
                  <img src="/demo-product.png" />
                  <p className="h6 mb-0">MSI Sephyrous Pro 17.3" With 4K Gaming Notebook SX078U Limited Edition</p>
                </div>
              </td>
              <td>$1,299.00</td>
              <td>
                <div className="input-group">
                  <button className="btn btn-outline-secondary" type="button" id="button-addon1">-</button>
                  <input type="text" className="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                  <button className="btn btn-outline-secondary" type="button" id="button-addon2">+</button>
                </div>
              </td>
              <td>$1,299.00</td>
              <td>
                <button className="btn btn-link p-0">
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