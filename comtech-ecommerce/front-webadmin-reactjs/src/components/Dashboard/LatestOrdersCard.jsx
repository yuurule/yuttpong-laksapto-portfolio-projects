import { useState, useEffect } from 'react';
import * as OrderService from '../../services/orderService';
import { toast } from 'react-toastify';
import { formatTimestamp, formatMoney } from '../../utils/utils';

export default function LatestOrdersCard() {

  const [loadData, setLoadData] = useState(false);
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const fecthOrders = async () => {
      setLoadData(true);
      try {
        const orders = await OrderService.getOrders();
        setOrderList(orders.data.RESULT_DATA);
      }
      catch(error) {
        console.log(error);
        toast.error(`Fetch order is failed due to reason: ${error}`);
      }
      finally {
        setLoadData(false);
      }
    }

    fecthOrders();
  }, []);

  return (
    <div className="card">
      <div className="card-body" style={{minHeight: 320}}>
        <header className='d-flex justify-content-between align-items-center'>
          <h5 className='mb-0'>Latest Order<span></span></h5>
        </header>
        {
          loadData
          ?
          <p className='h4 opacity-50 text-center my-5'>Loading...</p>
          :
          <>
          {
            orderList.length > 0
            ?
            <table className='table mt-4'>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total Price</th>
                  <th>Created At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {
                  orderList.map((i, index) => {
                    if(index < 4) {
                      return (
                        <tr key={`latest_order_item_${i.id}`}>
                          <td>#{i.id}</td>
                          <td>{i.customer.customerDetail.firstName} {i.customer.customerDetail.lastName}</td>
                          <td>฿{formatMoney(i.total)}</td>
                          <td>{formatTimestamp(i.createdAt)}</td>
                          <td>"{i.paymentStatus}"</td>
                        </tr>
                      )
                    }
                  })
                }
              </tbody>
            </table>
            :
            <p className='h4 opacity-50 my-5'>Not have orders right now</p>
          }
          </>
        }
      </div>
    </div>
  )
}