import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrashAlt, faClose } from '@fortawesome/free-solid-svg-icons';
import PaginationArrow from '../../components/PaginationArrow/PaginationArrow';
import AddProductInCampaign from './AddProductInCampaign';
import { formatMoney } from '../../utils/utils';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import * as CampaignService from '../../services/campaignService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function ProductInCampaign({ selectedCampaign, data, handleRefreshData }) {

  const authUser = useSelector(state => state.auth.user);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDeleteProducts, setSelectedDeleteProducts] = useState([]);
  const [onSubmit, setOnSubmit] = useState(false);

  const handleConfirmDelete = async () => {
    setOnSubmit(true);
    try {
      await CampaignService.removeProductsFromCampaign(selectedCampaign?.id, selectedDeleteProducts, authUser.id)
        .then(res => {
          handleRefreshData(selectedCampaign?.id, selectedCampaign?.name);
          toast.success(`Remove products from campaign is successfully.`);
          setSelectedDeleteProducts([]);
          setOpenDeleteDialog(false);
        })
        .catch(error => {
          throw new Error(`Remove products from campaign is failed due to: ${error}`);
        });
    }
    catch(error) {
      console.log(error.message);
      toast.error(error.message);
    }
    finally {
      setOnSubmit(false);
    }
  }

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
              data.length > 0 && 
              <button 
                type="button"
                className='btn btn-danger'
                disabled={(selectedDeleteProducts.length === 0)}
                onClick={() => setOpenDeleteDialog(true)}
              >
                <FontAwesomeIcon icon={faMinus} className='me-2' />Deletes
              </button>
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
                  data.map((product, index) => (
                    <tr key={`product_in_campaign_row_${product.product.id}`}>
                      <td>
                        <Form.Check
                          type={"checkbox"}
                          id={`select-product`}
                          label={``}
                          checked={(selectedDeleteProducts.filter(i => i === product.product.id).length > 0)}
                          onChange={(e) => {
                            const tempSelectedDeletedProducts = [...selectedDeleteProducts];
                            if(e.target.checked === true) {
                              tempSelectedDeletedProducts.push(product.product.id);
                              setSelectedDeleteProducts(tempSelectedDeletedProducts);
                            }
                            else {
                              const removeResult = tempSelectedDeletedProducts.filter(i => i !== product.product.id);
                              setSelectedDeleteProducts(removeResult);
                            }
                          }}
                        />
                      </td>
                      <td>{product.product.name}</td>
                      <td>฿{formatMoney(product.product.price)}</td>
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

    <Dialog open={openDeleteDialog}>
      <DialogContent>
        <p className='h3'>Do you confirm remove?</p>
      </DialogContent>
      <DialogActions className='d-flex justify-content-center'>
        <button 
          type="button"
          className='btn btn-success px-4 me-2'
          onClick={handleConfirmDelete}
        >
          <FontAwesomeIcon icon={faTrashAlt} className='me-2' />
          Confirm Delete
        </button>
        <button 
          type="button"
          className='btn btn-danger px-4'
          onClick={() => {
            setSelectedDeleteProducts([]);
            setOpenDeleteDialog(false)
          }}
        ><FontAwesomeIcon icon={faClose} className='me-2' />Cancel</button>
      </DialogActions>
    </Dialog>
    
    {
      openAddDialog &&
      <AddProductInCampaign
        selectedCampaign={selectedCampaign}
        openDialog={openAddDialog}
        handleCloseDialog={() => setOpenAddDialog(false)}
        handleRefreshData={handleRefreshData}
      />
    }
    </>
  )
}