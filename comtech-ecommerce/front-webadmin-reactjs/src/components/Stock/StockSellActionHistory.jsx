import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faAdd, faMinus, faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { formatTimestamp } from '../../utils/utils';

export default function StockSellActionHistory({ data }) {



  return (
    <>
    <header>
      <h5 className="mb-0">Sell Action History</h5>
      <small className="opacity-50">Remove(sell) or reserve in stock by customer order</small>
    </header>
    {
      data.length > 0
      ?
      <>
      <table className='table'>
        <thead>
          <tr>
            <th>Product</th>
            <th>Action</th>
            <th>Amount</th>
            <th>Date/Time <FontAwesomeIcon icon={faArrowUp} /></th>
            <th>By</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((action, index) => (
              <tr key={`stock_action_history_row_${index + 1}`}>
                <td>Asus ROG Flow Z13<br /><small>SKU:471138788</small></td>
                <td><span className='badge text-bg-success'>ADD</span></td>
                <td>20</td>
                <td>12 Jan 25<br /><small>13:30:55</small></td>
                <td>Webadmin</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <div className='d-flex justify-content-center'>
        <MyPagination />
      </div>
      </>
      :
      <p className='my-5 text-center'>ยังไม่มีข้อมูล</p>
    }
    </>
  )
}