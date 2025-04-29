import { useState, useEffect } from 'react';
import * as CampaignService from '../../services/campaignService';
import { toast } from 'react-toastify';
import { formatTimestamp, formatMoney } from '../../utils/utils';

export default function ActiveCampaignCard() {

  const [loadData, setLoadData] = useState(false);
  const [campaignList, setCampaignList] = useState([]);

  useEffect(() => {
    const fecthCampaigns = async () => {
      setLoadData(true);
      try {
        const campaigns = await CampaignService.getAllCampaign();
        setCampaignList(campaigns.data.RESULT_DATA.filter(i => i.startAt !== null && i.endAt !== null));
      }
      catch(error) {
        console.log(error);
        toast.error(`Fetch campaigns is failed due to reason: ${error}`);
      }
      finally {
        setLoadData(false);
      }
    }

    fecthCampaigns();
  }, []);

  return (
    <div className="card">
      <div className="card-body" style={{minHeight: 320}}>
        <header className='d-flex justify-content-between align-items-center'>
          <h5 className='mb-0'>Active Campaign<span></span></h5>
        </header>
        {
          loadData
          ?
          <p className='h4 opacity-50 text-center my-5'>Loading...</p>
          :
          <>
          {
            campaignList.length > 0
            ?
            <table className='table mt-4'>
              <thead>
                <tr>
                  <th>Campaign Name</th>
                  <th>Discount</th>
                  <th>Have Products</th>
                  <th>Start at</th>
                  <th>End at</th>
                </tr>
              </thead>
              <tbody>
                {
                  campaignList.map((i, index) => {
                    return (
                      <tr key={`active_campaign_item_${i.id}`}>
                        <td>{i.name}</td>
                        <td>{i.discount}%</td>
                        <td>{i.campaignProducts.length}</td>
                        <td>{formatTimestamp(i.startAt)}</td>
                        <td>{formatTimestamp(i.endAt)}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            :
            <p className='h5 opacity-50 my-5 text-center'>Not have active campaigns right now</p>
          }
          </>
        }
      </div>
    </div>
  )
}