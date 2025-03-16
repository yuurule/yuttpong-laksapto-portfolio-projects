import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../components/MyPagination/MyPagination';
import { Link } from 'react-router';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import * as CampaignService from '../services/campaignService';
import { formatTimestamp } from '../utils/utils';
import { toast } from 'react-toastify';
import ProductInCampaign from '../components/Campaign/ProductInCampaign';
import UpsertCampaign from '../components/Campaign/UpsertCampaign';
import ActivateCampaign from '../components/Campaign/ActivateCampaign';

export default function Campaign() {

  const [loadData, setLoadData] = useState(false);
  const [campaignList, setCampaignList] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [productListCampaign, setProductListCampaign] = useState([]);

  const [selectedEditCampaign, setSelectEditCampaign] = useState(null);
  const [upsertAction, setUpsertAction] = useState(null); // 'CREATE', 'EDIT'
  const [openUpsertCampaignDialog, setOpenUpsertCampaignDialog] = useState(false);

  const [selectedActivateCampaign, setSelectActivateCampaign] = useState(null);
  const [openActivateCampaignDialog, setOpenActivateCampaignDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadData(true);
      try {
        const campaigns = await CampaignService.getAllCampaign();
        setCampaignList(campaigns.data.RESULT_DATA);
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
  }, []);

  const handleSelectedCampaign = (id, name) => {
    const productsInSelectedCampaign = campaignList.find(i => i.id === id);
    if(productsInSelectedCampaign) {
      setProductListCampaign(productsInSelectedCampaign?.campaignProducts);
    }
    setSelectedCampaign({
      id: id,
      name: name
    });
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
                <div className='d-flex'>
                  <button className='btn btn-danger me-2'>Delete</button>
                  <button className='btn btn-danger'>
                    <FontAwesomeIcon icon={faTrash} className='me-1' />(10)
                  </button>
                </div>
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
                          />
                        </td>
                        <td>
                          <Link 
                            to={null} 
                            onClick={() => handleSelectedCampaign(campaign.id, campaign.name)}>{campaign?.name}</Link>
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
                                startAt: campaign.startAt,
                                endAt: campaign.endAt
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
            </div>
          </div>
        </div>

        <div className='col-sm-4'>
          <div className='card'>
            <div className='card-body'>
              <ProductInCampaign 
                selectedCampaign={selectedCampaign}
                data={productListCampaign} 
              />
            </div>
          </div>
        </div>

      </div>

      <UpsertCampaign
        openDialog={openUpsertCampaignDialog}
        handleCloseDialog={() => setOpenUpsertCampaignDialog(false)}
        upsertAction={upsertAction}
        selectedEditCampaign={selectedEditCampaign}
      />

      <ActivateCampaign
        openDialog={openActivateCampaignDialog}
        handleCloseDialog={() => setOpenActivateCampaignDialog(false)}
        selectedActivateCampaign={selectedActivateCampaign}
      />

    </div>
  )
}