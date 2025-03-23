import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus, faClose, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import MyPagination from '../components/MyPagination/MyPagination';
import { Link } from 'react-router';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import * as CampaignService from '../services/campaignService';
import { formatTimestamp } from '../utils/utils';
import { toast } from 'react-toastify';
import ProductInCampaign from '../components/Campaign/ProductInCampaign';
import UpsertCampaign from '../components/Campaign/UpsertCampaign';
import ActivateCampaign from '../components/Campaign/ActivateCampaign';
import dayjs from 'dayjs';

export default function Campaign() {

  const authUser = useSelector(state => state.auth.user);

  const [loadData, setLoadData] = useState(false);
  const [campaignList, setCampaignList] = useState([]);
  const [deletedCampaignList, setDeletedCampaignList] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [productListCampaign, setProductListCampaign] = useState([]);
  const [selectedEditCampaign, setSelectEditCampaign] = useState(null);
  const [upsertAction, setUpsertAction] = useState(null); // 'CREATE', 'EDIT'
  const [openUpsertCampaignDialog, setOpenUpsertCampaignDialog] = useState(false);
  const [selectedActivateCampaign, setSelectActivateCampaign] = useState(null);
  const [openActivateCampaignDialog, setOpenActivateCampaignDialog] = useState(false);
  const [selectedDeleteCampaigns, setSelectedDeleteCampaigns] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [onDeleteCampaigns, setOnDeleteCampaigns] = useState(false);
  const [showInTrash, setShowInTrash] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoadData(true);
      try {
        const campaigns = await CampaignService.getAllCampaign();
        setCampaignList(campaigns.data.RESULT_DATA.filter(i => i.deletedAt === null));
        setDeletedCampaignList(campaigns.data.RESULT_DATA.filter(i => i.deletedAt !== null));
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
  }, [refresh]);

  const handleRefreshData = () => setRefresh(prevState => prevState + 1);
  const handleRefreshDataAfterAddRemoveProducts = async (campaignId, campaignName) => {
    setLoadData(true);
    try {
      const campaigns = await CampaignService.getAllCampaign();
      setCampaignList(campaigns.data.RESULT_DATA.filter(i => i.deletedAt === null));
      handleSelectedCampaign(campaignId, campaignName, campaigns.data.RESULT_DATA);
    }
    catch(error) {
      console.log(error.message);
      toast.error(error.message);
    }
    finally {
      setLoadData(false);
    }
  }

  const handleSelectedCampaign = (id, name, campaignData) => {
    const productsInSelectedCampaign = campaignData.find(i => i.id === id);
    if(productsInSelectedCampaign) {
      setProductListCampaign(productsInSelectedCampaign?.campaignProducts);
    }
    setSelectedCampaign({
      id: id,
      name: name
    });
  }

  const handleResetToCreate = () => {
    setUpsertAction('CREATE');
    setSelectEditCampaign(null);
  }

  const handleConfirmDelete = async () => {
    setOnDeleteCampaigns(true);
    try {
      await CampaignService.deleteCampaigns(selectedDeleteCampaigns, authUser.id)
        .then(res => {
          handleRefreshData();
          toast.success(`Delete campaigns is successfully.`);
          setSelectedCampaign(null);
          setSelectedDeleteCampaigns([]);
          setOpenDeleteDialog(false);
        })
        .catch(error => {
          throw new Error(`Delete campaigns is failed due to: ${error}`);
        }); 
    }
    catch(error) {
      console.log(error.message);
      toast.error(error.message);
    }
    finally {
      setOnDeleteCampaigns(false);
    }
  }

  if(loadData) return <div>กำลังโหลด...</div>

  return (
    <div className={`page`}>
      
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1>Campaigns</h1>
            <Breadcrumbs />
          </div>
          <div>
            <button 
              type="button"
              className='btn btn-primary text-bg-primary'
              onClick={() => {
                setUpsertAction('CREATE');
                setSelectEditCampaign(null);
                setOpenUpsertCampaignDialog(true);
              }}
            >+ Create New Campaign</button>
          </div>
        </header>

        <div className='col-sm-8'>
          <div className="card">
            <div className="card-body">

              <div className='d-flex justify-content-between align-items-center mb-3'>
                {
                  !showInTrash ?
                  <div className='d-flex'>
                    <button 
                      type="button"
                      className='btn btn-danger me-2'
                      disabled={(selectedDeleteCampaigns.length === 0)}
                      onClick={() => setOpenDeleteDialog(true)}
                    >Delete</button>
                    <button 
                      type="button"
                      className='btn btn-danger'
                      onClick={() => setShowInTrash(prevState => !prevState)}
                    ><FontAwesomeIcon icon={faTrash} className='me-1' />({deletedCampaignList.length})
                    </button>
                  </div>
                  :
                  <button 
                    type="button"
                    className='btn btn-primary'
                    onClick={() => setShowInTrash(prevState => !prevState)}
                  >Back</button>
                }
                <div>
                  <InputGroup className="">
                    <Form.Control
                      placeholder="Search campaign"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                    />
                    <Button variant="primary" id="button-addon2">
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </InputGroup>
                </div>
              </div>

              {
                !showInTrash &&
                <>
                {
                  campaignList.length > 0 ?
                  <>
                  <table className="table">
                    <thead className='table-secondary'>
                      <tr>
                        <th style={{width: '36px'}}></th>
                        <th style={{width: '340px'}}>
                          <div className='d-flex align-items-center'>
                            Campaign Name
                            <FontAwesomeIcon icon={faArrowUp} className='ms-1' />
                          </div>
                        </th>
                        <th>
                          <div className='d-flex align-items-center'>
                            Discount
                            <FontAwesomeIcon icon={faArrowUp} className='ms-1' />
                          </div>
                        </th>
                        <th>Status</th>
                        <th>Start</th>
                        <th>End</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        campaignList.map((campaign, index) => (
                          <tr key={`category_row_${campaign.id}`}>
                            <td>
                              <Form.Check
                                type={"checkbox"}
                                id={`select-campaign`}
                                label={``}
                                checked={(selectedDeleteCampaigns.filter(i => i === campaign.id).length > 0)}
                                onChange={(e) => {
                                  const tempSelectedDeletedCampaigns = [...selectedDeleteCampaigns];
                                  if(e.target.checked === true) {
                                    tempSelectedDeletedCampaigns.push(campaign.id);
                                    setSelectedDeleteCampaigns(tempSelectedDeletedCampaigns);
                                  }
                                  else {
                                    const removeResult = tempSelectedDeletedCampaigns.filter(i => i !== campaign.id);
                                    setSelectedDeleteCampaigns(removeResult);
                                  }
                                }}
                              />
                            </td>
                            <td>
                              <Link 
                                to={null} 
                                onClick={() => handleSelectedCampaign(campaign.id, campaign.name, campaignList)}>{campaign?.name}</Link>
                              <br />
                              <small style={{opacity: '0.5'}}>{campaign?.description}</small>
                            </td>
                            <td>-{campaign?.discount}%</td>
                            <td>
                              <button
                                type="button"
                                className='btn btn-link p-0'
                                onClick={() => {
                                  setSelectActivateCampaign({
                                    id: campaign.id,
                                    isActive: campaign.isActive,
                                    startAt: campaign.startAt ? dayjs(campaign.startAt) : null,
                                    endAt: campaign.endAt ? dayjs(campaign.endAt) : null
                                  });
                                  setOpenActivateCampaignDialog(true);
                                }}
                              >
                              <small className={`badge ${campaign?.isActive === true ? 'text-bg-success' : 'text-bg-secondary'}`}>
                                {campaign?.isActive === true ? 'active' : 'inactive'}
                              </small>
                              </button>
                            </td>
                            <td>{campaign?.isActive ? formatTimestamp(campaign?.startAt) : '-'}</td>
                            <td>{campaign?.isActive ? formatTimestamp(campaign?.endAt) : '-'}</td>
                            <td>
                              <div className='d-flex'>
                                <button 
                                  type="button"
                                  className='btn btn-primary'
                                  onClick={() => {
                                    setUpsertAction('EDIT');
                                    setSelectEditCampaign({
                                      id: campaign.id,
                                      name: campaign.name,
                                      description: campaign.description,
                                      discount: campaign.discount
                                    });
                                    setOpenUpsertCampaignDialog(true);
                                  }}
                                ><FontAwesomeIcon icon={faEdit} /></button>
                              </div>
                            </td>
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
                  <div className='text-center py-5'>
                    <p className='h4'>Create new campaign</p>
                    <button 
                      type="button"
                      className='btn btn-primary text-bg-primary mt-2'
                      onClick={() => {
                        setUpsertAction('CREATE');
                        setSelectEditCampaign(null);
                        setOpenUpsertCampaignDialog(true);
                      }}
                    >+ Create New Campaign</button>
                  </div>
                }
                </>
              }
              
              {
                showInTrash &&
                <>
                {
                  deletedCampaignList.length > 0 ?
                  <>
                  <table className="table">
                    <thead className='table-secondary'>
                      <tr>
                        <th style={{width: '500px'}}>
                          <div className='d-flex align-items-center'>
                            Campaign Name
                            <FontAwesomeIcon icon={faArrowUp} className='ms-1' />
                          </div>
                        </th>
                        <th>
                          <div className='d-flex align-items-center'>
                            Discount
                            <FontAwesomeIcon icon={faArrowUp} className='ms-1' />
                          </div>
                        </th>
                        <th>Created at</th>
                        <th>Deleted at</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        deletedCampaignList.map((campaign, index) => (
                          <tr key={`category_row_${campaign.id}`}>
                            <td>
                              {campaign?.name}
                              <br />
                              <small style={{opacity: '0.5'}}>{campaign?.description}</small>
                            </td>
                            <td>-{campaign?.discount}%</td>
                            <td>{formatTimestamp(campaign?.createdAt)}</td>
                            <td>{formatTimestamp(campaign?.deletedAt)}</td>
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
                  <div className='text-center py-5'>
                    <p className='h5'>Trash is empty</p>
                  </div>
                }
                </>
              }

            </div>
          </div>
        </div>

        <div className='col-sm-4'>
          <div className='card'>
            <div className='card-body'>
              <ProductInCampaign 
                selectedCampaign={selectedCampaign}
                data={productListCampaign} 
                handleRefreshData={handleRefreshDataAfterAddRemoveProducts}
              />
            </div>
          </div>
        </div>

      </div>

      <Dialog open={openDeleteDialog}>
        <DialogContent>
          <p className='h3'>Do you confirm remove campaigns to trash?</p>
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
              setSelectedDeleteCampaigns([]);
              setOpenDeleteDialog(false)
            }}
          ><FontAwesomeIcon icon={faClose} className='me-2' />Cancel</button>
        </DialogActions>
      </Dialog>

      {
        openUpsertCampaignDialog &&
        <UpsertCampaign
          openDialog={openUpsertCampaignDialog}
          handleCloseDialog={() => setOpenUpsertCampaignDialog(false)}
          upsertAction={upsertAction}
          selectedEditCampaign={selectedEditCampaign}
          handleRefreshData={handleRefreshData}
          handleResetToCreate={handleResetToCreate}
        />
      }
      
      {
        openActivateCampaignDialog &&
        <ActivateCampaign
          openDialog={openActivateCampaignDialog}
          handleCloseDialog={() => setOpenActivateCampaignDialog(false)}
          selectedActivateCampaign={selectedActivateCampaign}
          handleRefreshData={handleRefreshData}
        />
      }

    </div>
  )
}