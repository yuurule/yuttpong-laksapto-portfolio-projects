import { useState, useEffect } from 'react';
import MyPagination from '../MyPagination/MyPagination';
import { formatTimestamp } from '../../utils/utils';
import * as StockService from '../../services/stockService';
import { toast } from 'react-toastify';

export default function StockActionHistory({ refresh }) {

  const [loadData, setLoadData] = useState(false);
  const [stockActions, setStockActions] = useState([]);
  const setPageSize = 5;
  const [paramsQuery, setParamsQuery] = useState({
    page: 1,
    pageSize: setPageSize,
    pagination: true,
    orderBy: 'actionedAt',
    orderDir: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoadData(true);
      try {
        const stockActions = await StockService.getAllStockAction(paramsQuery);
        setStockActions(stockActions.data.RESULT_DATA);
        setCurrentPage(stockActions.data.RESULT_META.currentPage);
        setTotalPage(stockActions.data.RESULT_META.totalPages);
      }
      catch(error) {
        console.log(error.message);
        toast.error(error.message);
      }
      finally {
        setLoadData(false);
      }
    }

    fetchData();
  }, [refresh, paramsQuery]);

  const handleSelectPage = (pageNumber) => {
    const tempParamsQuery = {...paramsQuery};
    tempParamsQuery.page = pageNumber;
    setParamsQuery(tempParamsQuery);
  }

  return (
    <>
    <header>
      <h5 className="mb-0">Stock Action History<span></span></h5>
      <small className="opacity-50 d-block">Add/remove in stock by webadmin user</small>
    </header>
    {
      stockActions.length > 0
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
            stockActions.map((i, index) => {
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
            })
          }
        </tbody>
      </table>
      <div className='d-flex justify-content-center'>
        <MyPagination
          currentPage={currentPage}
          totalPage={totalPage}
          handleSelectPage={handleSelectPage}
        />
      </div>
      </>
      :
      <p className='my-5 text-center'>ยังไม่มีข้อมูล</p>
    }
    </>
  )
}