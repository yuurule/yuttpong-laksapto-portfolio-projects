"use client";

export default function OrderSummary() {



  return (
    <div className="">
      <h4>your order</h4>
      <table>
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
      <table>
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
      <table>
        <tbody>
          <tr>
            <td><strong>Total</strong></td>
            <td><strong>$1,309.00</strong></td>
          </tr>
        </tbody>
      </table>
      <button className="w-100 btn btn-primary">
        place order
      </button>
    </div>
  )
}