import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import PaginationArrow from '../../components/PaginationArrow/PaginationArrow';
import AddProductInCampaign from './AddProductInCampaign';

export default function ProductInCampaign({ selectedCampaign, data }) {

  const [openAddDialog, setOpenAddDialog] = useState(false);


  return (
    <>
    {
      selectedCampaign
      ?
      <>
      <header>
        <h5>Products in "{selectedCampaign?.name}" campaign</h5>
        <hr />
      </header>
      {
        data !== undefined && Array.isArray(data)
        ?
          <>
          <div className='mb-2'>
            <button 
              type="button"
              className='btn btn-primary me-3'
              onClick={() => setOpenAddDialog(true)}
            ><FontAwesomeIcon icon={faPlus} className='me-2' />Add Items</button>
            {
              data.length > 0 && <button className='btn btn-danger'><FontAwesomeIcon icon={faMinus} className='me-2' />Deletes</button>
            }
          </div>
          {
            data.length > 0
            ?
            <>
            <table className='table'>
              <thead>
                <tr>
                  <th></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((i, index) => (
                    <tr key={`product_in_campaign_row_${index + 1}`}>
                      <td>
                        <Form.Check
                          type={"checkbox"}
                          id={`select-product`}
                          label={``}
                        />
                      </td>
                      <td>Asus ROG Zephyrus G16 GU605MI-QR225WS Eclipse Gray</td>
                      <td>$1,250<br /><small><s>$1,400</s></small></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <PaginationArrow />
            </>
            :
            <p className='my-4 text-center'>ยังไม่มีรายการสินค้าใน campaign</p>
          }
          </>
        :
        <p className='my-4 text-center'>เกิดข้อผิดพลาด ข้อมูลรายการไม่ถูกต้อง</p>
      }
      
      </>
      :
      <h5 className='my-5 text-center'>Select some campaign</h5>
    }
    
    <AddProductInCampaign
      openDialog={openAddDialog}
      handleCloseDialog={() => setOpenAddDialog(false)}
    />
    </>
  )
}