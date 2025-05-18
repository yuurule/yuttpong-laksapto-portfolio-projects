import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowLeft, faClose, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import MyPagination from '../components/MyPagination/MyPagination';
import { Link } from 'react-router';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import * as CampaignService from '../services/campaignService';
import { decodeJWT, formatTimestamp } from '../utils/utils';
import { toast } from 'react-toastify';
import ProductInCampaign from '../components/Campaign/ProductInCampaign';
import UpsertCampaign from '../components/Campaign/UpsertCampaign';
import ActivateCampaign from '../components/Campaign/ActivateCampaign';
import dayjs from 'dayjs';
import OrderByBtn from '../components/OrderByBtn/OrderByBtn';

export default function Campaign() {

  const authUser = useSelector(state => state.auth.user);
  const authToken = useSelector(state => state.auth.accessToken)
  const userRole = authToken ? decodeJWT(authToken).role : ''

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

  const setPageSize = 8;
  const [paramsQuery, setParamsQuery] = useState({
    page: 1,
    pageSize: setPageSize,
    pagination: true,
    orderBy: 'createdAt',
    orderDir: 'desc',
    search: null,
  });
  const [orderBy, setOrderBy] = useState([
    { column: 'name', value: null },
    { column: 'discount', value: null },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(null);
  const [useSearchQuery, setUseSearchQuery] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadData(true);
      try {
        const campaigns = await CampaignService.getAllCampaign(paramsQuery);
        setCampaignList(campaigns.data.RESULT_DATA.filter(i => i.deletedAt === null));
        //setDeletedCampaignList(campaigns.data.RESULT_DATA.filter(i => i.deletedAt !== null));
        setCurrentPage(campaigns.data.RESULT_META.currentPage);
        setTotalPage(campaigns.data.RESULT_META.totalPages);
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
    if(userRole === 'ADMIN') {
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
        console.log(error);
        toast.error(`${error}`);
      }
      finally {
        setOnDeleteCampaigns(false);
      }
    }
    else {
      toast.error(`You are in "Guest" mode, this action is not authorize.`)
    }
  }

  const handleChangeOrderBy = (columnName) => {
    const tempResult = [...orderBy];
    let newValue = null;
    tempResult.map(i => {
      if(i.column === columnName) {
        if(i.value === null) {
          i.value = 'desc';
          newValue = 'desc';
        }
        else if(i.value === 'desc') {
          i.value = 'asc';
          newValue = 'asc';
        }
        else if(i.value === 'asc') {
          i.value = null;
          newValue = null;
        }
      }
      else {
        i.value = null;
      }
    });

    const tempParamsQuery = handleResetParamsQuery();
    switch(columnName) {
      case 'name':
        if(newValue !== null) {
          tempParamsQuery.orderBy = 'name';
          tempParamsQuery.orderDir = newValue;
        }
        break;
      case 'discount':
        if(newValue !== null) {
          tempParamsQuery.orderBy = 'discount';
          tempParamsQuery.orderDir = newValue;
        }
        break;
    }

    setParamsQuery(tempParamsQuery);
    setOrderBy(tempResult);
  }
  const handleSearchQuery = () => {
    if(searchQuery !== null && searchQuery.trim() !== '') {
      const tempParamsQuery = handleResetParamsQuery();
      tempParamsQuery.search = searchQuery;
      setUseSearchQuery(searchQuery);
      setParamsQuery(tempParamsQuery);
    }
  }
  const handleClearSearchQuery = () => {
    setSearchQuery(null);
    setUseSearchQuery(null);
    const tempParamsQuery = handleResetParamsQuery();
    tempParamsQuery.search = null;
    setParamsQuery(tempParamsQuery);
  }
  const handleResetParamsQuery = () => {
    return {
      page: 1,
      pageSize: setPageSize,
      pagination: true,
      orderBy: 'createdAt',
      orderDir: 'desc',
      search: useSearchQuery,
    }
  }
  const handleSelectPage = (pageNumber) => {
    const tempParamsQuery = {...paramsQuery};
    tempParamsQuery.page = pageNumber;
    setParamsQuery(tempParamsQuery);
  }

  if(loadData) return <div>กำลังโหลด...</div>

  return (
    <div className={`page campaigns-page page-padding-btn`}>

      <header className="page-title">
        <h1>Campaigns</h1>
        <p>All campaigns sale off price for boost sell product</p>
      </header>
      
      <div className="row">
        <div className='col-12 mb-3'>
          <div className='d-flex justify-content-end'>
            <button 
                type="button"
                className='btn my-btn purple-btn big-btn'
                onClick={() => {
                  setUpsertAction('CREATE');
                  setSelectEditCampaign(null);
                  setOpenUpsertCampaignDialog(true);
                }}
              >+ Create New Campaign</button>
          </div>
        </div>
        <div className='col-lg-8 mb-3'>
          <div className="card">
            <div className="card-body">

              <div className='utils-head-table'>
                {
                  !showInTrash ?
                  <div className='utils-btn-group'>
                    <div>
                      <button 
                        type="button"
                        className='btn my-btn narrow-btn red-btn me-2'
                        disabled={(selectedDeleteCampaigns.length === 0)}
                        onClick={() => setOpenDeleteDialog(true)}
                      >
                        <FontAwesomeIcon icon={faTrash} className='me-2' />
                        Move to trash
                      </button>
                    </div>
                    <div>
                      <button 
                        className='btn my-btn narrow-btn gray-btn have-amount-label' 
                        onClick={() => setShowInTrash(prevState => !prevState)}
                      >
                        In Trash
                        <div className='amount-label'>{deletedCampaignList.length}</div>
                      </button>
                    </div>
                  </div>
                  :
                  <button 
                    type="button"
                    className='btn my-btn narrow-btn gray-btn'
                    onClick={() => setShowInTrash(prevState => !prevState)}
                  ><FontAwesomeIcon icon={faArrowLeft} className='me-1' /> Back</button>
                }
                <div className="search-input">
                  <InputGroup>
                    <Form.Control
                      value={searchQuery}
                      placeholder="Search campaign"
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                    />
                    {
                      (searchQuery !== null && (searchQuery.trim()) !== '') &&
                      <Button
                        type="button"
                        style={{borderRight: 'none'}}
                        title="clear search"
                        onClick={handleClearSearchQuery}
                      >
                        <FontAwesomeIcon icon={faClose} />
                      </Button>
                    }
                    <Button
                      type="button"
                      onClick={handleSearchQuery}
                    >
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
                  <div className='table-responsive'>
                    <table className="table">
                      <thead>
                        <tr>
                          <th className='selectRow'></th>
                          <th style={{width: '340px'}}>
                            Campaign Name
                            <OrderByBtn 
                              currentStatus={orderBy[0].value}
                              handleOnClick={() => handleChangeOrderBy('name')}
                            />
                          </th>
                          <th>
                            Discount
                            <OrderByBtn 
                              currentStatus={orderBy[1].value}
                              handleOnClick={() => handleChangeOrderBy('discount')}
                            />
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
                              <td className='selectRow'>
                                <div className='flexCenterXY'>
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
                                </div>
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
                                    className='btn my-btn narrow-btn blue-btn px-3'
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
                  </div>
                  <div className='d-flex justify-content-center'>
                    <MyPagination
                      currentPage={currentPage}
                      totalPage={totalPage}
                      handleSelectPage={handleSelectPage}
                    />
                  </div>
                  </>
                  :
                  <div className='text-center py-5'>
                    <p className='h4'>Create new campaign</p>
                    <button 
                      type="button"
                      className='btn my-btn purple-btn mt-2'
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
                    <thead>
                      <tr>
                        <th style={{width: '500px'}}>
                          Campaign Name
                          
                        </th>
                        <th>
                          Discount
                          
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

        <div className='col-lg-4 mb-3'>
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

      <Dialog open={openDeleteDialog} className='custom-dialog'>
        <DialogContent>
          <p className='h4 text-center'>Do you confirm remove these campaigns to trash?</p>
        </DialogContent>
        <DialogActions className='d-flex justify-content-center'>
          <button 
            type="button"
            className='btn my-btn green-btn big-btn w-50'
            onClick={handleConfirmDelete}
          >
            <FontAwesomeIcon icon={faTrashAlt} className='me-2' />
            Yes, confirm
          </button>
          <button 
            type="button"
            className='btn my-btn red-btn big-btn w-50'
            onClick={() => {
              setSelectedDeleteCampaigns([]);
              setOpenDeleteDialog(false)
            }}
          ><FontAwesomeIcon icon={faClose} className='me-2' />No, cancel</button>
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