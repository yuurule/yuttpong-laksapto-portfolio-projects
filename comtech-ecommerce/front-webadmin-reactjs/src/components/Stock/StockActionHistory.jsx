import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faAdd, faMinus, faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../../components/MyPagination/MyPagination';
import { formatTimestamp } from '../../utils/utils';

export default function StockActionHistory({ data }) {

  return (
    <>
    <header>
      <h5 className="mb-0">Stock Action History<span></span></h5>
      <small className="opacity-50">Add/remove in stock by webadmin user</small>
    </header>
    {
      data.length > 0
      ?
      <>
      <table className='table mt-2'>
        <thead>
          <tr>
            <th>Product</th>
            <th>Action</th>
            <th>Amount</th>
            <th>Notes</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((i, index) => {
              if(index < 3) {
                return (
                  <tr key={`stock_action_history_row_${i.id}`}>
                    <td>{i?.product?.name}<br /><small className='opacity-50'>SKU:{i?.product?.sku}</small></td>
                    <td>
                      <small className={`badge ${i?.action === 'ADD' ? 'text-bg-success' : ''} ${i?.action === 'REMOVE' ? 'text-bg-danger' : ''}`}>{i?.action}</small>
                    </td>
                    <td>{i?.quantity}</td>
                    <td>{i.description ?? '-'}</td>
                    <td>
                      {formatTimestamp(i?.actionedAt)}
                      <br />
                      <small className='opacity-50'>{i?.actionedBy?.displayName}</small>
                    </td>
                  </tr>
                )
              }
            })
          }
        </tbody>
      </table>
      {/* <div className='d-flex justify-content-center'>
        <MyPagination 
        />
      </div> */}
      </>
      :
      <p className='my-5 text-center'>ยังไม่มีข้อมูล</p>
    }
    </>
  )
}